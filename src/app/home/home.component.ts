import { Component } from "@angular/core";
import { HeaderComponent } from "../component/home/header/header.component";
import { FooterComponent } from "../component/home/footer/footer.component";
import { HeroComponent } from "../component/home/hero/hero.component";
import { OffersComponent } from "../component/home/offers/offers.component";
import { StoresComponent } from "../component/home/stores/stores.component";
import { CategoryComponent } from "../component/home/category/category.component";

@Component({
  selector: "app-home",
  imports: [
    HeaderComponent,
    FooterComponent,
    HeroComponent,
    OffersComponent,
    StoresComponent,
    CategoryComponent
],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent {}
