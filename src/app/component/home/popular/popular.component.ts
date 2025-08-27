import { Component, EventEmitter, Output } from "@angular/core";
import { HomeService } from "../../../services/home.service";
@Component({
  selector: "app-popular",
  imports: [],
  templateUrl: "./popular.component.html",
  styleUrl: "./popular.component.scss",
})
export class PopularComponent {
  public categories: any[] = [];
  @Output() categorySelected = new EventEmitter<number>();
  constructor(private apiService: HomeService) {}
  ngOnInit(): void {
    this.apiService.getCategories().subscribe((response) => {
      if (response && response.categories) {
        this.categories = response.categories.map((cat: any) => ({
          ...cat,
          imageLoaded: false,
        }));
      }
    });
  }
  selectCategory(categoryId: any) {
    this.categorySelected.emit(categoryId);
    console.log(`Category selected: ${categoryId}`);
  }
}
