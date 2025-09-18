import { HomeService } from "./../../../services/home.service";
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../../common/header/header.component";
import { FooterComponent } from "../../common/footer/footer.component";
import { BreadcrumbComponent } from "../../common/breadcrumb/breadcrumb.component";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-whishlist",
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    BreadcrumbComponent,
  ],
  templateUrl: "./whishlist.component.html",
  styleUrl: "./whishlist.component.scss",
})
export class WhishlistComponent {
  token: string | null = null;
  user: any;
  wishlist: any[] = [];

  constructor(private service: HomeService, private authService: AuthService) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();
    let user1 = localStorage.getItem("user");
    if (user1) {
      this.user = JSON.parse(user1);
    }
    console.log(this.user);

    this.loadWishlist(this.user.user_id); // you can replace with localStorage user_id
  }

  loadWishlist(userId: number): void {
    console.log("➡️ Fetching wishlist for user_id:", userId);

    this.service.getWishlist(userId).subscribe({
      next: (res) => {
        console.log("✅ Wishlist API Response:", res);
        this.wishlist = res.data;
      },
      error: (err) => console.error("❌ Error fetching wishlist:", err),
    });
  }

  onImageError(event: any) {
  event.target.src = 'assets/img/chicken_pizzas/Apricot Chicken Pizza.webp';
}

}
