import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { AuthService } from "../../core/services/auth.service";
import { CouponService } from "../../core/services/coupon.service";
import { GuestUserService } from "../../core/services/guest-user.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private guestService: GuestUserService,
    private router: Router,
    private couponService: CouponService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password_hash: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    const { email, password_hash } = this.loginForm.value;

    this.authService.login({ email, password_hash }).subscribe({
      next: (res) => {
        // backend returns code==1 sometimes — still AuthService handles tokens & user
        if (res && (res.code === 1 || res.token || res.access_token || res.accessToken)) {
          // If guest mode was active, disable it — prevents header confusion
          if (this.guestService.isGuest()) {
            this.guestService.disableGuestMode();
          }

          // AuthService already stored token/user and emitted currentUser$
          // Just navigate; header listens to currentUser$
          this.router.navigate(["/home"]).then(() => {
            this.couponService.openCouponModal?.();
          });
        } else {
          alert("Login failed. Please check your credentials.");
        }
      },
      error: (err) => {
        console.error("Login failed:", err);
        alert("Something went wrong. Please try again.");
      },
    });
  }
}
