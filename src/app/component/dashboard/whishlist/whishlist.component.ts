import { HomeService } from './../../../services/home.service';
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../../common/header/header.component";
import { FooterComponent } from "../../common/footer/footer.component";
import { BreadcrumbComponent } from "../../common/breadcrumb/breadcrumb.component";
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-whishlist",
  imports: [HeaderComponent, FooterComponent, CommonModule, BreadcrumbComponent],
  templateUrl: "./whishlist.component.html",
  styleUrl: "./whishlist.component.scss",
})
export class WhishlistComponent {
  token: string | null = null;
  user: any;
  wishlist: any[] = [];

  constructor(private service: HomeService,
      private cartService: CartService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.token = this.authService.getToken();
    let user1 = localStorage.getItem('user');
    if (user1) {
      this.user = JSON.parse(user1);
    }
    console.log(this.user);

    this.loadWishlist(this.user.user_id); // you can replace with localStorage user_id
  }

  loadWishlist(userId: number): void {
    console.log(' Fetching wishlist for user_id:', userId);

    this.service.getWishlist(userId).subscribe({
      next: (res) => {
        console.log(' Wishlist API Response:', res);
        this.wishlist = res.data;
      },
      error: (err) => console.error(' Error fetching wishlist:', err),
    });
  }

  // Component.ts
  deleteItem(item: any) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const user_id = user?.user_id || null;
    const store_id = user?.store_id || null;
    const wishlist_id = item?.wishlist_id || null;
    const dish_id = item?.dish_id || null;

    const requestBody = {
      type: "delete",
      wishlist_id: wishlist_id,  
      user_id: user_id,
      dish_id: dish_id,
      store_id: store_id || 33
    };

    this.service.addwhishlist(requestBody).subscribe({
      next: (data: any) => {
        console.log(" Removed from wishlist:", data);
        // remove from UI
        this.wishlist = this.wishlist.filter(i => i.wishlist_id !== wishlist_id);
      },
      error: (err) => {
        console.error(" Error removing from wishlist:", err);
      },
    });
  }

  addToCart(item: any) {
    const userId = this.user?.user_id || null;
    const storeId = item?.store_id || null;
    const dishId = item?.dish_id || null;

    const quantity = 1;
    // Calculate the total unit price (including options)
    let unitPrice = parseFloat(item.dish_price);
    // this.selectedOptions.forEach((selectedItem) => {
    //   if (Array.isArray(selectedItem)) {
    //     selectedItem.forEach((opt) => (unitPrice += opt.price || 0));
    //   } else if (selectedItem?.price) {
    //     unitPrice += selectedItem.price;
    //   }
    // });
    const options = {
      notes:  '',
      selectedOptions: '',
      selectedDrinks: '',
    };
    this.cartService
      .addItem(userId, dishId, storeId, unitPrice, quantity, options)
      .subscribe({
        next: () => {
          console.log("✅ Added to backend cart successfully.");
          this.router.navigate(["/menu"]);
        },
        error: (err) => {
          console.error("❌ Error adding to cart:", err);
        },
      });
  }



}





