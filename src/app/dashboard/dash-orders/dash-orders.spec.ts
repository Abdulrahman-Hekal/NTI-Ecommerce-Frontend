import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashOrders } from './dash-orders';

describe('DashOrders', () => {
  let component: DashOrders;
  let fixture: ComponentFixture<DashOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
