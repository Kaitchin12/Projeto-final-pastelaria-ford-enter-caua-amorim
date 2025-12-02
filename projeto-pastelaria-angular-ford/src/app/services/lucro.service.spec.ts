import { TestBed } from '@angular/core/testing';

import { LucroService } from './lucro.service';

describe('LucroService', () => {
  let service: LucroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LucroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
