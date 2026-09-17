import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationChartComponent } from './reservation-chart.component';

describe('ReservationChart', () => {
  let component: ReservationChartComponent;
  let fixture: ComponentFixture<ReservationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
