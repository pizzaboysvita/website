import { Component } from "@angular/core";
import { HeaderComponent } from "../component/common/header/header.component";
import { HeroComponent } from "../component/home/hero/hero.component";
import { CategoryComponent } from "../component/home/category/category.component";
import { OffersComponent } from "../component/home/offers/offers.component";
import { PopularComponent } from "../component/home/popular/popular.component";
import { FooterComponent } from "../component/common/footer/footer.component";
// import { StoresComponent } from "../component/home/stores/stores.component";
@Component({
  selector: "app-home",
  imports: [
    HeaderComponent,
    HeroComponent,
    CategoryComponent,
    OffersComponent,
    PopularComponent,
    FooterComponent,
    // // StoresComponent,
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent {}
