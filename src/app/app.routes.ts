import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { MenuComponent } from "./component/menu/menu.component";
import { AddcartComponent } from "./component/menu/addcart/addcart.component";

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

  { path: "**", redirectTo: "pages/404" },
];
