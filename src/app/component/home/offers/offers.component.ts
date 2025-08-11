import { Component } from "@angular/core";
import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";

@Component({
  selector: "app-offers",
  imports: [CarouselModule],
  templateUrl: "./offers.component.html",
  styleUrl: "./offers.component.scss",
})
export class OffersComponent {
  public customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 0,
    autoplayHoverPause: true,
    dots: false,
    margin: 32,
    items: 2.5,
    autoplaySpeed: 10000,
    touchDrag: true,
    responsive: {
      0: {
        items: 1,
      },
      375: {
        items: 1.2,
      },
      425: {
        items: 1.3,
      },
      576: {
        items: 1.5,
      },
      768: {
        items: 2,
      },
      992: {
        items: 2.5,
      },
    },
  };
}
