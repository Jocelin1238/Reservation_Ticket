import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarAdminComponent } from './sidebar-admin.component';

describe('SidebarAdmin', () => {
  let component: SidebarAdminComponent;
  let fixture: ComponentFixture<SidebarAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarAdminComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
