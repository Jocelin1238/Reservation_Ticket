import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStaffComponent } from './dashboard-staff.component';

describe('DashboardStaff', () => {
  let component: DashboardStaffComponent;
  let fixture: ComponentFixture<DashboardStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardStaffComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardStaffComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
