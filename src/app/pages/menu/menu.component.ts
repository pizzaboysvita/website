import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from "@angular/animations";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Subject, forkJoin, of } from "rxjs";
import { takeUntil, catchError } from "rxjs/operators";
import { CategoryComponent } from "../../components/category/category.component";
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { HomeService } from "../../core/services/home.service";
import { StoreService } from "../../core/services/store.service";
import { GuestUserService } from "../../core/services/guest-user.service";
import { LoginGuestModalComponent } from "../../shared/login-guest-modal/login-guest-modal.component";

interface Dish {
  dish_id: number;
  dish_name: string;
  dish_image?: string;
  dish_price?: number;
  description?: string;
  dish_category_id?: number;
  quantity?: number;
  imageLoaded?: boolean;
  isFavorite?: boolean;
  wishlist_id?: number | null;
  isOnlineHide?: number | null;
  [key: string]: any;
}

@Component({
  selector: "app-menu",
  standalone: true,
  imports: [
    CategoryComponent,
    BreadcrumbComponent,
    CommonModule,
    RouterLink,
    LoginGuestModalComponent,
  ],
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
  animations: [
    trigger("listAnimation", [
      transition("* => *", [
        query(
          ":enter",
          [
            style({ opacity: 0, transform: "translateY(10px)" }),
            stagger(
              80,
              animate(
                "300ms ease-out",
                style({ opacity: 1, transform: "translateY(0)" })
              )
            ),
          ],
          { optional: true }
        ),
        query(
          ":leave",
          [
            animate(
              "200ms ease-in",
              style({ opacity: 0, transform: "translateY(-10px)" })
            ),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class MenuComponent implements OnInit, OnDestroy {
  breadcrumb = { title: "Menu Grid", page: "Home", sub_page: "Menu Grid" };
  allProducts: Dish[] = [];
  filteredProducts: Dish[] = [];
  categories: any[] = [];
  selectedCategoryName = "All Dishes";
  private destroy$ = new Subject<void>();
  private user: any;

  @ViewChild(LoginGuestModalComponent)
  loginGuestModal!: LoginGuestModalComponent;

  constructor(
    private apiService: HomeService,
    private cdr: ChangeDetectorRef,
    private storeService: StoreService,
    private guestService: GuestUserService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("user") || "{}");
    this.loadCategories();
    this.loadDishesAndFavorites();

    this.storeService.storeChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadCategories();
        this.loadDishesAndFavorites();
      });
  }

  /** Load categories from API */
  private loadCategories() {
    this.apiService
      .getCategories()
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => of({ categories: [] }))
      )
      .subscribe((res: any) => {
        this.categories = res?.categories || [];
        this.cdr.detectChanges();
      });
  }

  /** Load dishes + favorites */
  private loadDishesAndFavorites() {
    const userId = this.user?.user_id;
    const storeId = this.getStoreId();
    const guestFavorites = this.guestService.getFavorites();

    forkJoin({
      dishes: this.apiService
        .getDishes()
        .pipe(catchError(() => of({ data: [] }))),
      favorites: userId
        ? this.apiService
            .getWishlist(userId)
            .pipe(catchError(() => of({ data: [] })))
        : of({ data: [] }),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ dishes, favorites }: any) => {
        const favMap = new Map<number, number>();
        (favorites?.data || []).forEach((f: any) => {
          favMap.set(Number(f.dish_id), Number(f.wishlist_id));
        });

        this.allProducts = (dishes?.data || []).map((dish: any) => {
          const isGuestFav = guestFavorites.some(
            (g) => g.dish_id === dish.dish_id
          );
          return {
            ...dish,
            quantity: 1,
            imageLoaded: false,
            isFavorite: userId ? favMap.has(dish.dish_id) : isGuestFav,
            wishlist_id: userId ? favMap.get(dish.dish_id) || null : null,
            isOnlineHide: dish.is_online_hide,
          };
        });

        this.filteredProducts = this.allProducts.filter(
          (dish) => dish.isOnlineHide === 1
        );

        this.cdr.detectChanges();
      });
  }

  trackByProductId = (index: number, product: Dish) =>
    product?.dish_id || index;

  onCategorySelected(category: any | null) {
    let products = category
      ? this.allProducts.filter((d) => d.dish_category_id === category.id)
      : [...this.allProducts];

    this.filteredProducts = products.filter((d) => d.isOnlineHide === 1);
    this.selectedCategoryName = category?.name || "All Dishes";
    this.cdr.detectChanges();
  }

  /** ✅ Toggle Favorite — handles Guest & Logged user both */
  toggleFavorite(product: Dish) {
    const userId = this.user?.user_id;
    const storeId = this.getStoreId();

    // Logged user
    if (userId) {
      if (product.isFavorite) {
        if (!product.wishlist_id) {
          this.loadDishesAndFavorites();
          return;
        }
        const body = {
          type: "delete",
          wishlist_id: product.wishlist_id,
          user_id: userId,
          dish_id: product.dish_id,
          store_id: storeId,
        };
        this.apiService.addWishlist(body).subscribe({
          next: () => {
            product.isFavorite = false;
            product.wishlist_id = null;
          },
          error: (err) => console.error("Error removing favorite:", err),
        });
      } else {
        const body = {
          type: "insert",
          user_id: userId,
          dish_id: product.dish_id,
          store_id: storeId,
        };
        this.apiService.addWishlist(body).subscribe({
          next: (res) => {
            const newId =
              res?.data?.wishlist_id || res?.wishlist_id || null;
            product.isFavorite = true;
            product.wishlist_id = newId ? Number(newId) : null;
          },
          error: (err) => console.error("Error adding favorite:", err),
        });
      }
      return;
    }

    // Guest user
    if (this.guestService.isGuest()) {
      if (product.isFavorite) {
        this.guestService.removeFavorite(product.dish_id);
        product.isFavorite = false;
      } else {
        this.guestService.addFavorite({
          dish_id: product.dish_id,
          dish_name: product.dish_name,
          dish_image: product.dish_image,
          dish_price: product.dish_price,
          store_id: storeId,
        });
        product.isFavorite = true;
      }
      this.cdr.detectChanges();
      return;
    }

    // Neither — open modal
    if (this.loginGuestModal) {
      this.loginGuestModal.open().then((choice) => {
        if (choice === "guest") {
          this.guestService.activateGuest();
          this.toggleFavorite(product);
        } else if (choice === "login") {
          console.log("Redirecting to login...");
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getStoreId(): string {
    return this.storeService.getSelectedStoreId().toString();
  }
}
