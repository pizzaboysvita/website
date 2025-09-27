import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
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
  @ViewChild("introVideo") introVideoRef!: ElementRef<HTMLVideoElement>;
  constructor(private router: Router) {}
  ngOnInit(): void {
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
}
