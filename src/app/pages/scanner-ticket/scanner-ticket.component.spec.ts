import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannerTicket } from './scanner-ticket.component';

describe('ScannerTicket', () => {
  let component: ScannerTicket;
  let fixture: ComponentFixture<ScannerTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScannerTicket],
    }).compileComponents();

    fixture = TestBed.createComponent(ScannerTicket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
