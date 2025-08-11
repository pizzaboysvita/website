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
  // categories = [
  //   { id: 1,  name: 'Category 1',  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  //   { id: 2,  name: 'Category 2',  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  //   { id: 3,  name: 'Category 3',  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  //   { id: 4,  name: 'Category 4',  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  //   { id: 5,  name: 'Category 5',  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  //   { id: 6,  name: 'Category 6',  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  //   { id: 7,  name: 'Category 7',  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  //   { id: 8,  name: 'Category 8',  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  //   { id: 9,  name: 'Category 9',  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  //   { id: 10, name: 'Category 10', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  //   { id: 11, name: 'Category 11', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  //   { id: 12, name: 'Category 12', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  //   { id: 13, name: 'Category 13', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  //   { id: 14, name: 'Category 14', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  //   { id: 15, name: 'Category 15', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  //   { id: 16, name: 'Category 16', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  //   { id: 17, name: 'Category 17', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  //   { id: 18, name: 'Category 18', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  //   { id: 19, name: 'Category 19', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  //   { id: 20, name: 'Category 20', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-qGEj9K4aYm8oXMIn6GuuLu-ZjFmPffUT7ZUNRCORz5yfQTAAymAp2roO51_ESldPeM&usqp=CAU' },
  // ];

  @Output() categorySelected = new EventEmitter<number>();
  customOptions: OwlOptions = {
    loop: true,
    margin: 15,
    dots: false,
    nav: false, 
    autoplay: false,
    responsive: {
      0: { items: 2 },
      480: { items: 3 },
      768: { items: 4 },
      1024: { items: 6 }
    }
  };
  constructor(private apiService: HomeService) {}

  ngOnInit(): void {
    this.apiService.getCategories().subscribe((response) => {
    if (response && response.categories) {
      this.categories = response.categories.map((cat: any) => ({ ...cat, imageLoaded: false }));
    }
  });
  }

  selectCategory(categoryId: any) {
    this.categorySelected.emit(categoryId);
    console.log(`Category selected: ${categoryId}`);
  }


}
