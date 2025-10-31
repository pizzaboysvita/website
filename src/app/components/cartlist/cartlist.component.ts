import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { CartService } from "../../core/services/cart.service";
import { HomeService } from "../../core/services/home.service";
import { AuthService } from "../../core/services/auth.service";
import { StoreService } from "../../core/services/store.service";
import { GuestUserService } from "../../core/services/guest-user.service";

interface Dish {
  dish_id: number;
  dish_name: string;
  dish_price: number;
  dish_image?: string | null;
}

interface CartItem {
  cart_id?: number;
  user_id?: number;
  dish_id: number;
  store_id: number;
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BreadcrumbComponent],
})
export class CartlistComponent implements OnInit {
  token: string | null = null;
  user: { user_id: number; store_id: number } | null = null;
  isGuest: boolean = false;

  cartItems: CartItem[] = [];
  dishes: Dish[] = [];
  cartWithDishDetails: CartWithDishDetails[] = [];

  totalPrice: number = 0;
  notes: string = "";

  // 🧾 Guest checkout form
  guestName = "";
  guestPhone = "";
  guestEmail = "";
  showGuestCheckoutForm = false;

  constructor(
    private cartService: CartService,
    private homeService: HomeService,
    private authService: AuthService,
    private guestService: GuestUserService,
    private router: Router,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();
    this.isGuest = this.guestService.isGuest();

    const storedUser = localStorage.getItem("user");
    if (storedUser) this.user = JSON.parse(storedUser);

    // Load dishes and populate cart accordingly
    this.homeService.getDishes().subscribe({
      next: (res) => {
        this.dishes = res.data as Dish[];

        if (this.isGuest) {
          this.loadGuestCart();
        } else if (this.user?.user_id) {
          this.loadUserCart();
        }
      },
      error: (err) => console.error("Error fetching dishes:", err),
    });
  }

  /** 🧠 Load backend cart for logged-in user */
  private loadUserCart(): void {
    this.cartService.loadCart(this.user!.user_id);
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items.map((item) => {
        if (item.options_json) item.options = JSON.parse(item.options_json);
        return item;
      });
      this.mergeCartWithDishes();
      this.calculateTotal();
    });
  }

  /** 🧠 Load Guest Cart (localStorage) */
  private loadGuestCart(): void {
    const guestCart = this.guestService.getCart();
    this.cartWithDishDetails = guestCart.map((item: any) => {
      const dish = this.dishes.find((d) => d.dish_id === item.dish_id);
      return {
        ...item,
        dish_name: dish?.dish_name || "Unknown Dish",
        dish_price: dish?.dish_price || item.price,
        dish_image: dish?.dish_image || null,
      };
    });
    this.calculateTotal();
  }

  /** 🔄 Merge dish info into cart for display */
  private mergeCartWithDishes(): void {
    if (this.isGuest || !this.user) return;
    this.cartWithDishDetails = this.cartItems.map((item) => {
      const dish = this.dishes.find((d) => d.dish_id === item.dish_id);
      return {
        ...item,
        dish_name: dish?.dish_name || "Unknown Dish",
        dish_price: dish?.dish_price || item.price,
        dish_image: dish?.dish_image || null,
      };
    });
  }

  /** ➕ Increase quantity */
  increaseQuantity(i: number): void {
    const item = this.cartWithDishDetails[i];
    if (this.isGuest) {
      item.quantity++;
      this.guestService.addToCart(item);
      this.loadGuestCart();
    } else if (this.user) {
      this.cartService
        .addItem(
          this.user.user_id,
          item.dish_id,
          item.store_id,
          item.dish_price,
          1,
          item.options
        )
        .subscribe();
    }
  }

  /** ➖ Decrease quantity */
  decreaseQuantity(i: number): void {
    const item = this.cartWithDishDetails[i];
    if (this.isGuest) {
      if (item.quantity > 1) {
        item.quantity--;
        this.guestService.addToCart(item);
      } else {
        this.guestService.removeFromCart(item.dish_id);
      }
      this.loadGuestCart();
    } else if (this.user) {
      if (item.quantity > 1) {
        this.cartService
          .addItem(
            this.user.user_id,
            item.dish_id,
            item.store_id,
            item.dish_price,
            -1,
            item.options
          )
          .subscribe();
      } else {
        this.removeItem(i);
      }
    }
  }

  /** 🗑 Remove item */
  removeItem(i: number): void {
    const item = this.cartWithDishDetails[i];
    if (this.isGuest) {
      this.guestService.removeFromCart(item.dish_id);
      this.loadGuestCart();
    } else if (this.user) {
      this.cartService.removeItem1(item.cart_id!, item.user_id!).subscribe();
    }
  }

  /** 💰 Calculate total */
  private calculateTotal(): void {
    this.totalPrice = this.cartWithDishDetails.reduce(
      (sum, item) => sum + item.dish_price * item.quantity,
      0
    );
  }

  /** 🧾 Checkout entrypoint */
  checkout(): void {
    if (this.isGuest) {
      this.showGuestCheckoutForm = true;
    } else {
      this.checkoutLoggedUser();
    }
  }

  /** ✅ Logged user checkout (existing flow) */
  private checkoutLoggedUser(): void {
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
      order_created_by: this.user!.user_id,
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
      gst_price: 2.25,
    };

    this.homeService.addOrder(payload).subscribe({
      next: () => {
        this.cartItems = [];
        this.cartWithDishDetails = [];
        const orderData = {
          orderId: "#12345",
          amountPaid: this.totalPrice,
          paymentMethod: "Cash",
          status: "Completed",
        };
        this.router.navigate(["/checkout"], { state: { order: orderData } });
      },
      error: (err) => console.error("Error placing order:", err),
    });
  }

  /** 🧍 Guest checkout flow */
  completeGuestCheckout(): void {
    if (!this.guestName.trim() || !this.guestPhone.trim() || !this.guestEmail.trim()) {
      alert("Please fill all guest details before placing the order.");
      return;
    }

    const orderData = {
      orderId: "GUEST_" + Date.now(),
      guestName: this.guestName,
      guestPhone: this.guestPhone,
      guestEmail: this.guestEmail,
      amountPaid: this.totalPrice,
      items: this.cartWithDishDetails,
      status: "Pending Confirmation",
    };

    // Save locally
    this.guestService.saveOrderInfo(orderData);
    this.guestService.clearCart();

    this.router.navigate(["/checkout"], { state: { order: orderData } });
  }

  /** 🔖 Helper to get current store id */
  private getStoreId(): string {
    return this.storeService.getSelectedStoreId().toString();
  }

  /** 🖼 Image fallback */
  onImageError(event: any): void {
    event.target.src = "assets/img/default.jpg";
  }

  browseMenu(){
    this.router.navigate(["/menu"]);
  }
}
