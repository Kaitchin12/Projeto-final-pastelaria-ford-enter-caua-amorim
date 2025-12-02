import { Venda } from './venda.model';

export interface PedidoResponse {
  mensagem: string;
  venda: Venda;
}