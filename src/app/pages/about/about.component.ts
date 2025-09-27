import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";

@Component({
  selector: "app-about",
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
})
export class AboutComponent {
  testimonials = [
    {
      name: "Alex P.",
      img: "https://randomuser.me/api/portraits/men/11.jpg",
      review:
        "The online ordering process was seamless, pizza arrived hot and fresh.",
      stars: 4,
    },
    {
      name: "Maria L.",
      img: "https://randomuser.me/api/portraits/women/12.jpg",
      review:
        "Fast delivery and very reliable. Loved the updates on order status.",
      stars: 5,
    },
    {
      name: "John D.",
      img: "https://randomuser.me/api/portraits/men/13.jpg",
      review:
        "Customer support was friendly, and the pizza quality was amazing.",
      stars: 5,
    },
  ];
}
