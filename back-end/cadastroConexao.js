
const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// CONFIGURAÇÃO DO BANCO
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Amorim#2210", 
  database: "usuario"
});

connection.connect(err => {
  if (err) console.log("Erro ao conectar com o banco:", err);
  else console.log("Banco conectado com sucesso");
});

// --- ROTAS DE USUÁRIO (LOGIN/CADASTRO) ---
app.post('/cadastrar', (req, res) => {
  const { nome, email, senha } = req.body;
  const sql = "INSERT INTO usuarioCadastro (nome,email,senha) VALUES (?, ?, ?)";
  connection.query(sql, [nome, email, senha], err => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao cadastrar' });
    res.json({ success: true, message: 'Usuário cadastrado' });
  });
});

app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const sql = "SELECT nome, email FROM usuarioCadastro WHERE email = ? AND senha = ?";
  connection.query(sql, [email, senha], (err, results) => {
    if (err) return res.status(500).json({ success: false });
    if (results.length > 0) return res.json({ success: true, usuario: results[0] });
    return res.status(401).json({ success: false, message: 'Inválido' });
  });
});

// --- ROTAS DE INSUMOS (CRUD) ---
app.post('/cadastrarInsumo', (req, res) => {
  const { nome, quantidade, preco_kg } = req.body;
  const sql = "INSERT INTO insumosCadastro (nome,quantidade,preco_kg) VALUES (?, ?, ?)";
  connection.query(sql, [nome, quantidade, preco_kg], err => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});

app.get('/insumos', (req, res) => {
  const sql = "SELECT * FROM insumosCadastro ORDER BY id DESC";
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false });
    res.json(results);
  });
});

app.post('/updateInsumo', (req, res) => {
  const { id, quantidade,nome,preco_kg } = req.body;
  const sql = "UPDATE insumosCadastro SET quantidade = ?, nome = ?, preco_kg = ? WHERE id = ?";
  connection.query(sql, [quantidade, nome, preco_kg, id], (err) => res.json({ success: !err }));
});

app.post('/deletarInsumo', (req, res) => {
  const { id } = req.body;
  const sql = "DELETE FROM insumosCadastro WHERE id = ?";
  connection.query(sql, [id], err => res.json({ success: !err }));
});

// --- ROTA DE VENDA PERSONALIZADA (CORE DO SISTEMA) ---
app.post('/vendaPersonalizada', (req, res) => {
  const { itens, valor_total } = req.body; 

  if (!itens || itens.length === 0) {
    return res.status(400).json({ message: "Nenhum insumo selecionado." });
  }

  // 1. Calcular Custo e Validar Estoque (Promises)
  const promises = itens.map(item => {
    return new Promise((resolve, reject) => {
      const sqlBusca = "SELECT preco_kg, quantidade FROM insumosCadastro WHERE id = ?";
      connection.query(sqlBusca, [item.id], (err, results) => {
        if (err || results.length === 0) return reject("Insumo não encontrado");
        
        const dados = results[0];
        const gramas = parseFloat(item.quantidade_usada);
        const custoItem = (gramas / 1000) * dados.preco_kg; 

        resolve({ id: item.id, gramas: gramas, custo: custoItem });
      });
    });
  });

  Promise.all(promises)
    .then(resultados => {
      // 2. Calcular Lucro
      const custoTotal = resultados.reduce((acc, curr) => acc + curr.custo, 0);
      const lucro = valor_total - custoTotal;

      // 3. Baixar Estoque
      resultados.forEach(item => {
        const qtdBaixa = item.gramas / 1000; // Converte g para kg
        const sqlUpdate = "UPDATE insumosCadastro SET quantidade = quantidade - ? WHERE id = ?";
        connection.query(sqlUpdate, [qtdBaixa, item.id]);
      });

      // 4. Registrar Venda (ID 1 = Pastel Personalizado)
      const sqlVenda = `
        INSERT INTO vendas (pastel_id, quantidade, valor_total, custo_total, lucro, data_venda)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;
      
      connection.query(sqlVenda, [1, 1, valor_total, custoTotal, lucro], (err) => {
        if (err) return res.status(500).json({ message: "Erro ao gravar venda" });
        
        res.json({
          success: true,
          message: "Venda realizada!",
          lucro: lucro,
          custoTotal: custoTotal
        });
      });
    })
    .catch(err => res.status(500).json({ message: "Erro ao processar venda" }));
});

// --- ROTA DE LUCRO TOTAL ---
app.get('/obterLucroTotal', (req, res) => {
  const sql = "SELECT SUM(lucro) as total FROM vendas";
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar lucro' });
    const total = results[0].total || 0;
    res.json({ total: total });
  });
});

app.listen(2009, () => console.log('API rodando em http://localhost:2009'));  