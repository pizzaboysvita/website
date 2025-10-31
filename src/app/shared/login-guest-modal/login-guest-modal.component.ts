import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { GuestUserService } from "../../core/services/guest-user.service";

@Component({
  selector: "app-login-guest-modal",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./login-guest-modal.component.html",
  styleUrls: ["./login-guest-modal.component.scss"],
})
export class LoginGuestModalComponent {
  show = false;

  private resolver: ((value: "login" | "guest" | null) => void) | null = null;

  constructor(
    private router: Router,
    private guestService: GuestUserService
  ) {}

  /** ✅ Open modal and return a Promise resolved with user choice */
  open(): Promise<"login" | "guest" | null> {
    this.show = true;
    return new Promise((resolve) => {
      this.resolver = resolve;
    });
  }

  /** ✅ Close modal without choice */
  close(): void {
    this.show = false;
    if (this.resolver) {
      this.resolver(null);
      this.resolver = null;
    }
  }

  /** ✅ User chose Guest */
  continueAsGuest(): void {
    const guestId = this.guestService.activateGuest();
    console.log("Guest mode activated:", guestId);
    this.show = false;
    if (this.resolver) {
      this.resolver("guest");
      this.resolver = null;
    }
  }

  /** ✅ User chose Login */
  goToLogin(): void {
    this.show = false;
    if (this.resolver) {
      this.resolver("login");
      this.resolver = null;
    }
    this.router.navigate(["/login"]);
  }
}
