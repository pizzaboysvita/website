import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CartService } from "../../core/services/cart.service";
import { AuthService } from "../../core/services/auth.service";
import { StoreService } from "../../core/services/store.service";
import { StoreModalComponent } from "../../components/storemodal/storemodal.component";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  token: string | null = null;
  user: any;
  cartCount = 0;
  selectedStoreName: string = "Default Store";

  navLinks = [
    { label: "Home", path: "/home" },
    { label: "Menu", path: "/menu" },
    { label: "Stores", path: "/stores" },
    { label: "Offers", path: "/offers" },
  ];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private storeService: StoreService,
    private router: Router,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Reactive login/logout
    this.authService.authChanged$.subscribe(() => {
      this.token = this.authService.getToken();
      const userData = localStorage.getItem("user");
      this.user = userData ? JSON.parse(userData) : null;
      this.cd.detectChanges();
    });

    // Initial token/user
    this.token = this.authService.getToken();
    const userData = localStorage.getItem("user");
    if (userData) this.user = JSON.parse(userData);

    // Cart updates
    this.cartService.cartItems$.subscribe((items) => {
      this.cartCount = items.length;
      this.cd.detectChanges();
    });

    // Store updates
    this.storeService.storeChanged$.subscribe((name: string) => {
      this.selectedStoreName = name;
      this.cd.detectChanges();
    });

    // Initial store
    this.selectedStoreName = this.storeService.getSelectedStoreName();

    // Open store modal if none selected
    if (this.storeService.getSelectedStoreId() === -1) {
      setTimeout(() => this.changeStore(), 500);
    }
  }

  changeStore() {
    this.modalService.open(StoreModalComponent, {
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  goToCart() {
    this.router.navigate(["/cartlist"]);
  }

  goToWishList() {
    this.router.navigate(["/wishlist"]);
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem("user");
    this.token = null;
    this.user = null;
    this.router.navigate(["/login"]);
  }
}
