import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { GuestUserService } from "../../core/services/guest-user.service";
import { AuthService } from "../../core/services/auth.service";

export interface Order {
  orderId: string;
  amountPaid: number;
  paymentMethod: string;
  status: string;
}

@Component({
  selector: "app-checkout",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})
export class CheckoutComponent implements OnInit {
  order: Order | null = null;
  isGuest: boolean = false;
  user: any = null;

  constructor(
    private router: Router,
    private guestService: GuestUserService,
    private authService: AuthService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.order = nav?.extras.state?.["order"] ?? null;
  }

  ngOnInit(): void {
    this.isGuest = this.guestService.isGuest();
    const userStr = localStorage.getItem("user");
    if (userStr) this.user = JSON.parse(userStr);
  }

  /** ✅ Handle post-checkout action */
  goToOrders(): void {
    if (this.isGuest) {
      // 🧹 Clear guest data from localStorage
      localStorage.removeItem("guest_cart");
      localStorage.removeItem("guest_favorites");

      // If your GuestUserService manages its own clear methods:
      if (this.guestService.clearAll) {
        this.guestService.clearAll();
      }

      // Redirect to home or menu after guest checkout
      this.router.navigate(["/menu"]);
    } else {
      // 🧾 Logged user → Go to My Orders
      this.router.navigate(["/myorders"]);
    }
  }
}
