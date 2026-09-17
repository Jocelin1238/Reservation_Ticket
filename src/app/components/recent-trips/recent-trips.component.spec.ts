import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentTripsComponent } from './recent-trips.component';

describe('RecentTrips', () => {
  let component: RecentTripsComponent;
  let fixture: ComponentFixture<RecentTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentTripsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentTripsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
