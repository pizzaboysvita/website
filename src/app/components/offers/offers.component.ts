import { Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CarouselModule, CarouselComponent, OwlOptions } from "ngx-owl-carousel-o";

@Component({
  selector: "app-offers",
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: "./offers.component.html",
  styleUrls: ["./offers.component.scss"],
})
export class OffersComponent {
  @ViewChild("owlCarousel", { static: false }) owlCarousel!: CarouselComponent;

  testimonials = [
    { name: "Deal 1", image: "assets/img/deals1.jpeg" },
    { name: "Deal 2", image: "assets/img/deals2.jpeg" },
    { name: "Deal 3", image: "assets/img/deals3.jpeg" },
    { name: "Deal 4", image: "assets/img/deals4.jpeg" },
    { name: "Deal 5", image: "assets/img/deals5.jpeg" },
  ];

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    dots: false,
    nav: false,
    items: 1,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    responsive: {
      0: { items: 1 },
      576: { items: 1 },
      768: { items: 1 },
      992: { items: 1 },
    },
  };

  prev(): void {
    if (!this.owlCarousel) return;
    const c = this.owlCarousel as any;
    if (typeof c.previous === "function") return c.previous();
    if (typeof c.prev === "function") return c.prev();
    if (typeof c.to === "function") {
      const idx = (c.slidesData?.active ? c.slidesData.active : 0) - 1;
      return c.to(idx);
    }
  }

  next(): void {
    if (!this.owlCarousel) return;
    const c = this.owlCarousel as any;
    if (typeof c.next === "function") return c.next();
    if (typeof c.nextSlide === "function") return c.nextSlide();
    if (typeof c.to === "function") {
      const idx = (c.slidesData?.active ? c.slidesData.active : 0) + 1;
      return c.to(idx);
    }
  }
}
