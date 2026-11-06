import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserDialogComponent } from './edit-user-dialog.component';

describe('EditUserDialog', () => {
  let component: EditUserDialogComponent;
  let fixture: ComponentFixture<EditUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUserDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditUserDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
