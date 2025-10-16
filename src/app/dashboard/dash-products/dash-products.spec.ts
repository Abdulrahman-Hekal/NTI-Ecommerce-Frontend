import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashProducts } from './dash-products';

describe('DashProducts', () => {
  let component: DashProducts;
  let fixture: ComponentFixture<DashProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
