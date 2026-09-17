import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsDialogComponent } from './user-details-dialog.component';

describe('UserDetailsDialog', () => {
  let component: UserDetailsDialogComponent;
  let fixture: ComponentFixture<UserDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetailsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
