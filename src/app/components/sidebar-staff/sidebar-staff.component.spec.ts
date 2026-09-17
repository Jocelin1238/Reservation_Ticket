import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarStaffComponent} from './sidebar-staff.component';

describe('SidebarStaff', () => {
  let component: SidebarStaffComponent;
  let fixture: ComponentFixture<SidebarStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarStaffComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarStaffComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
