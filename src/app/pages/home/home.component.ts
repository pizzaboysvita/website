import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from "../../components/hero/hero.component";
import { OffersComponent } from '../../components/offers/offers.component';
import { CategoryComponent } from "../../components/category/category.component";
import { ThemeService } from '../../core/services/theme.service';
import { PopularComponent } from "../../components/popular/popular.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroComponent, OffersComponent, CategoryComponent, PopularComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  
  constructor(public themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.toggleTheme();
  }
}
