import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
  isCurtainsOpen = false;

  @ViewChild('introVideo') introVideoRef!: ElementRef<HTMLVideoElement>;

  ngOnInit(): void {
    // Start curtain animation
    setTimeout(() => {
      this.isCurtainsOpen = true;

      // Play video after curtains fully open
      setTimeout(() => {
        const video = this.introVideoRef.nativeElement;
        video.muted = true;
        video.play().catch(err => console.warn('Autoplay blocked:', err));

        // Add fade-in effect
        video.classList.add('show');
      }, 1600); // Matches curtain animation time
    }, 5000);
  }
}
