import { TestBed } from '@angular/core/testing';

import { StaffDashboardService } from './staff-dashboard.service';

describe('StaffDashboard', () => {
  let service: StaffDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaffDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
