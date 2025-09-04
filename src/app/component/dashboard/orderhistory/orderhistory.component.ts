import { Component } from "@angular/core";
import { HeaderComponent } from "../../common/header/header.component";
import { FooterComponent } from "../../common/footer/footer.component";
import { BreadcrumbComponent } from "../../common/breadcrumb/breadcrumb.component";
import { HomeService } from "../../../services/home.service";
import { CommonModule } from "@angular/common";
@Component({
  selector: "app-orderhistory",
  imports: [HeaderComponent, FooterComponent, BreadcrumbComponent, CommonModule],
  templateUrl: "./orderhistory.component.html",
  styleUrl: "./orderhistory.component.scss",
})
export class OrderhistoryComponent {
  orders: any[] = [];

  constructor(private apiservice: HomeService) { }

  ngOnInit(): void {
    this.loadOrders();
  }
  loadOrders(): void {
    this.apiservice.getOrders().subscribe({
      next: (res) => {
        console.log('Orders API Raw Response:', res);

        const data = res?.categories ?? [];
        this.orders = data.map((o: any) => {
          let image: string = 'assets/img/default.png'; // ✅ fallback

          try {
            const items = o?.order_items ? JSON.parse(o.order_items) : [];
            const firstItemWithImage = items.find(
              (item: any) => item?.image_url && item.image_url.trim() !== ''
            );

            if (firstItemWithImage) {
              image = firstItemWithImage.image_url.replace(/\\/g, '');
            }
          } catch (e) {
            console.warn('Error parsing order_items for order:', o, e);
          }

          return {
            image, // ✅ only one image per order
            restaurantName: `Store #${o?.store_id ?? 'N/A'}`,
            orderId: o?.order_master_id ?? 'N/A',
            transactionId: o?.unitnumber ?? 'N/A',
            totalprice: Number(o?.total_price) || 0,
            time: o?.order_created_datetime
              ? new Date(o.order_created_datetime).toLocaleString()
              : 'N/A'
          };
        });

        console.log('Orders for UI:', this.orders);
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      }

    });

  }
   onImageError(event: any) {
  event.target.src = 'assets/img/chicken_pizzas/Apricot Chicken Pizza.webp';
}


}




