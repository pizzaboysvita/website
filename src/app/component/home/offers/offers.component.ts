import { Component } from "@angular/core";
import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";

@Component({
  selector: "app-offers",
  imports: [CarouselModule],
  templateUrl: "./offers.component.html",
  styleUrl: "./offers.component.scss",
})
export class OffersComponent {
  customOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    dots: false, // hide dots
    nav: true, // enable arrows
    navText: [
      '<span class="carousel-control-prev-icon" aria-hidden="true"></span>',
      '<span class="carousel-control-next-icon" aria-hidden="true"></span>',
    ],
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 },
    },
  };
}
