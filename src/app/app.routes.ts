import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { MenuComponent } from "./component/menu/menu.component";
import { AddcartComponent } from "./component/menu/addcart/addcart.component";
import { ContactusComponent } from "./contactus/contactus.component";
import { StoreComponent } from "./store/store.component";
import { OfferComponent } from "./offer/offer.component";
import { CartComponent } from "./component/menu/cart/cart.component";

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "menu",
    component: MenuComponent,
  },
  {
    path: "dishDetail/:id",
    component: AddcartComponent,
  },
  {
    path: "contactus",
    component: ContactusComponent,
  },
  {
    path: "cart",
    component: CartComponent,
  },
  { path: "stores", component: StoreComponent },
  { path: "offers", component: OfferComponent },
  { path: "**", redirectTo: "pages/404" },
];
