import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { HeaderComponent } from "../home/header/header.component";
import { CategoryComponent } from "../home/category/category.component";
import { CommonModule } from "@angular/common";
import { HomeService } from "../../services/home.service";
import { FooterComponent } from "../home/footer/footer.component";

@Component({
  selector: "app-menu",
  imports: [HeaderComponent, CommonModule, FooterComponent, CategoryComponent],
  templateUrl: "./menu.component.html",
  styleUrl: "./menu.component.scss",
})
export class MenuComponent implements OnInit {
  public breadcrumb = {
    title: "Menu Grid",
    page: "Home",
    sub_page: "Menu Grid",
  };

  public allProducts: any[] = [];
  public filteredProducts: any[] = [];
  public categories: any[] = [];
  public cartItems: any[] = [];
  selectedCategoryName: string = "All Dishes";

  constructor(
    private apiService: HomeService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.apiService.getCategories().subscribe((response) => {
      console.log(response, "categories response");
    });
    this.apiService.getCategories().subscribe((response) => {
      this.categories = response.categories; // Assuming API response has a 'categories' array
    });
    this.apiService.getDishes().subscribe((response) => {
      this.allProducts = response.data.map((dish: any) => ({
        ...dish,
        quantity: 1,
        imageLoaded: false,
      }));
      this.filteredProducts = [...this.allProducts];
      console.log(this.filteredProducts, "products response");
    });

    document.body.classList.add("bg-color");
  }
  trackByProductId(index: number, product: any): number {
    return product.id || product.dish_id || index;
  }
  onCategorySelected(categoryId: any) {
    console.log("Selected Category ID:", categoryId);
    this.filteredProducts = this.allProducts.filter(
      (dish) => dish.dish_category_id === categoryId.id
    );

    const selectedCategory = this.categories.find(
      (category) => category.id === categoryId.id
    );

    if (selectedCategory) {
      this.selectedCategoryName = selectedCategory.name;
    } else {
      this.selectedCategoryName = "All Dishes";
    }
    console.log(
      this.filteredProducts,
      "filtered products",
      selectedCategory,
      "selected category",
      this.selectedCategoryName,
      "selected category name"
    );
    this.cdr.detectChanges();
  }

  incrementQuantity(product: any): void {
    product.quantity++;
  }

  decrementQuantity(product: any): void {
    if (product.quantity > 1) {
      product.quantity--;
    }
  }

  addToCart(product: any): void {
    const existingItem = this.cartItems.find(
      (item) => item.dish_id === product.dish_id
    );
    if (existingItem) {
      existingItem.quantity += product.quantity;
    } else {
      this.cartItems.push({ ...product });
    }
  }
  removeFromCart(itemToRemove: any): void {
    this.cartItems = this.cartItems.filter(
      (item) => item.dish_id !== itemToRemove.dish_id
    );
  }
  ngOnDestroy() {
    document.body.classList.remove("bg-color");
  }
}
