import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoyagesUserComponent } from './voyages-user.component';

describe('VoyagesUser', () => {
  let component: VoyagesUserComponent;
  let fixture: ComponentFixture<VoyagesUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoyagesUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VoyagesUserComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
