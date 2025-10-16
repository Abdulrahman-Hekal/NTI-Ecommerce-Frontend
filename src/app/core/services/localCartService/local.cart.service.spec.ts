import { TestBed } from '@angular/core/testing';

import { LocalCartService } from './local-cart-service';

describe('LocalCartService', () => {
  let service: LocalCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
