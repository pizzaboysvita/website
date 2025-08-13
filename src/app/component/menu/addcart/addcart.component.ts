import { Component } from "@angular/core";
import { HeaderComponent } from "../../home/header/header.component";
import { FooterComponent } from "../../home/footer/footer.component";
import { ActivatedRoute, Router } from "@angular/router";
import { HomeService } from "../../../services/home.service";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CartService } from "../../../services/cart.service";

@Component({
  selector: "app-addcart",
  imports: [
    HeaderComponent,
    CommonModule,
    FooterComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./addcart.component.html",
  styleUrl: "./addcart.component.scss",
})
export class AddcartComponent {
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

                // Use the 'select_multiple' property from the JSON
                const isMultiple = set.select_multiple === 1;

                return {
                  title: set.dispaly_name || set.option_set_name || "Options",
                  options,
                  isMultiple,
                  required: set.required === 1,
                };
              });
              // Initialize selectedOptions with empty arrays for multiple selections
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

          // ... (rest of the getDishDetails method remains the same)
          this.calculateTotal();
        }
      },
      error: (err) => {
        console.error("Error fetching dishes:", err);
      },
    });
  }

  // Helper method to check if a checkbox option is selected
  isOptionSelected(option: any, groupIndex: number): boolean {
    const selectedGroup = this.selectedOptions[groupIndex];
    return (
      Array.isArray(selectedGroup) &&
      selectedGroup.some((o) => o.id === option.id)
    );
  }

  // Method to toggle a checkbox option
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

  // Method for single-choice radio buttons
  selectOption(option: any, groupIndex: number): void {
    this.selectedOptions[groupIndex] = option;
    this.calculateTotal();
  }

  // Calculate total method
  calculateTotal(): void {
    if (this.dish) {
      let basePrice = parseFloat(this.dish.dish_price); // Use float for price calculation

      this.selectedOptions.forEach((selectedItem) => {
        if (selectedItem) {
          if (Array.isArray(selectedItem)) {
            // It's a multiple-choice group (checkboxes)
            selectedItem.forEach((option) => {
              if (option.price) {
                basePrice += option.price;
              }
            });
          } else {
            // It's a single-choice group (radio buttons)
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

  addToCart(): void {
    if (this.dish) {
      const order = {
        dish: this.dish,
        quantity: this.quantity,
        notes: this.notes,
        selectedOptions: this.selectedOptions,
        selectedDrinks: this.selectedDrinks,
        total: this.total,
      };

      this.cartService.addItem(order);

      console.log("Added to cart:", order);
      this.router.navigate(["/menu"]);
    }
  }
}
