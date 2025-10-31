import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { HomeService } from "../../core/services/home.service";
import { CartService } from "../../core/services/cart.service";
import { AuthService } from "../../core/services/auth.service";
import { GuestUserService } from "../../core/services/guest-user.service";

interface WishlistItem {
  wishlist_id?: number;
  dish_id: number;
  dish_name: string;
  dish_price: number | string;
  dish_image: string;
  store_id?: number;
  store_name: string;
  addedToCart?: boolean;
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
  isGuest: boolean = false;
  wishlist: WishlistItem[] = [];

  constructor(
    private service: HomeService,
    private cartService: CartService,
    private authService: AuthService,
    private guestService: GuestUserService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();
    this.isGuest = this.guestService.isGuest();

    const userStr = localStorage.getItem("user");
    if (userStr) this.user = JSON.parse(userStr);

    if (this.isGuest) {
      this.loadGuestWishlist();
    } else if (this.user?.user_id) {
      this.loadWishlist(this.user.user_id);
    }
  }

  /** 🧾 Load wishlist for logged-in user */
  private loadWishlist(userId: number): void {
    this.service.getWishlist(userId).subscribe({
      next: (res: any) => {
        const wishlistData = res?.data || [];
        this.wishlist = wishlistData.map((it: any) => ({
          ...it,
          addedToCart: false,
        }));

        // After wishlist loaded, sync cart status
        this.syncCartStatus();
      },
      error: (err) => console.error("Error fetching wishlist:", err),
    });
  }

  /** 🧾 Load wishlist for guest user */
  private loadGuestWishlist(): void {
    const guestFavs = this.guestService.getFavorites();
    this.wishlist = guestFavs.map((it) => ({
      ...it,
      addedToCart: false,
    }));

    // After wishlist loaded, sync cart status
    this.syncCartStatus();
  }

  /** 🔄 Sync wishlist items with cart to show 'Added' state */
  private syncCartStatus(): void {
    let cartItems: any[] = [];

    if (this.isGuest) {
      cartItems = this.guestService.getCart();
    } else {
      const maybeCart: any = this.cartService.loadCart(this.user!.user_id);
      cartItems = Array.isArray(maybeCart) ? maybeCart : [];
    }

    if (!cartItems || !Array.isArray(cartItems)) return;

    this.wishlist.forEach((wishItem) => {
      const existsInCart = cartItems.some(
        (c) => c.dish_id === wishItem.dish_id
      );
      wishItem.addedToCart = existsInCart;
    });

    this.cd.detectChanges();
  }

  /** ❤️ Add to Cart */
  addToCart(item: WishlistItem): void {
    // show immediate UI feedback
    item.addedToCart = true;
    this.cd.detectChanges();

    const quantity = 1;
    const unitPrice = Number(item.dish_price) || 0;
    const options = { notes: "", selectedOptions: "", selectedDrinks: "" };

    if (this.isGuest) {
      this.guestService.addToCart({
        dish_id: item.dish_id,
        dish_name: item.dish_name,
        dish_price: unitPrice,
        quantity,
        store_id: item.store_id,
      });
      return;
    }

    if (!this.user) return;

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
        next: () => {
          // success — stay on wishlist page, don't redirect
        },
        error: (err) => {
          console.error("Error adding to cart:", err);
          item.addedToCart = false;
          this.cd.detectChanges();
        },
      });
  }

  /** ❌ Remove from Wishlist */
  deleteItem(item: WishlistItem): void {
    if (this.isGuest) {
      this.guestService.removeFromFavorites(item.dish_id);
      this.loadGuestWishlist();
      return;
    }

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

  onImageError(event: any): void {
    event.target.src = "assets/img/default.jpg";
  }

  browseMenu(){
    this.router.navigate(["/menu"]);
  }
}