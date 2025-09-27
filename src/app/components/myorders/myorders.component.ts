import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { HomeService } from "../../core/services/home.service";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-myorders",
  imports: [BreadcrumbComponent, CommonModule],
  templateUrl: "./myorders.component.html",
  styleUrls: ["./myorders.component.scss"],
})
export class MyOrdersComponent {
  orders: any[] = [];
  user2: any;

  constructor(
    private apiservice: HomeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user2 = JSON.parse(localStorage.getItem("user") || "{}");
    this.loadOrders();
  }

  loadOrders(): void {
    const userId = this.user2?.user_id;

    this.apiservice.getOrders(userId).subscribe({
      next: (res) => {
        const data = res?.categories ?? [];
        this.orders = data.map((o: any) => {
          let image: string = "/assets/img/dessert_pizzas.png";
          try {
            const items = o?.order_items ? JSON.parse(o.order_items) : [];
            const firstItemWithImage = items.find((item: any) =>
              item?.image_url?.trim()
            );
            if (firstItemWithImage) {
              let url = firstItemWithImage.image_url.replace(/\\/g, "");
              if (!url.startsWith("http")) {
                url = `http://78.142.47.247:3003/${url}`;
              }
              image = url;
            }
          } catch (e) {
            console.warn("Error parsing order_items for order:", o, e);
          }
          return {
            image,
            restaurantName: `Store #${o?.store_id ?? "N/A"}`,
            orderId: o?.order_master_id ?? "N/A",
            transactionId: o?.unitnumber ?? "N/A",
            totalprice: Number(o?.total_price) || 0,
            time: o?.order_created_datetime
              ? new Date(o.order_created_datetime).toLocaleString()
              : "N/A",
          };
        });
      },
      error: (err) => console.error("Error fetching orders:", err),
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  onImageError(event: any) {
    event.target.src = "assets/img/Apricot Chicken Pizza.webp";
  }
}
