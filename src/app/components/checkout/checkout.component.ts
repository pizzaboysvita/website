import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

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
export class CheckoutComponent {
  order: Order | null = null;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.order = nav?.extras.state?.["order"] ?? null;
  }

  goToOrders(): void {
    this.router.navigate(["/myorders"]);
  }
}
