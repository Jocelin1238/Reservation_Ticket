import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentBookingsComponent } from './recent-bookings.component';

describe('RecentBookings', () => {
  let component: RecentBookingsComponent;
  let fixture: ComponentFixture<RecentBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentBookingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentBookingsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
