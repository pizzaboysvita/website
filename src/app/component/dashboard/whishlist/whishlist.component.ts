import { HomeService } from './../../../services/home.service';
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../../common/header/header.component";
import { FooterComponent } from "../../common/footer/footer.component";
import { BreadcrumbComponent } from "../../common/breadcrumb/breadcrumb.component";

@Component({
  selector: "app-whishlist",
  imports: [HeaderComponent, FooterComponent, CommonModule, BreadcrumbComponent],
  templateUrl: "./whishlist.component.html",
  styleUrl: "./whishlist.component.scss",
})
export class WhishlistComponent {
 

  wishlist: any[] = [];

  constructor(private apiservice:HomeService) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist() {
    this.apiservice.getWishlist().subscribe({
      next: (res) => {
        console.log(" Wishlist Data:", res);
        this.wishlist = res.data || res; // depends on API response
      },
      error: (err) => {
        console.error(" Error fetching wishlist:", err);
      }
    });
  }

}
