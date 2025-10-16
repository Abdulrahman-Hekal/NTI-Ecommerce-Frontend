import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashCategories } from './dash-categories';

describe('DashCategories', () => {
  let component: DashCategories;
  let fixture: ComponentFixture<DashCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashCategories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashCategories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
