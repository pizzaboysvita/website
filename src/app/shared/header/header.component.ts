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
import { Subscription } from "rxjs";

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
  user: any = null;
  cartCount = 0;
  selectedStoreName = "Default Store";
  isGuestUser = false;

  private subs: Subscription[] = [];

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
    // initial sync
    this.syncUserStatus();

    // Subscribe to auth changes (login/logout)
    this.subs.push(
      this.authService.currentUser$.subscribe((user) => {
        this.user = user;
        this.token = this.authService.getToken();
        // if a real user logged in, ensure guest flag cleared
        if (user && this.guestService.isGuest()) {
          this.guestService.disableGuestMode();
        }
        this.isGuestUser = this.guestService.isGuest();
        this.cd.detectChanges();
      })
    );

    // Subscribe to guest mode changes
    this.subs.push(
      this.guestService.guestStatus$.subscribe((isGuest) => {
        this.isGuestUser = !!isGuest;
        // keep token/user in sync
        this.token = this.authService.getToken();
        this.user = this.authService.getUser();
        this.cd.detectChanges();
      })
    );

    // cart updates
    this.subs.push(
      this.cartService.cartItems$.subscribe((items) => {
        this.cartCount = items.length;
        this.cd.detectChanges();
      })
    );

    // store updates
    this.subs.push(
      this.storeService.storeChanged$.subscribe((name: string) => {
        this.selectedStoreName = name;
        this.cd.detectChanges();
      })
    );

    // initialize store
    this.selectedStoreName = this.storeService.getSelectedStoreName();
    if (this.storeService.getSelectedStoreId() === -1) {
      setTimeout(() => this.changeStore(), 500);
    }
  }

  private syncUserStatus() {
    this.token = this.authService.getToken();
    this.user = this.authService.getUser();
    this.isGuestUser = this.guestService.isGuest();
    this.cd.detectChanges();
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

  logout() {
    if (this.isGuestUser) {
      this.guestService.disableGuestMode();
      this.isGuestUser = false;
      this.router.navigate(["/home"]);
    } else {
      this.authService.logout();
      this.token = null;
      this.user = null;
      this.router.navigate(["/login"]);
      this.cd.detectChanges();
    }
  }

  onGuestSelected() {
    this.guestService.activateGuest();
    this.isGuestUser = true;
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
