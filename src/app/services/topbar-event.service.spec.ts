import { TestBed } from '@angular/core/testing';

import { TopbarEventService } from './topbar-event.service';

describe('TopbarEvent', () => {
  let service: TopbarEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopbarEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
