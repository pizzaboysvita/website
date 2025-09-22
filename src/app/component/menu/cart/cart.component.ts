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
import { AuthService } from "../../../services/auth.service";
import { of, Subject } from "rxjs";
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
  token: string | null = null;
  user: any;
  cartItems: any[] = [];
  cartItems1: any[] = [];
  cartWithDishDetails: any[] = [];
  totalPrice: number = 0;
  notes: string = "";
  userId = 101;
  storeId = 33;
  subtotal = 1792.3;
  total = 1792.3;
  private destroy$ = new Subject<void>();
  constructor(
    private cartService: CartService,
    private router: Router,
    private apiservce: HomeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();

    const user1 = localStorage.getItem("user");
    if (user1) {
      this.user = JSON.parse(user1);
    }
    this.userId = this.user.user_id; // e.g., 63

    // Load dishes first
    this.apiservce.getDishes().subscribe({
      next: (res) => {
        this.cartItems1 = res.data; // ✅ all dishes

        // Now subscribe to cart items after dishes are available
        this.cartService.cartItems$.subscribe((items) => {
          this.cartItems = items.map((item) => {
            if (item.options_json) {
              item.options = JSON.parse(item.options_json);
            }
            return item;
          });

          console.log("Cart items updated:", this.cartItems);

          // 🔗 Filter by user_id + Merge cart + dishes
          this.cartWithDishDetails = this.cartItems
            .filter((item) => item.user_id === this.userId) // ✅ only this user’s cart
            .map((item) => {
              const dish = this.cartItems1.find(
                (d) => d.dish_id === item.dish_id
              );
              return {
                ...item,
                dish_name: dish?.dish_name || "Unknown Dish",
                dish_price: dish?.dish_price || item.price,
                dish_image: dish?.dish_image || null,
              };
            });
          this.calculateTotal();
          console.log(
            "cartWithDishDetails (User Only)",
            this.cartWithDishDetails
          );
        });

        // Load cart
        this.cartService.loadCart();
      },
      error: (err) => console.error("❌ Error fetching dishes:", err),
    });
  }
  removeItem1(index: number): void {
    const cartItemId = this.cartWithDishDetails[index].cart_id;
    const userId = this.cartWithDishDetails[index].user_id;
    this.cartService.removeItem1(cartItemId, userId).subscribe({
      error: (err) => console.error("Error removing item:", err),
    });
  }
  removeItem(index: number): void {
    const cartItemId = this.cartItems[index].id;
    this.cartService.removeItem(cartItemId).subscribe({
      error: (err) => console.error("Error removing item:", err),
    });
  }
  increaseQuantity(index: number): void {
    const item = this.cartWithDishDetails[index];
    this.cartService
      .addItem(
        this.userId,
        item.dish_id,
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
    const item = this.cartWithDishDetails[index];
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
    this.totalPrice = this.cartWithDishDetails.reduce((sum, item) => {
      console.log("Calculating item:", item);

      return sum + item.price * item.quantity;
    }, 0);
  }
  clearCart(): void {
    this.cartService.clearCart();
  }
  checkout(): void {
    console.log(" Proceed to checkout (hardcoded payload)");
    const orderData = {
      orderId: "#12345", // later you can replace with backend ID
      amountPaid: this.total,
      paymentMethod: "Cash",
      status: "Completed",
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
          quantity: 1,
        },
        {
          dish_id: 142,
          name: "extra_sauce",
          price: 250,
          quantity: 1,
        },
      ],
      ingredients_details: [
        {
          dish_id: 142,
          name: "extra onions",
          price: 1,
          quantity: 1,
        },
      ],
      order_details_json: [
        {
          dish_id: 158,
          dish_note: "abc",
          quantity: 1,
          price: 250,
        },
        {
          dish_id: 142,
          dish_note: "abcd",
          quantity: 1,
          price: 250,
          base: "small",
          base_price: 2,
        },
      ],
      payment_method: "Cash",
      payment_status: "Completed",
      payment_amount: 500,
      is_pos_order: 1,
      order_due: null,
      order_due_datetime: null,
      unitnumber: "POS-001",
      delivery_notes: null,
      gst_price: 2.25,
    };

    console.log(
      " Hardcoded Order Payload:",
      JSON.stringify(requestBody, null, 2)
    );

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
      },
    });
  }
}
