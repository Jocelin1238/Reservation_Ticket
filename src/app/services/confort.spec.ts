import { TestBed } from '@angular/core/testing';

import { ConfortService } from './confort';

describe('Confort', () => {
  let service: ConfortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
