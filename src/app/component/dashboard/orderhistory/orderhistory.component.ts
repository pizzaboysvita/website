import { Component } from "@angular/core";
import { HeaderComponent } from "../../common/header/header.component";
import { FooterComponent } from "../../common/footer/footer.component";
import { BreadcrumbComponent } from "../../common/breadcrumb/breadcrumb.component";
import { HomeService } from "../../../services/home.service";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-orderhistory",
  imports: [HeaderComponent, FooterComponent, BreadcrumbComponent, CommonModule],
  templateUrl: "./orderhistory.component.html",
  styleUrl: "./orderhistory.component.scss",
})
export class OrderhistoryComponent {
  orders: any[] = [];
  token: string | null = null;
  user2: any;

  constructor(private apiservice: HomeService,
      private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.token = this.authService.getToken();
    let user1 = localStorage.getItem('user');
    if (user1) {
      this.user2 = JSON.parse(user1);
    }
    console.log(this.user2,"djfhkjsdlf");
    this.loadOrders();
  }
  // loadOrders(): void {
  //   this.apiservice.getOrders().subscribe({
  //     next: (res) => {
  //       console.log('Orders API Raw Response:', res);

  //       const data = res?.categories ?? [];
  //       this.orders = data.map((o: any) => {
  //         let image: string = 'assets/img/default.png'; // ✅ fallback

  //         try {
  //           const items = o?.order_items ? JSON.parse(o.order_items) : [];
  //           const firstItemWithImage = items.find(
  //             (item: any) => item?.image_url && item.image_url.trim() !== ''
  //           );

  //           if (firstItemWithImage) {
  //             image = firstItemWithImage.image_url.replace(/\\/g, '');
  //           }
  //         } catch (e) {
  //           console.warn('Error parsing order_items for order:', o, e);
  //         }

  //         return {
  //           image, // ✅ only one image per order
  //           restaurantName: `Store #${o?.store_id ?? 'N/A'}`,
  //           orderId: o?.order_master_id ?? 'N/A',
  //           transactionId: o?.unitnumber ?? 'N/A',
  //           totalprice: Number(o?.total_price) || 0,
  //           time: o?.order_created_datetime
  //             ? new Date(o.order_created_datetime).toLocaleString()
  //             : 'N/A'
  //         };
  //       });

  //       console.log('Orders for UI:', this.orders);
  //     },
  //     error: (err) => {
  //       console.error('Error fetching orders:', err);
  //     }

  //   });

  // }

  logout() {
    this.authService.logout();
    this.token = null;
    this.router.navigate(["/login"]);
  }

 loadOrders(): void {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log(user, "user");

  const userId = user?.user_id || 33;
  const storeId = user?.store_id || 48;

  this.apiservice.getOrders(userId, storeId).subscribe({
    next: (res) => {
      console.log('Orders API Raw Response:', res);

      const data = res?.categories ?? [];
      this.orders = data.map((o: any) => {
        // default dummy image
        let image: string = '/assets/img/dessert_pizzas.png';

        try {
          const items = o?.order_items ? JSON.parse(o.order_items) : [];
          const firstItemWithImage = items.find(
            (item: any) => item?.image_url && item.image_url.trim() !== ''
          );

          if (firstItemWithImage) {
            // clean the API image url
            let url = firstItemWithImage.image_url.replace(/\\/g, '');
            // prepend domain if url is relative
            if (!url.startsWith('http')) {
              url = `http://78.142.47.247:3003/${url}`;
            }
            image = url || image; // use API image if available, else dummy
          }
        } catch (e) {
          console.warn('Error parsing order_items for order:', o, e);
        }

        return {
          image, // ← use the variable here
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



  ///orders
  //  loadOrders(): void {
  // const orderId = 48;
  // this.apiservice.getOrderById(orderId).subscribe({
  //   next: (res) => {
  //     console.log('Orders API Raw Response:', res);

  //     const data = res?.categories ?? [];
  //     this.orders = data.map((o: any) => {
  //       let image: string = 'assets/img/default.png'; // fallback

  //       try {
  //         const items = o?.order_items ? JSON.parse(o.order_items) : [];
  //         const firstItemWithImage = items.find(
  //           (item: any) => item?.image_url && item.image_url.trim() !== ''
  //         );

  //         if (firstItemWithImage) {
  //           let rawUrl = firstItemWithImage.image_url.replace(/\\/g, '');

  //           // If image doesn't start with http, prepend domain
  //           if (!rawUrl.startsWith('http')) {
  //             rawUrl = `http://78.142.47.247:3003/${rawUrl}`;
  //           }

  //           image = rawUrl;
  //         }
  //       } catch (e) {
  //         console.warn('Error parsing order_items for order:', o, e);
  //       }

  //       return {
  //         image,
  //         restaurantName: `Store #${o?.store_id ?? 'N/A'}`,
  //         orderId: o?.order_master_id ?? 'N/A',
  //         transactionId: o?.unitnumber ?? 'N/A',
  //         totalprice: Number(o?.total_price) || 0,
  //         time: o?.order_created_datetime
  //           ? new Date(o.order_created_datetime).toLocaleString()
  //           : 'N/A'
  //       };
  //     });

  //     console.log('Orders for UI:', this.orders);
  //   },
  //   error: (err) => {
  //     console.error('Error fetching orders:', err);
  //   }
  // });
  //   }

 

 
 onImageError(event: any) {
  event.target.src = 'assets/img/chicken_pizzas/Apricot Chicken Pizza.webp';

}}




