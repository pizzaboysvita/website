import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { MenuComponent } from "./component/menu/menu.component";

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
  { path: "**", redirectTo: "pages/404" },
];
