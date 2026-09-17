import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementComponent } from './paiement.component';

describe('Paiement', () => {
  let component: PaiementComponent;
  let fixture: ComponentFixture<PaiementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaiementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaiementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
