import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
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
import { Subject, of } from "rxjs";
import { takeUntil, catchError } from "rxjs/operators";
import { HeaderComponent } from "../component/home/header/header.component";
import { FooterComponent } from "../component/home/footer/footer.component";
import { CategoryComponent } from "../component/home/category/category.component";
import { HomeService } from "../services/home.service";

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
  [key: string]: any;
}

@Component({
  selector: "app-menu",
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    FooterComponent,
    CategoryComponent,
    RouterLink,
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
  breadcrumb = {
    title: "Menu Grid",
    page: "Home",
    sub_page: "Menu Grid",
  };

  allProducts: Dish[] = [];
  filteredProducts: Dish[] = [];
  categories: any[] = [];
  selectedCategoryName = "All Dishes";

  private destroy$ = new Subject<void>();
  private readonly FAVORITES_KEY = "my_app_favorites_v1";

  constructor(
    private apiService: HomeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Load categories
    this.apiService
      .getCategories()
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          console.error("Failed to fetch categories", err);
          return of({ categories: [] });
        })
      )
      .subscribe((response: any) => {
        this.categories = response?.categories || [];
      });

    // Load dishes
    this.apiService
      .getDishes()
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          console.error("Failed to fetch dishes", err);
          return of({ data: [] });
        })
      )
      .subscribe((response: any) => {
        const favorites = this.loadFavorites();
        this.allProducts = (response?.data || []).map((dish: any) => ({
          ...dish,
          quantity: 1,
          imageLoaded: false,
          isFavorite: !!favorites[dish.dish_id],
        }));

        this.filteredProducts = [...this.allProducts];
        this.cdr.detectChanges();
      });

    document.body.classList.add("bg-color");
  }

  trackByProductId = (index: number, product: Dish): number =>
    product?.dish_id || index;

  onCategorySelected(category: any | null) {
    this.filteredProducts = category
      ? this.allProducts.filter(
          dish => dish.dish_category_id === category.id
        )
      : [...this.allProducts];

    this.selectedCategoryName = category?.name || "All Dishes";
    this.cdr.detectChanges();
  }

  toggleFavorite(product: Dish, event?: MouseEvent) {
    event?.stopPropagation();
    event?.preventDefault();
    product.isFavorite = !product.isFavorite;
    this.persistFavorites();
  }

  private persistFavorites() {
    try {
      const map: Record<number, boolean> = {};
      this.allProducts.forEach(p => {
        if (p.isFavorite) {
          map[p.dish_id] = true;
        }
      });
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(map));
    } catch (err) {
      console.error("Failed to save favorites", err);
    }
  }

  private loadFavorites(): Record<number, boolean> {
    try {
      return JSON.parse(localStorage.getItem(this.FAVORITES_KEY) || "{}");
    } catch {
      return {};
    }
  }

  ngOnDestroy() {
    document.body.classList.remove("bg-color");
    this.destroy$.next();
    this.destroy$.complete();
  }
}
