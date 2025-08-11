import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from "@angular/animations";
import { HeaderComponent } from "../home/header/header.component";
import { CategoryComponent } from "../home/category/category.component";
import { CommonModule } from "@angular/common";
import { HomeService } from "../../services/home.service";
import { FooterComponent } from "../home/footer/footer.component";
import { RouterLink } from "@angular/router";
import { Subscription } from "rxjs";

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

  private subscriptions: Subscription[] = [];
  private readonly FAVORITES_KEY = "my_app_favorites_v1";

  constructor(
    private apiService: HomeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // categories
    const cat = this.apiService.getCategories().subscribe((response: any) => {
      this.categories = response?.categories || [];
    });
    this.subscriptions.push(cat);

    // dishes
    const dishs = this.apiService.getDishes().subscribe((response: any) => {
      const remoteDishes: any[] = response?.data || [];
      const favorites = this.loadFavorites();
      this.allProducts = remoteDishes.map((dish: any) => {
        const normalized: Dish = {
          ...dish,
          quantity: 1,
          imageLoaded: false,
          isFavorite: !!favorites[dish.dish_id],
        };
        return normalized;
      });

      this.filteredProducts = [...this.allProducts];
      this.cdr.detectChanges();
    });
    this.subscriptions.push(dishs);

    document.body.classList.add("bg-color");
  }

  trackByProductId = (index: number, product: Dish): number =>
    product?.dish_id || (product as any)?.id || index;

  onCategorySelected(category: any | null) {
    if (!category) {
      this.filteredProducts = [...this.allProducts];
      this.selectedCategoryName = "All Dishes";
    } else {
      this.filteredProducts = this.allProducts.filter(
        (dish) => dish.dish_category_id === category.id
      );
      this.selectedCategoryName = category.name;
    }
    this.cdr.detectChanges();
  }

  toggleFavorite(product: Dish, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    product.isFavorite = !product.isFavorite;
    this.persistFavorites();
  }

  private persistFavorites() {
    try {
      const map: Record<number, boolean> = {};
      for (const p of this.allProducts) {
        if (p.isFavorite) {
          map[p.dish_id] = true;
        }
      }
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(map));
      // Optionally sync with server if you have an API
      // this.syncFavoritesToServer(map);
    } catch (err) {
      console.error("Failed to save favorites", err);
    }
  }

  private loadFavorites(): Record<number, boolean> {
    try {
      const raw = localStorage.getItem(this.FAVORITES_KEY);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (err) {
      console.warn("Failed to load favorites", err);
      return {};
    }
  }

  ngOnDestroy() {
    document.body.classList.remove("bg-color");
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
