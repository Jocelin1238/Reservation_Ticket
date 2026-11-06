import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsUserComponent } from './tickets-user.cmponent';

describe('TicketsUser', () => {
  let component: TicketsUserComponent;
  let fixture: ComponentFixture<TicketsUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketsUserComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
