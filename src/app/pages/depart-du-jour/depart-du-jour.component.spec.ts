import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartDuJourComponent } from './depart-du-jour.component';

describe('DepartDuJour', () => {
  let component: DepartDuJourComponent;
  let fixture: ComponentFixture<DepartDuJourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartDuJourComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartDuJourComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
