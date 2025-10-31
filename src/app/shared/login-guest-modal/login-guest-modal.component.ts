import { Component, EventEmitter, Output } from "@angular/core";
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

  /** ✅ Event emitter to notify parent (like Header) of selection */
  @Output() guestSelected = new EventEmitter<void>();

  private resolver: ((value: "login" | "guest" | null) => void) | null = null;

  constructor(private router: Router, private guestService: GuestUserService) {}

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

  /** ✅ Continue as Guest */
  continueAsGuest(): void {
    const guestId = this.guestService.activateGuest();
    console.log("Guest mode activated:", guestId);

    // Emit event to parent
    this.guestSelected.emit();

    this.show = false;
    if (this.resolver) {
      this.resolver("guest");
      this.resolver = null;
    }
  }

  /** ✅ Go to Login page */
  goToLogin(): void {
    this.show = false;
    if (this.resolver) {
      this.resolver("login");
      this.resolver = null;
    }
    this.router.navigate(["/login"]);
  }
}
