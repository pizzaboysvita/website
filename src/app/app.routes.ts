import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AddcartComponent } from "./component/menu/addcart/addcart.component";
import { ContactusComponent } from "./contactus/contactus.component";
import { StoreComponent } from "./store/store.component";
import { OfferComponent } from "./offer/offer.component";
import { CartComponent } from "./component/menu/cart/cart.component";
import { MenuComponent } from "./menu/menu.component";
import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";
import { AboutusComponent } from "./aboutus/aboutus.component";
import { WhishlistComponent } from "./component/dashboard/whishlist/whishlist.component";
import { OrderhistoryComponent } from "./component/dashboard/orderhistory/orderhistory.component";
import { CheckoutComponent } from "./component/menu/cart/checkout/checkout.component";
export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    data: { breadcrumb: "Home" },
  },
  {
    path: "home",
    component: HomeComponent,
    data: { breadcrumb: "Home" },
  },
  {
    path: "menu",
    component: MenuComponent,
    data: { breadcrumb: "Menu" },
  },
  {
    path: "dishDetail/:id",
    component: AddcartComponent,
    data: { breadcrumb: "Dish Detail" },
  },
  {
    path: "contactus",
    component: ContactusComponent,
    data: { breadcrumb: "Contact Us" },
  },
  {
    path: "cart",
    component: CartComponent,
    data: { breadcrumb: "Cart" },
  },
  {
    path: "stores",
    component: StoreComponent,
    data: { breadcrumb: "Stores" },
  },
  {
    path: "offers",
    component: OfferComponent,
    data: { breadcrumb: "Offers" },
  },
  {
    path: "wishlist",
    component: WhishlistComponent,
    data: { breadcrumb: "Wishlist" },
  },
  {
    path: "myorders",
    component: OrderhistoryComponent,
    data: { breadcrumb: "My Orders" },
  },
  {
    path: "aboutus",
    component: AboutusComponent,
    data: { breadcrumb: "About Us" },
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path:"checkout",
    component:CheckoutComponent
  },
  { path: "**", redirectTo: "pages/404" },
];
