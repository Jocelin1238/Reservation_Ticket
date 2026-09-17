import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoyageUserDetailComponent } from './voyage-user-detail.component';

describe('VoyageUserDetail', () => {
  let component: VoyageUserDetailComponent;
  let fixture: ComponentFixture<VoyageUserDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoyageUserDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VoyageUserDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
