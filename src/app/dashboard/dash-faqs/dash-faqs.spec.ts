import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashFaqs } from './dash-faqs';

describe('DashFaqs', () => {
  let component: DashFaqs;
  let fixture: ComponentFixture<DashFaqs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashFaqs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashFaqs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
