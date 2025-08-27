import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { FooterComponent } from "../component/common/footer/footer.component";
import { HeaderComponent } from "../component/common/header/header.component";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { AuthService } from "../services/auth.service";
@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"], // ✅ fixed plural
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password_hash: ["", [Validators.required, Validators.minLength(6)]],
    });
  }
  // A getter for easy access to form fields in the template
  get f() {
    return this.loginForm.controls;
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const { email, password_hash } = this.loginForm.value;
    this.authService.login({ email, password_hash }).subscribe({
      next: (res) => {
        console.log("Login response:", res);
        if (res && res.code == 1) {
          this.authService.setToken(res.access_token);
          localStorage.setItem("user", JSON.stringify(res.user));
          this.router.navigate(["/home"]);
          alert("Login successful!");
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
