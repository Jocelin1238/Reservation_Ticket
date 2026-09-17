import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementsUserComponent } from './paiements-user.component';

describe('PaiementsUser', () => {
  let component: PaiementsUserComponent;
  let fixture: ComponentFixture<PaiementsUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaiementsUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaiementsUserComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
