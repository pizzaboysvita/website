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
                return {
                  title: set.option_set_name || set.dispaly_name || "Options",
                  options,
                };
              });
            } catch (err) {
              console.error("Error parsing dish_option_set_json", err);
              this.dish.optionGroups = [];
            }
          } else {
            this.dish.optionGroups = [];
          }

          if (this.dish.dish_ingredients_json) {
            try {
              const ingredients = JSON.parse(this.dish.dish_ingredients_json);
              this.dish.ingredients = ingredients.map(
                (ing: any) => ing.name || ""
              );
            } catch (err) {
              console.error("Error parsing dish_ingredients_json", err);
              this.dish.ingredients = [];
            }
          } else {
            this.dish.ingredients = [];
          }

          this.calculateTotal();
        }
      },
      error: (err) => {
        console.error("Error fetching dishes:", err);
      },
    });
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

  selectOption(option: any, groupIndex: number): void {
    this.selectedOptions[groupIndex] = option;
    this.calculateTotal();
  }

  addDrinkToCart(drink: any): void {
    this.selectedDrinks.push(drink);
    this.calculateTotal();
  }

  calculateTotal(): void {
    if (this.dish) {
      let basePrice = this.dish.price;

      this.selectedOptions.forEach((option) => {
        if (option && option.price) {
          basePrice += option.price;
        }
      });

      this.selectedDrinks.forEach((drink) => {
        basePrice += drink.price;
      });

      this.total = basePrice * this.quantity;
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
