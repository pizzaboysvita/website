import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeService } from "../../core/services/home.service";
import { StoreService } from "../../core/services/store.service";
import { Subject, switchMap, takeUntil } from "rxjs";

interface DishItem {
  dish_id: number;
  dish_name: string;
  dish_price: number;
  dish_image?: string;
  description?: string;
  isFavorite?: boolean;
  wishlist_id?: number | null;
}

interface WishlistItem {
  wishlist_id: number;
  dish_id: number;
  user_id?: number;
  store_id?: number;
}

@Component({
  selector: "app-popular",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./popular.component.html",
  styleUrls: ["./popular.component.scss"],
})
export class PopularComponent implements OnInit, OnDestroy {
  public dishes: DishItem[] = [];
  private user: any = null;

  private destroy$ = new Subject<void>();

  constructor(
    private homeService: HomeService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user") || "{}");

    // 🔹 Reload dishes whenever store changes
    this.storeService.storeChanged$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.homeService.getDishes())
      )
      .subscribe({
        next: (response) => {
          const data = Array.isArray(response?.data) ? response.data : [];
          this.dishes = data.slice(0, 4).map((dish: any) => ({
            dish_id: Number(dish.dish_id),
            dish_name: dish.dish_name,
            dish_price: Number(dish.dish_price),
            dish_image: dish.dish_image,
            description: dish.description || "",
            isFavorite: false,
            wishlist_id: null,
          }));
          this.loadFavorites();
        },
        error: (err) => {
          console.error("Error fetching dishes:", err);
          this.dishes = [];
        },
      });
  }

  /** Load wishlist for the current user and mark dishes accordingly */
  private loadFavorites(): void {
    const userId = this.user?.user_id;
    if (!userId) return; // Not logged in

    this.homeService.getWishlist(userId).subscribe({
      next: (res) => {
        const favs = Array.isArray(res?.data) ? res.data : [];
        const favoriteMap = new Map<number, WishlistItem>();
        favs.forEach((f: any) => {
          favoriteMap.set(Number(f.dish_id), {
            wishlist_id: Number(f.wishlist_id),
            dish_id: Number(f.dish_id),
            user_id: f.user_id ? Number(f.user_id) : undefined,
            store_id: f.store_id ? Number(f.store_id) : undefined,
          });
        });

        this.dishes = this.dishes.map((dish) => {
          const fav = favoriteMap.get(dish.dish_id);
          return {
            ...dish,
            isFavorite: !!fav,
            wishlist_id: fav?.wishlist_id ?? null,
          };
        });
      },
      error: (err) => {
        console.error("Error loading wishlist:", err);
      },
    });
  }

  /** Toggle favorite status for a dish — calls API */
  toggleFavorite(item: DishItem): void {
    const userId = this.user?.user_id;
    const storeId = this.getStoreId();

    if (!userId) {
      console.warn("User not logged in — cannot manage favorites.");
      return;
    }

    if (item.isFavorite) {
      // Remove favorite
      if (!item.wishlist_id) {
        this.loadFavorites(); // fix inconsistent state
        return;
      }

      const body = {
        type: "delete",
        wishlist_id: item.wishlist_id,
        user_id: userId,
        dish_id: item.dish_id,
        store_id: storeId,
      };

      this.homeService.addWishlist(body).subscribe({
        next: () => {
          item.isFavorite = false;
          item.wishlist_id = null;
        },
        error: (err) => {
          console.error("Error removing favorite:", err);
        },
      });
    } else {
      // Add favorite
      const body = {
        type: "insert",
        user_id: userId,
        dish_id: item.dish_id,
        store_id: storeId,
      };

      this.homeService.addWishlist(body).subscribe({
        next: (res) => {
          const newId =
            (res && res.data && res.data.wishlist_id) ||
            res?.wishlist_id ||
            null;
          item.isFavorite = true;
          item.wishlist_id = newId ? Number(newId) : null;
        },
        error: (err) => {
          console.error("Error adding favorite:", err);
        },
      });
    }
  }

  isFavorite(item: DishItem): boolean {
    return !!item.isFavorite;
  }

  private getStoreId(): string {
    return this.storeService.getSelectedStoreId().toString();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
