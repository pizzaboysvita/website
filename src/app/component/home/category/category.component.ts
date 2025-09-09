
import {Component,EventEmitter,Output,} from "@angular/core";
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HomeService } from "../../../services/home.service";


@Component({
  selector: "app-category",
  standalone: true,
  imports: [ CommonModule,],
  templateUrl: "./category.component.html",
  styleUrl: "./category.component.scss",
    schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class CategoryComponent {
    categories: any[] = [];

  @Output() categorySelected = new EventEmitter<any>();

  constructor(private apiService: HomeService) {}

  ngOnInit(): void {
  this.apiService.getCategories().subscribe((response) => {
    if (response && response.categories) {
      this.categories = response.categories
        //  .slice(0, 2) // ✅ only first 2 items for testing
        .map((cat: any) => ({
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

  // ✅ conditions
  get showStaticTwo() {
    return this.categories.length <= 2;
  }

  get showStaticGrid() {
    return this.categories.length > 2 && this.categories.length <= 6;
  }

  get showSwiper() {
    return this.categories.length > 6;
  }
  }

