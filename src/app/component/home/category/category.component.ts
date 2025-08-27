import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from "@angular/core";
import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";
import { CommonModule } from "@angular/common";
import { HomeService } from "../../../services/home.service";
@Component({
  selector: "app-category",
  standalone: true,
  imports: [CarouselModule, CommonModule],
  templateUrl: "./category.component.html",
  styleUrl: "./category.component.scss",
})
export class CategoryComponent {
  public categories: any[] = [];
  @Output() categorySelected = new EventEmitter<number>();
  public customOptions: OwlOptions = {
    loop: true,
    margin: 0,
    dots: false,
    nav: false,
    autoplay: false,
    responsive: {
      0: { items: 2 },
      480: { items: 3 },
      768: { items: 4 },
      1024: { items: 6 },
    },
  };
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
