import { Component, OnInit } from "@angular/core";
import { HeaderComponent } from "../../common/header/header.component";
import { FooterComponent } from "../../common/footer/footer.component";
import { ActivatedRoute, Router } from "@angular/router";
import { HomeService } from "../../../services/home.service";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CartService } from "../../../services/cart.service";
import { BreadcrumbComponent } from "../../common/breadcrumb/breadcrumb.component";
@Component({
  selector: "app-addcart",
  standalone: true, // Added standalone: true since this is a common practice
  imports: [
    HeaderComponent,
    CommonModule,
    FooterComponent,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbComponent
  ],
  templateUrl: "./addcart.component.html",
  styleUrl: "./addcart.component.scss",
})
export class AddcartComponent implements OnInit {
  dishId: number | null = null;
  dish: any | undefined;
  quantity = 1;
  notes = "";
  total = 0;
  selectedOptions: any[] = [];
  selectedDrinks: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private apiService: HomeService,
    private cartService: CartService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.dishId = Number(params.get("id"));
      if (this.dishId) {
        this.getDishDetails(this.dishId);
      }
    });
  }
  getDishDetails(id: number): void {
    this.apiService.getDishes().subscribe({
      next: (response: any) => {
        const allProducts = response.data.map((dish: any) => ({
          ...dish,
          quantity: 1,
          imageLoaded: false,
        }));
        this.dish = allProducts.find((item: any) => item.dish_id === id);
        if (this.dish) {
          if (this.dish.dish_option_set_json) {
            try {
              const optionSets = JSON.parse(this.dish.dish_option_set_json);
              this.dish.optionGroups = optionSets.map((set: any) => {
                let options = [];
                try {
                  options = JSON.parse(set.option_set_combo_json).map(
                    (opt: any, index: number) => ({
                      id: `${set.option_set_id}-${index}`,
                      name: opt.name,
                      price: opt.price || 0,
                    })
                  );
                } catch (err) {
                  console.error("Error parsing option_set_combo_json", err);
                }
                const isMultiple = set.select_multiple === 1;
                return {
                  title: set.dispaly_name || set.option_set_name || "Options",
                  options,
                  isMultiple,
                  required: set.required === 1,
                };
              });
              this.selectedOptions = this.dish.optionGroups.map((group: any) =>
                group.isMultiple ? [] : null
              );
            } catch (err) {
              console.error("Error parsing dish_option_set_json", err);
              this.dish.optionGroups = [];
            }
          } else {
            this.dish.optionGroups = [];
          }
          this.calculateTotal();
        }
      },
      error: (err) => {
        console.error("Error fetching dishes:", err);
      },
    });
  }
  isOptionSelected(option: any, groupIndex: number): boolean {
    const selectedGroup = this.selectedOptions[groupIndex];
    return (
      Array.isArray(selectedGroup) &&
      selectedGroup.some((o) => o.id === option.id)
    );
  }
  toggleOption(option: any, groupIndex: number): void {
    const selectedGroup = this.selectedOptions[groupIndex];
    if (!selectedGroup) {
      this.selectedOptions[groupIndex] = [option];
    } else if (this.isOptionSelected(option, groupIndex)) {
      this.selectedOptions[groupIndex] = selectedGroup.filter(
        (o: any) => o.id !== option.id
      );
    } else {
      selectedGroup.push(option);
    }
    this.calculateTotal();
  }
  selectOption(option: any, groupIndex: number): void {
    this.selectedOptions[groupIndex] = option;
    this.calculateTotal();
  }
  calculateTotal(): void {
    if (this.dish) {
      let basePrice = parseFloat(this.dish.dish_price);
      this.selectedOptions.forEach((selectedItem) => {
        if (selectedItem) {
          if (Array.isArray(selectedItem)) {
            selectedItem.forEach((option) => {
              if (option.price) {
                basePrice += option.price;
              }
            });
          } else {
            if (selectedItem.price) {
              basePrice += selectedItem.price;
            }
          }
        }
      });
      this.total = basePrice * this.quantity;
    }
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
  /** 🔹 Corrected addToCart method */
  addToCart(): void {
    if (!this.dish) return;
    // Use a hardcoded ID for now, but a real app should get this from an auth service
    const userId = 101;
    const storeId = this.dish.store_id || 33;
    const dishId = this.dish.dish_id;
    const quantity = this.quantity;
    // Calculate the total unit price (including options)
    let unitPrice = parseFloat(this.dish.dish_price);
    this.selectedOptions.forEach((selectedItem) => {
      if (Array.isArray(selectedItem)) {
        selectedItem.forEach((opt) => (unitPrice += opt.price || 0));
      } else if (selectedItem?.price) {
        unitPrice += selectedItem.price;
      }
    });
    const options = {
      notes: this.notes,
      selectedOptions: this.selectedOptions,
      selectedDrinks: this.selectedDrinks,
    };
    this.cartService
      .addItem(userId, dishId, storeId, unitPrice, quantity, options)
      .subscribe({
        next: () => {
          console.log("✅ Added to backend cart successfully.");
          this.router.navigate(["/menu"]);
        },
        error: (err) => {
          console.error("❌ Error adding to cart:", err);
        },
      });
  }
}
