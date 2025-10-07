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
  styleUrls: ["./item.component.scss"],
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

  // Selection state for standard dish optionGroups
  selectedOptions: any[] = [];

  // For combo dishes: array of { name, dish_id, optionGroups, ingredients, selectedOptions, open }
  comboGroups: any[] = [];

  // store full product list returned from API so we can find sub-dish option sets
  private allProducts: any[] = [];

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

  /** Fetch Dish Details + Parse Options + Ingredients */
  getDishDetails(id: number): void {
    this.apiService.getDishes().subscribe({
      next: (response: any) => {
        // keep full product list locally
        this.allProducts = (response?.data || []).map((dish: any) => ({
          ...dish,
          quantity: 1,
        }));

        this.dish = this.allProducts.find((item: any) => item.dish_id === id);

        // reset selection state
        this.selectedOptions = [];
        this.comboGroups = [];

        if (!this.dish) return;

        // Standard dish -> parse optionGroups and ingredients
        if (
          this.dish.dish_type === "standard" &&
          this.dish.dish_option_set_json
        ) {
          this.dish.optionGroups = this.parseOptionSets(
            this.dish.dish_option_set_json
          );
          // init selection arrays for optionGroups
          this.selectedOptions = [];
          this.initSelectedOptions(
            this.dish.optionGroups,
            this.selectedOptions
          );
        } else {
          this.dish.optionGroups = [];
        }

        // Parse ingredients for standard dish (always after optionGroups)
        this.dish.ingredients = this.parseIngredients(
          this.dish.dish_ingredients_json,
          `${this.dish?.dish_id ?? "dish"}`
        );

        // Combo dish -> build comboGroups (each sub-dish may have its own optionGroups + ingredients)
        if (this.dish.dish_type === "combo" && this.dish.dish_choices_json) {
          this.parseComboOptions(this.dish.dish_choices_json);
        }

        this.calculateTotal();
      },
      error: (err) => console.error("Error fetching dishes:", err),
    });
  }

  /** Parse Standard Dish Options */
  private parseOptionSets(optionSetJson: string): any[] {
    try {
      const optionSets = JSON.parse(optionSetJson || "[]");
      return optionSets.map((set: any) => {
        const options = JSON.parse(set.option_set_combo_json || "[]").map(
          (opt: any, i: number) => ({
            id: `${set.option_set_id}-${i}`,
            name: opt.name,
            description: opt.description || "",
            price: Number(opt.price) || 0,
            count: 0,
          })
        );
        return {
          title: set.dispaly_name || set.option_set_name || "Options",
          options,
          optionType: (set.option_type || "radio").toLowerCase(),
          required: set.required === 1,
        };
      });
    } catch (e) {
      console.error("Error parsing option set JSON", e);
      return [];
    }
  }

  /**
   * Parse ingredients JSON into array of { id, name, checked, price? }
   * All ingredients default to checked = true
   */
  private parseIngredients(
    ingredientsJson: string | null,
    idPrefix = ""
  ): any[] {
    if (!ingredientsJson) return [];
    try {
      const arr = JSON.parse(ingredientsJson || "[]");
      return arr.map((ing: any, idx: number) => ({
        id: `${idPrefix}-ing-${idx}`,
        name: ing?.name ?? ing?.label ?? String(ing),
        checked: true,
        price: Number(ing?.price) || 0, // if ingredient has price (rare), keep it
      }));
    } catch (e) {
      console.error("Error parsing ingredients JSON", e);
      return [];
    }
  }

  /** Parse Combo Dish → each sub-dish may have its own option groups & ingredients (try to find from full product list) */
  private parseComboOptions(comboJson: string): void {
    try {
      const comboData = JSON.parse(comboJson || "[]");
      this.comboGroups = [];

      comboData.forEach((choice: any) => {
        const menuItems = choice.menuItems || [];
        menuItems.forEach((menu: any) => {
          const categories = menu.categories || [];
          categories.forEach((cat: any) => {
            const dishes = cat.dishes || [];
            dishes.forEach((d: any) => {
              // d may contain dishId/dishName or dish_id/dish_name
              const dishIdFromChoice = d.dishId ?? d.dish_id ?? d.id ?? null;
              const dishNameFromChoice =
                d.dishName ?? d.dish_name ?? d.name ?? "Dish";

              // try to find full product in allProducts by id
              const matched = this.allProducts.find(
                (p) =>
                  p.dish_id === dishIdFromChoice ||
                  p.dishId === dishIdFromChoice
              );

              const optionGroupsFromProduct =
                matched && matched.dish_option_set_json
                  ? this.parseOptionSets(matched.dish_option_set_json)
                  : [];

              // parse ingredients either from matched product or from choice item if present
              const ingredientsFromProduct = this.parseIngredients(
                matched?.dish_ingredients_json ??
                  d.dish_ingredients_json ??
                  null,
                `${dishIdFromChoice ?? "sub"}`
              );

              this.comboGroups.push({
                name: dishNameFromChoice,
                dish_id: dishIdFromChoice,
                dish_image: d.image_url ?? matched?.dish_image ?? null,
                optionGroups: optionGroupsFromProduct,
                ingredients: ingredientsFromProduct,
                selectedOptions: [],
                open: false,
              });
            });
          });
        });
      });

      // initialize selection arrays per combo group
      this.comboGroups.forEach((cg) => {
        cg.selectedOptions = [];
        this.initSelectedOptions(cg.optionGroups, cg.selectedOptions);
      });
    } catch (e) {
      console.error("❌ Error parsing combo JSON", e);
      this.comboGroups = [];
    }
  }

  /** Initialize Selection State */
  private initSelectedOptions(
    optionGroups: any[],
    selectedOptionsArr: any[] = this.selectedOptions
  ): void {
    // clear provided selected options first
    selectedOptionsArr.length = 0;
    optionGroups.forEach((g: any) => {
      if (g.optionType === "radio") selectedOptionsArr.push(null);
      else if (g.optionType === "checkbox" || g.optionType === "counter")
        selectedOptionsArr.push([]);
      else selectedOptionsArr.push(null);
    });
  }

  /** Helpers for selecting options (selectedOptionsArr defaults to standard dish's selectedOptions) */
  isOptionSelected(
    option: any,
    groupIndex: number,
    selectedOptionsArr: any[] = this.selectedOptions
  ): boolean {
    const group = selectedOptionsArr[groupIndex];
    return Array.isArray(group) && group.some((o) => o.id === option.id);
  }

  toggleCheckbox(
    option: any,
    groupIndex: number,
    selectedOptionsArr: any[] = this.selectedOptions
  ): void {
    const group = selectedOptionsArr[groupIndex];
    if (!group) selectedOptionsArr[groupIndex] = [option];
    else if (this.isOptionSelected(option, groupIndex, selectedOptionsArr))
      selectedOptionsArr[groupIndex] = group.filter(
        (o: any) => o.id !== option.id
      );
    else group.push(option);
    this.calculateTotal();
  }

  selectRadio(
    option: any,
    groupIndex: number,
    selectedOptionsArr: any[] = this.selectedOptions
  ): void {
    selectedOptionsArr[groupIndex] = option;
    this.calculateTotal();
  }

  incrementCounter(
    option: any,
    groupIndex: number,
    selectedOptionsArr: any[] = this.selectedOptions
  ): void {
    option.count++;
    const group = selectedOptionsArr[groupIndex];
    if (!group.find((o: any) => o.id === option.id)) {
      group.push(option);
    }
    this.calculateTotal();
  }

  decrementCounter(
    option: any,
    groupIndex: number,
    selectedOptionsArr: any[] = this.selectedOptions
  ): void {
    if (!option) return;
    if (option.count > 0) {
      option.count--;
      if (option.count === 0) {
        selectedOptionsArr[groupIndex] = selectedOptionsArr[groupIndex].filter(
          (o: any) => o.id !== option.id
        );
      }
      this.calculateTotal();
    }
  }

  /** Ingredient toggles (standard dish) */
  toggleIngredient(ingredient: any): void {
    if (!ingredient) return;
    ingredient.checked = !ingredient.checked;
  }

  /** Ingredient toggles (combo sub-dish) */
  toggleComboIngredient(cg: any, ingIndex: number): void {
    if (!cg || !cg.ingredients) return;
    const ing = cg.ingredients[ingIndex];
    if (!ing) return;
    ing.checked = !ing.checked;
  }

  /** Price Calculation */
  calculateTotal(): void {
    if (!this.dish) return;
    let basePrice = parseFloat(this.dish.dish_price) || 0;

    // Standard options
    if (
      this.dish.dish_type === "standard" &&
      Array.isArray(this.dish.optionGroups)
    ) {
      this.selectedOptions.forEach((item, groupIndex) => {
        const group = this.dish.optionGroups[groupIndex];
        basePrice += this.calculateOptionPrice(item, group);
      });
    }

    // Combo sub-dishes
    if (this.dish.dish_type === "combo") {
      this.comboGroups.forEach((cg) => {
        if (!cg.selectedOptions) return;
        cg.selectedOptions.forEach((item: any, groupIndex: number) => {
          const group = cg.optionGroups[groupIndex];
          basePrice += this.calculateOptionPrice(item, group);
        });
      });
    }

    // Ingredients rarely have price, but if they do include them
    if (this.dish.ingredients && Array.isArray(this.dish.ingredients)) {
      this.dish.ingredients.forEach((ing: any) => {
        if (ing.checked && ing.price) basePrice += ing.price;
      });
    }
    if (this.dish.dish_type === "combo") {
      this.comboGroups.forEach((cg) => {
        if (!cg.ingredients) return;
        cg.ingredients.forEach((ing: any) => {
          if (ing.checked && ing.price) basePrice += ing.price;
        });
      });
    }

    this.total = basePrice * this.quantity;
  }

  private calculateOptionPrice(item: any, group: any): number {
    let price = 0;
    if (!group) return 0;

    if (group.optionType === "checkbox") {
      if (Array.isArray(item)) item.forEach((opt) => (price += opt.price || 0));
    } else if (group.optionType === "radio") {
      if (item?.price) price += item.price;
    } else if (group.optionType === "counter") {
      if (Array.isArray(item))
        item.forEach((opt) => (price += (opt.price || 0) * (opt.count || 0)));
    }
    return price;
  }

  /** Quantity Control */
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

  /** Add Dish to Cart - includes selected ingredients for standard and combo */
  addToCart(): void {
    if (!this.dish) return;

    const unitPrice = this.total / this.quantity;

    // Prepare comboGroups payload with selected options & ingredients
    const comboPayload = (this.comboGroups || []).map((cg) => {
      return {
        dish_id: cg.dish_id,
        selectedOptions: cg.selectedOptions || [],
        selectedIngredients:
          (cg.ingredients || [])
            .filter((ing: any) => ing.checked)
            .map((i: any) => ({
              id: i.id,
              name: i.name,
              price: i.price || 0,
            })) || [],
      };
    });

    const options = {
      notes: this.notes,
      selectedOptions: this.selectedOptions,
      selectedIngredients:
        (this.dish.ingredients || [])
          .filter((ing: any) => ing.checked)
          .map((i: any) => ({
            id: i.id,
            name: i.name,
            price: i.price || 0,
          })) || [],
      comboGroups: comboPayload,
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
          this.router.navigate(["/cartlist"]);
        },
        error: (err) => console.error("❌ Error adding to cart:", err),
      });
  }
}
