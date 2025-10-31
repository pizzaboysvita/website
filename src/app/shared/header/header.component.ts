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
  selectedStoreName: string = "Default Store";
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

    // Auth change listener
    this.authService.authChanged$.subscribe(() => {
      this.syncUserStatus();
    });

    // Cart reactive updates
    this.cartService.cartItems$.subscribe((items) => {
      this.cartCount = items.length;
      this.cd.detectChanges();
    });

    // Store reactive updates
    this.storeService.storeChanged$.subscribe((name: string) => {
      this.selectedStoreName = name;
      this.cd.detectChanges();
    });

    // Initial store
    this.selectedStoreName = this.storeService.getSelectedStoreName();

    // Ask store selection if not selected
    if (this.storeService.getSelectedStoreId() === -1) {
      setTimeout(() => this.changeStore(), 500);
    }
  }

  /** ✅ Sync User / Guest status */
  private syncUserStatus() {
    this.token = this.authService.getToken();
    this.isGuestUser = this.guestService.isGuest();
    const userData = localStorage.getItem("user");
    this.user = userData ? JSON.parse(userData) : null;
    this.cd.detectChanges();
  }

  /** ✅ Open Store Selector */
  changeStore() {
    this.modalService.open(StoreModalComponent, {
      size: "lg",
      centered: true,
      backdrop: "static",
      keyboard: false,
    });
  }

  /** ✅ Go to Cart / Wishlist with Guest-Login modal */
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

  /** ✅ Logout or Disable Guest */
  logout() {
    if (this.isGuestUser) {
      this.guestService.disableGuestMode();
      this.isGuestUser = false;
      this.router.navigate(["/home"]);
    } else {
      this.authService.logout();
      localStorage.removeItem("user");
      this.token = null;
      this.user = null;
      this.router.navigate(["/login"]);
    }
  }

  /** ✅ When user chooses Guest from Modal */
  onGuestSelected() {
    this.guestService.activateGuest();
    this.isGuestUser = true;
    this.cd.detectChanges();
  }
}
