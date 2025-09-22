
import { Component, EventEmitter, Output, } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HomeService } from "../../../services/home.service";


@Component({
  selector: "app-category",
  standalone: true,
  imports: [CommonModule,],
  templateUrl: "./category.component.html",
  styleUrl: "./category.component.scss",
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoryComponent {
  selectedCategoryId: number | null = null;
  categories: any[] = [];
  isSelected = false;

 
  @Output() categorySelected = new EventEmitter<any>();

  constructor(private apiService: HomeService) { }

  ngOnInit(): void {
    this.apiService.getCategories().subscribe((response) => {
      if (response && response.categories) {
        console.log('Total categories received from API:', response.categories.length);

        this.categories = response.categories
          // .slice(0, 6) // only first 6 items
          .map((cat: any) => ({
            ...cat,
            imageLoaded: false,
          }));

        console.log('Categories assigned to component (after slice):', this.categories.length);
      } else {
        console.warn('No categories found in API response');
      }
    }, (error) => {
      console.error('Error fetching categories:', error);
    });

  }


  selectCategory(item: any) {
  this.selectedCategoryId = item.id;       // remember which category was clicked
  this.categorySelected.emit(item);        // still emit if needed
  console.log('Category selected:', item.id);
}
  
  
  // ✅ conditions
  get showStaticTwo() {
    return this.categories.length <= 2;
  }

  get showStaticGrid() {
    return this.categories.length > 2 && this.categories.length <= 5;
  }

  get showSwiper() {
    return this.categories.length > 5;
  }
}


