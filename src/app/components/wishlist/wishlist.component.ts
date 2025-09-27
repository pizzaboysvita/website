import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { HomeService } from "../../core/services/home.service";
import { CartService } from "../../core/services/cart.service";
import { AuthService } from "../../core/services/auth.service";

interface WishlistItem {
  wishlist_id: number;
  dish_id: number;
  dish_name: string;
  dish_price: number | string;
  dish_image: string;
  store_id?: number;
  store_name: string;
}

@Component({
  selector: "app-wishlist",
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: "./wishlist.component.html",
  styleUrls: ["./wishlist.component.scss"],
})
export class WishlistComponent implements OnInit {
  token: string | null = null;
  user: any = null;
  wishlist: WishlistItem[] = [];

  constructor(
    private service: HomeService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();
    const userStr = localStorage.getItem("user");
    if (userStr) this.user = JSON.parse(userStr);

    if (this.user?.user_id) {
      this.loadWishlist(this.user.user_id);
    }
  }

  private loadWishlist(userId: number): void {
    this.service.getWishlist(userId).subscribe({
      next: (res: any) => {
        this.wishlist = res?.data || [];
      },
      error: (err) => console.error("Error fetching wishlist:", err),
    });
  }

  deleteItem(item: WishlistItem) {
    if (!this.user) return;

    const requestBody = {
      type: "delete",
      wishlist_id: item.wishlist_id,
      user_id: this.user.user_id,
      dish_id: item.dish_id,
      store_id: item.store_id,
    };

    this.service.addWishlist(requestBody).subscribe({
      next: () => {
        this.wishlist = this.wishlist.filter(
          (i) => i.wishlist_id !== item.wishlist_id
        );
      },
      error: (err) => console.error("Error removing from wishlist:", err),
    });
  }

  addToCart(item: WishlistItem) {
    if (!this.user) return;

    const quantity = 1;
    const unitPrice = Number(item.dish_price) || 0;
    const options = { notes: "", selectedOptions: "", selectedDrinks: "" };

    this.cartService
      .addItem(
        this.user.user_id,
        item.dish_id,
        item.store_id || -1,
        unitPrice,
        quantity,
        options
      )
      .subscribe({
        next: () => this.router.navigate(["/menu"]),
        error: (err) => console.error("Error adding to cart:", err),
      });
  }
}
