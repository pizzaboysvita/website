import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { CartService } from "../../../services/cart.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OrderComponent } from "../../../order/order.component";
import { AuthService } from "../../../services/auth.service";
@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  token: string | null = null;
  user: any;
  cartCount = 0;
  userName: string = "Mark Jecno";
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {}
  ngOnInit() {
    this.token = this.authService.getToken();
    let user1 = localStorage.getItem('user');
    if (user1) {
      this.user = JSON.parse(user1);
    }
    if (!this.token) {
      console.error("Authentication token not found.");
    }
    this.cartService.cartItems$.subscribe((items) => {
      console.log("Cart items updated:", items);
      this.cartCount = items.length;
    });
  }
  goToCart() {
    this.router.navigate(["/cart"]);
  }
  goToWishList() {
    this.router.navigate(["/wishlist"]);
  }
  logout() {
    this.authService.logout();
    this.token = null;
    this.router.navigate(["/login"]);
  }
  openOrderDialog() {
    this.modalService.open(OrderComponent, { size: "lg", centered: true });
  }
  initMap() {
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: { lat: 17.385044, lng: 78.486671 }, // Example coordinates (Hyderabad)
        zoom: 12,
      }
    );
    // Example marker
    new google.maps.Marker({
      position: { lat: 17.385044, lng: 78.486671 },
      map,
      title: "Pizza Boys",
    });
  }
}
