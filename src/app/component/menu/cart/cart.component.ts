// src/app/component/menu/cart/cart.component.ts
import { Component, OnInit } from "@angular/core";
import { CartService } from "../../../services/cart.service";
import { HeaderComponent } from "../../common/header/header.component";
import { FooterComponent } from "../../common/footer/footer.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BreadcrumbComponent } from "../../common/breadcrumb/breadcrumb.component";
import { Router } from "@angular/router";
import { HomeService } from "../../../services/home.service";
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
  cartItems: any[] = [];
  totalPrice: number = 0;
  notes: string = "";
  userId = 101;
  storeId = 33;
  subtotal = 1792.30;
  total = 1792.30;
  constructor(private cartService: CartService, private router: Router, private apiservce: HomeService) { }
  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items.map((item) => {
        if (item.options_json) {
          item.options = JSON.parse(item.options_json);
        }
        return item;
      });
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
    console.log(" Proceed to checkout (hardcoded payload)");
    const orderData = {
      orderId: '#12345',              // later you can replace with backend ID
      amountPaid: this.total,
      paymentMethod: 'Cash',
      status: 'Completed'
    };
    const requestBody = {
      total_price: 500,
      total_quantity: 2,
      store_id: 1,
      order_type: "test",
      pickup_datetime: "2025-08-18 15:00:00",
      delivery_address: null,
      delivery_fees: 0,
      delivery_datetime: null,
      order_notes: "Customer will pick up",
      order_status: "Order_placed",
      order_created_by: 101,
      topping_details: [
        {
          dish_id: 142,
          name: "extra_cheese",
          price: 250,
          quantity: 1
        },
        {
          dish_id: 142,
          name: "extra_sauce",
          price: 250,
          quantity: 1
        }
      ],
      ingredients_details: [
        {
          dish_id: 142,
          name: "extra onions",
          price: 1,
          quantity: 1
        }
      ],
      order_details_json: [
        {
          dish_id: 158,
          dish_note: "abc",
          quantity: 1,
          price: 250
        },
        {
          dish_id: 142,
          dish_note: "abcd",
          quantity: 1,
          price: 250,
          base: "small",
          base_price: 2
        }
      ],
      payment_method: "Cash",
      payment_status: "Completed",
      payment_amount: 500,
      is_pos_order: 1,
      order_due: null,
      order_due_datetime: null,
      unitnumber: "POS-001",
      delivery_notes: null,
      gst_price: 2.25
    };

    console.log(" Hardcoded Order Payload:", JSON.stringify(requestBody, null, 2));

    this.apiservce.addOrder(requestBody).subscribe({
      next: (data: any) => {
        console.log(" Order placed:", data);

        // optional: clear cart
        this.cartItems = [];
        localStorage.removeItem("cart");

        this.router.navigate(["/checkout"], { state: { order: orderData } });
      },
      error: (err) => {
        console.error(" Error placing order:", err);
      }
    });
  }




}
