import { Component } from '@angular/core';
import { HeaderComponent } from "../component/home/header/header.component";
import { FooterComponent } from "../component/home/footer/footer.component";
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../shared/breadcrumb/breadcrumb.component';


@Component({
  selector: 'app-whishlist',
  imports: [HeaderComponent, FooterComponent,CommonModule, BreadcrumbComponent],
  templateUrl: './whishlist.component.html',
  styleUrl: './whishlist.component.scss'
})
export class WhishlistComponent {
restaurants = [
  {
    name: "Poultry Palace",
    items: "Chicken quesadilla, avocado...",
    image: "assets/images/pizza.jpg",
    location: "New Jersey",
    distance: "3.2 km",
    time: "25 min",
    rating: 3.9,
    offer: "50%",
    bestSeller: false,
  },
  {
    name: "Ribeye Junction",
    items: "Chicken quesadilla, avocado...",
    image: "assets/images/burger.jpg",
    location: "California",
    distance: "1 km",
    time: "10 min",
    rating: 3.2,
    offer: "50%",
    bestSeller: true,
  }
];

}
