import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrateursComponent } from './administrateurs.component.';

describe('Administrateurs', () => {
  let component: AdministrateursComponent;
  let fixture: ComponentFixture<AdministrateursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrateursComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministrateursComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
