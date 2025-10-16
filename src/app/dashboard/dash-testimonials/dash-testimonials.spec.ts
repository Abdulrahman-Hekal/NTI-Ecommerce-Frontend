import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashTestimonials } from './dash-testimonials';

describe('DashTestimonials', () => {
  let component: DashTestimonials;
  let fixture: ComponentFixture<DashTestimonials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashTestimonials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashTestimonials);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
