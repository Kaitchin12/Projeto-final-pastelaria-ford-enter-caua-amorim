import { TestBed } from '@angular/core/testing';

import { InsumoService } from './insumos.service';

describe('InsumoService', () => {
  let service: InsumoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsumoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
