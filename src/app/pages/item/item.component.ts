import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { HomeService } from "../../core/services/home.service";
import { CartService } from "../../core/services/cart.service";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-item",
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbComponent],
  templateUrl: "./item.component.html",
  styleUrl: "./item.component.scss",
})
export class ItemComponent implements OnInit {
  token: string | null = null;
  user: any;
  userId = 0;
  dishId: number | null = null;
  dish: any;
  quantity = 1;
  notes = "";
  total = 0;
  selectedOptions: any[] = [];
  selectedDrinks: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: HomeService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();
    const userData = localStorage.getItem("user");
    if (userData) this.user = JSON.parse(userData);
    this.userId = this.user?.user_id || 0;

    this.route.paramMap.subscribe((params) => {
      this.dishId = Number(params.get("id"));
      if (this.dishId) this.getDishDetails(this.dishId);
    });
  }

  /** Fetch Dish Details + Parse Option Groups */
  getDishDetails(id: number): void {
    this.apiService.getDishes().subscribe({
      next: (response: any) => {
        const allProducts = response.data.map((dish: any) => ({
          ...dish,
          quantity: 1,
        }));
        this.dish = allProducts.find((item: any) => item.dish_id === id);

        if (this.dish?.dish_option_set_json) {
          try {
            const optionSets = JSON.parse(this.dish.dish_option_set_json);
            this.dish.optionGroups = optionSets.map((set: any) => {
              const options = JSON.parse(set.option_set_combo_json).map(
                (opt: any, i: number) => ({
                  id: `${set.option_set_id}-${i}`,
                  name: opt.name,
                  description: opt.description || "",
                  price: opt.price || 0,
                })
              );
              return {
                title: set.dispaly_name || set.option_set_name || "Options",
                options,
                isMultiple: set.select_multiple === 1,
                required: set.required === 1,
              };
            });
            this.selectedOptions = this.dish.optionGroups.map((g: any) =>
              g.isMultiple ? [] : null
            );
          } catch {
            this.dish.optionGroups = [];
          }
        } else {
          this.dish.optionGroups = [];
        }
        this.calculateTotal();
      },
      error: (err) => console.error("Error fetching dishes:", err),
    });
  }

  /** Helpers */
  isOptionSelected(option: any, groupIndex: number): boolean {
    const selectedGroup = this.selectedOptions[groupIndex];
    return (
      Array.isArray(selectedGroup) &&
      selectedGroup.some((o) => o.id === option.id)
    );
  }

  toggleOption(option: any, groupIndex: number): void {
    const group = this.selectedOptions[groupIndex];
    if (!group) this.selectedOptions[groupIndex] = [option];
    else if (this.isOptionSelected(option, groupIndex))
      this.selectedOptions[groupIndex] = group.filter(
        (o: any) => o.id !== option.id
      );
    else group.push(option);

    this.calculateTotal();
  }

  selectOption(option: any, groupIndex: number): void {
    this.selectedOptions[groupIndex] = option;
    this.calculateTotal();
  }

  calculateTotal(): void {
    if (!this.dish) return;
    let basePrice = parseFloat(this.dish.dish_price);
    this.selectedOptions.forEach((item) => {
      if (Array.isArray(item))
        item.forEach((opt) => (basePrice += opt.price || 0));
      else if (item?.price) basePrice += item.price;
    });
    this.total = basePrice * this.quantity;
  }

  incrementQuantity(): void {
    this.quantity++;
    this.calculateTotal();
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.calculateTotal();
    }
  }

  /** Add Dish to Cart */
  addToCart(): void {
    if (!this.dish) return;
    const unitPrice = this.calculateUnitPrice();
    const options = {
      notes: this.notes,
      selectedOptions: this.selectedOptions,
      selectedDrinks: this.selectedDrinks,
    };

    this.cartService
      .addItem(
        this.userId,
        this.dish.dish_id,
        this.dish.store_id,
        unitPrice,
        this.quantity,
        options
      )
      .subscribe({
        next: () => {
          console.log("✅ Added to cart");
          this.router.navigate(["/menu"]);
        },
        error: (err) => console.error("❌ Error adding to cart:", err),
      });
  }

  private calculateUnitPrice(): number {
    let price = parseFloat(this.dish.dish_price);
    this.selectedOptions.forEach((item) => {
      if (Array.isArray(item)) item.forEach((opt) => (price += opt.price || 0));
      else if (item?.price) price += item.price;
    });
    return price;
  }
}
