import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/home/home.component").then((m) => m.HomeComponent),
    data: { breadcrumb: "Home" },
  },
  {
    path: "home",
    loadComponent: () =>
      import("./pages/home/home.component").then((m) => m.HomeComponent),
    data: { breadcrumb: "Home" },
  },
  {
    path: "menu",
    loadComponent: () =>
      import("./pages/menu/menu.component").then((m) => m.MenuComponent),
    data: { breadcrumb: "Menu" },
  },
  {
    path: "stores",
    loadComponent: () =>
      import("./pages/store/store.component").then((m) => m.StoreComponent),
    data: { breadcrumb: "Store" },
  },
  {
    path: "offers",
    loadComponent: () =>
      import("./pages/offer/offer.component").then((m) => m.OfferComponent),
    data: { breadcrumb: "Offer" },
  },
  {
    path: "about",
    loadComponent: () =>
      import("./pages/about/about.component").then((m) => m.AboutComponent),
    data: { breadcrumb: "About Us" },
  },
  {
    path: "contact",
    loadComponent: () =>
      import("./pages/contact/contact.component").then(
        (m) => m.ContactComponent
      ),
    data: { breadcrumb: "Contact" },
  },
  {
    path: "register",
    loadComponent: () =>
      import("./pages/register/register.component").then(
        (m) => m.RegisterComponent
      ),
    data: { breadcrumb: "Register" },
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/login/login.component").then(
        (m) => m.LoginComponent
      ),
    data: { breadcrumb: "Login" },
  },
  {
    path: "item/:id",
    loadComponent: () =>
      import("./pages/item/item.component").then(
        (m) => m.ItemComponent
      ),
    data: { breadcrumb: "Dish Details" },
  },
  {
    path: "myorders",
    loadComponent: () =>
      import("./components/myorders/myorders.component").then(
        (m) => m.MyOrdersComponent
      ),
    data: { breadcrumb: "MyOrders" },
  },
  {
    path: "wishlist",
    loadComponent: () =>
      import("./components/wishlist/wishlist.component").then(
        (m) => m.WishlistComponent
      ),
    data: { breadcrumb: "Wishlist" },
  },
  {
    path: "cartlist",
    loadComponent: () =>
      import("./components/cartlist/cartlist.component").then(
        (m) => m.CartlistComponent
      ),
    data: { breadcrumb: "Cartlist" },
  },
  {
    path: "checkout",
    loadComponent: () =>
      import("./components/checkout/checkout.component").then(
        (m) => m.CheckoutComponent
      ),
    data: { breadcrumb: "Checkout" },
  },
  {
    path: "profile",
    loadComponent: () =>
      import("./components/profile/profile.component").then(
        (m) => m.ProfileComponent
      ),
    data: { breadcrumb: "Profile" },
  },
  { path: "**", redirectTo: "" },
];