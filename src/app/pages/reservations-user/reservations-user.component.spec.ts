import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsUserComponent } from './reservations-user.component';

describe('ReservationsUser', () => {
  let component: ReservationsUserComponent;
  let fixture: ComponentFixture<ReservationsUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationsUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationsUserComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
