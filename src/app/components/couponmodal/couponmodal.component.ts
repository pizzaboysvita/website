import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CouponService } from "../../core/services/coupon.service";
import { Subscription, interval } from "rxjs";

@Component({
  selector: "app-couponmodal",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./couponmodal.component.html",
  styleUrls: ["./couponmodal.component.scss"],
})
export class CouponmodalComponent implements OnInit, OnDestroy {
  show = false;
  currentIndex = 0;
  private sub!: Subscription;
  private autoSlideSub!: Subscription;
  coupons: any[] = [];

  constructor(private couponService: CouponService) {}

  ngOnInit() {
    this.sub = this.couponService.showCouponModal$.subscribe((val) => {
      this.show = val;
      if (val) {
        this.fetchCoupons();
      } else {
        this.stopAutoSlide();
      }
    });
  }

  fetchCoupons() {
    this.couponService.getCoupons().subscribe({
      next: (res: any) => {
        this.coupons = res?.data || [];
        this.startAutoSlide();
      },
      error: (err) => {
        console.error("Failed to fetch coupons:", err);
      },
    });
  }

  nextSlide() {
    if (!this.coupons.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.coupons.length;
  }

  prevSlide() {
    if (!this.coupons.length) return;
    this.currentIndex =
      (this.currentIndex - 1 + this.coupons.length) % this.coupons.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  startAutoSlide() {
    this.autoSlideSub = interval(3000).subscribe(() => this.nextSlide());
  }

  stopAutoSlide() {
    if (this.autoSlideSub) this.autoSlideSub.unsubscribe();
  }

  close() {
    this.stopAutoSlide();
    this.couponService.closeCouponModal();
    window.location.reload();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.stopAutoSlide();
  }
}
