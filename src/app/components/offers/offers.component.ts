import { Component, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CarouselModule, CarouselComponent, OwlOptions } from "ngx-owl-carousel-o";
import { HomeService } from "../../core/services/home.service";
import { Subject, switchMap, takeUntil } from "rxjs";
import { StoreService } from "../../core/services/store.service";

@Component({
  selector: "app-offers",
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: "./offers.component.html",
  styleUrls: ["./offers.component.scss"],
})
export class OffersComponent {
  @ViewChild("owlCarousel", { static: false }) owlCarousel!: CarouselComponent;
  bannersList: any[];
  private destroy$ = new Subject<void>();
  
  testimonials = [
    { name: "Deal 1", image: "assets/img/deals1.jpeg" },
    { name: "Deal 2", image: "assets/img/deals2.jpeg" },
    { name: "Deal 3", image: "assets/img/deals3.jpeg" },
    { name: "Deal 4", image: "assets/img/deals4.jpeg" },
    { name: "Deal 5", image: "assets/img/deals5.jpeg" },
  ];
 constructor(
    private homeService: HomeService,private storeService: StoreService
  ) {
    this.getBanners();
  }
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
  getBanners(){
      this.storeService.storeChanged$
          .pipe(
            takeUntil(this.destroy$),
            switchMap(() => this.homeService.getBanners())
          )
          .subscribe({
            next: (res:any) => {
                   if (res?.code === "1") {
                     this.bannersList = res.banners;
                   }

                else {
                      this.bannersList=[]
                      console.warn("No Banner found");
                    }
                  },
            error: (err) => {
              console.error("Error fetching categories:", err);
                this.bannersList=[]
            },
          });
//  this.homeService.getBanners().subscribe({
//       next: (res: any) => {
//         if (res?.code === "1") {
//           this.bannersList = res.banners
 
//         }
//       },
//         error: (err:any) => {
//           console.error("Error fetching banners:", err);
//         },
//     });
  }
   
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
