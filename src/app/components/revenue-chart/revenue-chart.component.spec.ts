import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueChartComponent } from './revenue-chart.component';

describe('RevenueChart', () => {
  let component: RevenueChartComponent;
  let fixture: ComponentFixture<RevenueChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenueChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RevenueChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
