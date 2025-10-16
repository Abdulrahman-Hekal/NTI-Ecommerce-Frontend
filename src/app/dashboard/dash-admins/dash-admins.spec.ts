import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashAdmins } from './dash-admins';

describe('DashAdmins', () => {
  let component: DashAdmins;
  let fixture: ComponentFixture<DashAdmins>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashAdmins]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashAdmins);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
