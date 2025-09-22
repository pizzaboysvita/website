import { Component, EventEmitter, Output } from "@angular/core";
import { HomeService } from "../../../services/home.service";
@Component({
  selector: "app-popular",
  imports: [],
  templateUrl: "./popular.component.html",
  styleUrl: "./popular.component.scss",
})
export class PopularComponent {
  public dishes: any[] = [];
  @Output() categorySelected = new EventEmitter<number>();
  constructor(private apiService: HomeService) {}
ngOnInit(): void {
  this.apiService.getDishes().subscribe((response) => {
    console.log("Get Dishes Response :", response);

    if (response && Array.isArray(response.data)) {
      this.dishes = response.data.slice(0, 12).map((dish: any) => ({
        dish_id: dish.id,
        dish_name: dish.dish_name,
        dish_price: dish.dish_price,
        dish_image: dish.dish_image,
        description: dish.description || '',
        imageLoaded: false,
      }));
    } else {
      console.warn("No dishes found in API response");
      this.dishes = [];
    }
  });
}

  // selectCategory(categoryId: any) {
  //   this.categorySelected.emit(categoryId);
  //   console.log(`Category selected: ${categoryId}`);
  // }
}
