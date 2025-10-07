import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { CartService } from "../../core/services/cart.service";
import { HomeService } from "../../core/services/home.service";
import { AuthService } from "../../core/services/auth.service";
import { StoreService } from "../../core/services/store.service";

interface Dish {
  dish_id: number;
  dish_name: string;
  dish_price: number;
  dish_image?: string | null;
}

interface CartItem {
  cart_id: number;
  user_id: number;
  dish_id: number;
  quantity: number;
  price: number;
  options?: any;
  options_json?: string;
}

interface CartWithDishDetails extends CartItem {
  dish_name: string;
  dish_price: number;
  dish_image?: string | null;
}

@Component({
  selector: "app-cartlist",
  standalone: true,
  templateUrl: "./cartlist.component.html",
  styleUrls: ["./cartlist.component.scss"],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
  ],
})
export class CartlistComponent implements OnInit {
  token: string | null = null;
  user: { user_id: number; store_id: number } | null = null;

  cartItems: CartItem[] = [];
  dishes: Dish[] = [];
  cartWithDishDetails: CartWithDishDetails[] = [];

  totalPrice: number = 0;
  notes: string = "";

  constructor(
    private cartService: CartService,
    private homeService: HomeService,
    private authService: AuthService,
    private router: Router,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }

    // Fetch all dishes
    this.homeService.getDishes().subscribe({
      next: (res) => {
        this.dishes = res.data as Dish[];

        // Subscribe to cart updates
        this.cartService.cartItems$.subscribe((items) => {
          this.cartItems = items.map((item: CartItem) => {
            if (item.options_json) item.options = JSON.parse(item.options_json);
            return item;
          });

          this.mergeCartWithDishes();
          this.calculateTotal();
        });

        if (this.user && this.user.user_id !== undefined) {
          this.cartService.loadCart(this.user.user_id);
        }
      },
      error: (err) => console.error("Error fetching dishes:", err),
    });
  }

  mergeCartWithDishes(): void {
    if (!this.user) return;

    this.cartWithDishDetails = this.cartItems
      .filter((item) => item.user_id === this.user!.user_id)
      .map((item) => {
        const dish = this.dishes.find((d) => d.dish_id === item.dish_id);
        return {
          ...item,
          dish_name: dish?.dish_name || "Unknown Dish",
          dish_price: dish?.dish_price || item.price,
          dish_image: dish?.dish_image || null,
        };
      });
  }

  increaseQuantity(index: number): void {
    const item = this.cartWithDishDetails[index];
    if (!this.user) return;

    this.cartService
      .addItem(
        this.user.user_id,
        item.dish_id,
        this.user.store_id,
        item.dish_price,
        item.quantity + 1,
        item.options
      )
      .subscribe();
  }

  decreaseQuantity(index: number): void {
    const item = this.cartWithDishDetails[index];
    if (!this.user) return;

    if (item.quantity > 1) {
      this.cartService
        .addItem(
          this.user.user_id,
          item.dish_id,
          this.user.store_id,
          item.dish_price,
          item.quantity - 1,
          item.options
        )
        .subscribe();
    } else {
      this.removeItem(index);
    }
  }

  removeItem(index: number): void {
    const item = this.cartWithDishDetails[index];
    this.cartService.removeItem1(item.cart_id, item.user_id).subscribe();
  }

  calculateTotal(): void {
    this.totalPrice = this.cartWithDishDetails.reduce(
      (sum, item) => sum + item.dish_price * item.quantity,
      0
    );
  }

  checkout(): void {
    if (!this.user) return;

    const payload = {
      total_price: this.totalPrice,
      total_quantity: this.cartWithDishDetails.length,
      store_id: this.getStoreId(),
      order_type: "online",
      pickup_datetime: new Date().toISOString(),
      delivery_address: null,
      delivery_fees: 0,
      delivery_datetime: null,
      order_notes: this.notes,
      order_status: "Order_placed",
      order_created_by: this.user.user_id,
      topping_details: [],
      ingredients_details: [],
      order_details_json: this.cartWithDishDetails.map((item) => ({
        dish_id: item.dish_id,
        dish_note: item.options?.notes || "",
        quantity: item.quantity,
        price: item.dish_price,
      })),
      payment_method: "Cash",
      payment_status: "Completed",
      payment_amount: this.totalPrice,
      is_pos_order: 1,
      order_due: null,
      order_due_datetime: null,
      unitnumber: "POS-001",
      delivery_notes: null,
      gst_price: 2.25
    };

    this.homeService.addOrder(payload).subscribe({
      next: (res) => {
        this.removeItem(0);
        this.cartItems = [];
        this.cartWithDishDetails = [];
        const orderData = {
          orderId: "#12345", // later you can replace with backend ID
          amountPaid: this.totalPrice,
          paymentMethod: "Cash",
          status: "Completed",
        };
        this.router.navigate(["/checkout"], { state: { order: orderData } });
      },
      error: (err) => console.error("Error placing order:", err),
    });
  }

  private getStoreId(): string {
    return this.storeService.getSelectedStoreId().toString();
  }

  onImageError(event: any): void {
    event.target.src = "assets/img/default.png";
  }
}
