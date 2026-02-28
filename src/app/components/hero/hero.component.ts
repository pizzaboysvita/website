import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { HomeService } from "../../core/services/home.service";
import { StoreService } from "../../core/services/store.service";
import { Subject, switchMap, takeUntil } from "rxjs";
@Component({
  selector: "app-hero",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./hero.component.html",
  styleUrls: ["./hero.component.scss"],
})
export class HeroComponent implements OnInit {
  isCurtainsOpen = false;
  showPlayButton = false;
  bannersList: any[] = [];
  latestBanner: any;
  private destroy$ = new Subject<void>();
  @ViewChild("introVideo") introVideoRef!: ElementRef<HTMLVideoElement>;
  constructor(private router: Router,private homeService: HomeService,private storeService: StoreService) {}
  ngOnInit(): void {
    this.getBanners();
    // Start curtain animation
    setTimeout(() => {
      this.isCurtainsOpen = true;
      setTimeout(() => {
        const video = this.introVideoRef.nativeElement;
        video.muted = true; // ✅ ensure muted
        video.play().catch(() => {
          // If autoplay blocked, show manual play button
          this.showPlayButton = true;
        });
      }, 1000);
    }, 2000);
  }
  playVideo() {
    const video = this.introVideoRef.nativeElement;
    video.muted = true;
    video.play().then(() => {
      this.showPlayButton = false;
    });
  }
  goToMenu() {
    this.router.navigate(["menu"]);
  }


getBanners() {
    this.storeService.storeChanged$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.homeService.getBanners())
      )
      .subscribe({
        next: (res:any) => {
               if (res?.code === "1") {
                 this.bannersList = res.banners;
                 this.latestBanner = res.banners
                    .filter((b: any) => b.banner_video_url)
                    .sort((a: any, b: any) =>
                      new Date(b.created_on).getTime() - new Date(a.created_on).getTime()
                    )[0];
      }else {
            this.latestBanner = [];
            this.bannersList=[]
            console.warn("No Banner found");
          }
        },
        error: (err) => {
          console.error("Error fetching categories:", err);
          this.latestBanner = [];
            this.bannersList=[]
        },
      });


//   this.homeService.getBanners().subscribe({
//     next: (res: any) => {
//       if (res?.code === "1") {

//         this.bannersList = res.banners;

// this.latestBanner = res.banners
//   .filter((b: any) => b.banner_video_url)
//   .sort((a: any, b: any) =>
//     new Date(b.created_on).getTime() - new Date(a.created_on).getTime()
//   )[0];


//         // ✅ Get latest banner
//         // this.latestBanner = this.bannersList[0];

//         console.log("Latest Banner:", this.latestBanner);
//       }
//     },
//     error: (err: any) => {
//       console.error("Error fetching banners:", err);
//     },
//   });
}

}
