import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponmodalComponent } from './couponmodal.component';

describe('CouponmodalComponent', () => {
  let component: CouponmodalComponent;
  let fixture: ComponentFixture<CouponmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponmodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouponmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
