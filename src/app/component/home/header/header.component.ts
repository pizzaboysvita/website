import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { CartService } from "../../../services/cart.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OrderComponent } from "../../../order/order.component";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  cartCount = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
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
