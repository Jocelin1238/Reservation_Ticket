import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportComponent } from './transport.component';

describe('Transport', () => {
  let component: TransportComponent;
  let fixture: ComponentFixture<TransportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransportComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
