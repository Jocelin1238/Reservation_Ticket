import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarStaffComponent } from './topbar-staff.component';

describe('TopbarStaff', () => {
  let component: TopbarStaffComponent;
  let fixture: ComponentFixture<TopbarStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarStaffComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopbarStaffComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
