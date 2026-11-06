import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarUserComponent } from './topbar-user.component';

describe('TopbarUser', () => {
  let component: TopbarUserComponent;
  let fixture: ComponentFixture<TopbarUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopbarUserComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
