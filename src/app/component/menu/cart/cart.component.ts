import { Component, OnInit } from "@angular/core";
import { CartService, CartItem } from "../../../services/cart.service";
import { HeaderComponent } from "../../home/header/header.component";
import { FooterComponent } from "../../home/footer/footer.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BreadcrumbComponent } from "../../../shared/breadcrumb/breadcrumb.component";

@Component({
  selector: "app-cart",
  standalone: true,
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
  ],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  notes: string = "";
  userId = 101;
  storeId = 33;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.calculateTotal();
      console.log("Cart items updated:", this.cartItems);
    });

    this.cartService.loadCart();
  }

  removeItem(index: number): void {
    const cartItemId = this.cartItems[index].id;
    this.cartService.removeItem(cartItemId).subscribe({
      error: (err) => console.error("Error removing item:", err),
    });
  }

  increaseQuantity(index: number): void {
    const item = this.cartItems[index];
    this.cartService
      .addItem(
        this.userId,
        item.id,
        this.storeId,
        item.price,
        item.quantity + 1,
        item.options
      )
      .subscribe({
        error: (err) => console.error("Error increasing quantity:", err),
      });
  }

  decreaseQuantity(index: number): void {
    const item = this.cartItems[index];
    if (item.quantity > 1) {
      this.cartService
        .addItem(
          this.userId,
          item.id,
          this.storeId,
          item.price,
          item.quantity - 1,
          item.options
        )
        .subscribe({
          error: (err) => console.error("Error decreasing quantity:", err),
        });
    } else {
      this.removeItem(index);
    }
  }

  calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    console.log("Proceed to checkout", this.cartItems);
  }
}
