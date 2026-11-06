import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionVoyages } from './voyages.component';

describe('GestionVoyages', () => {
  let component: GestionVoyages;
  let fixture: ComponentFixture<GestionVoyages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionVoyages],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionVoyages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
