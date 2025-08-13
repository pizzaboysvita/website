import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CartService } from "../../../services/cart.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"], // styleUrls (plural)
})
export class HeaderComponent {
  cartCount = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe((items) => {
      console.log("Cart items updated:", items);
      
      this.cartCount = items.length;
    });
  }

  goToCart() {
    this.router.navigate(["/cart"]);
  }
}
