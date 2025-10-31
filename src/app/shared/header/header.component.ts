import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CartService } from "../../core/services/cart.service";
import { AuthService } from "../../core/services/auth.service";
import { StoreService } from "../../core/services/store.service";
import { GuestUserService } from "../../core/services/guest-user.service";
import { StoreModalComponent } from "../../components/storemodal/storemodal.component";
import { LoginGuestModalComponent } from "../login-guest-modal/login-guest-modal.component";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule, LoginGuestModalComponent],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  @ViewChild(LoginGuestModalComponent) loginGuestModal!: LoginGuestModalComponent;

  token: string | null = null;
  user: any;
  cartCount = 0;
  selectedStoreName = "Default Store";
  isGuestUser = false;

  navLinks = [
    { label: "Home", path: "/home" },
    { label: "Menu", path: "/menu" },
    { label: "Stores", path: "/stores" },
    { label: "Offers", path: "/offers" },
  ];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private guestService: GuestUserService,
    private storeService: StoreService,
    private router: Router,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.syncUserStatus();

    // 🔄 React to Auth or Guest changes
    this.authService.authChanged$.subscribe(() => this.syncUserStatus());
    this.guestService.guestStatus$.subscribe(() => this.syncUserStatus());

    // 🛒 Cart reactive updates
    this.cartService.cartItems$.subscribe((items) => {
      this.cartCount = items.length;
      this.cd.detectChanges();
    });

    // 🏪 Store reactive updates
    this.storeService.storeChanged$.subscribe((name: string) => {
      this.selectedStoreName = name;
      this.cd.detectChanges();
    });

    // Initialize store name
    this.selectedStoreName = this.storeService.getSelectedStoreName();

    // Ask for store selection if not selected
    if (this.storeService.getSelectedStoreId() === -1) {
      setTimeout(() => this.changeStore(), 500);
    }
  }

  /** ✅ Sync user or guest session */
  private syncUserStatus() {
    this.token = this.authService.getToken();
    this.isGuestUser = this.guestService.isGuest();
    const userData = localStorage.getItem("user");
    this.user = userData ? JSON.parse(userData) : null;
    this.cd.detectChanges();
  }

  /** ✅ Store selection modal */
  changeStore() {
    this.modalService.open(StoreModalComponent, {
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  /** ✅ Navigate with guest modal */
  goToCart() {
    if (this.token || this.isGuestUser) {
      this.router.navigate(["/cartlist"]);
    } else {
      this.loginGuestModal.open();
    }
  }

  goToWishList() {
    if (this.token || this.isGuestUser) {
      this.router.navigate(["/wishlist"]);
    } else {
      this.loginGuestModal.open();
    }
  }

  /** ✅ Logout / Guest Exit */
  logout() {
    if (this.isGuestUser) {
      this.guestService.disableGuestMode();
      this.isGuestUser = false;
      this.router.navigate(["/home"]).then(() => {
        window.location.reload(); // force reload to refresh header
      });
    } else {
      this.authService.logout();
      localStorage.removeItem("user");
      this.token = null;
      this.user = null;
      this.router.navigate(["/login"]).then(() => {
        window.location.reload(); // refresh header UI
      });
    }
  }

  /** ✅ From Guest Modal */
  onGuestSelected() {
    this.guestService.activateGuest();
    this.isGuestUser = true;
    this.cd.detectChanges();
  }
}