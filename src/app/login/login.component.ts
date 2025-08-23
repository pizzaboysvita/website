import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FooterComponent } from "../component/home/footer/footer.component";
import { HeaderComponent } from "../component/home/header/header.component";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
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
      password: ["", [Validators.required, Validators.minLength(6)]],
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

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (res) => {
        console.log("Login successful:", res);
        if (res.code === 1) {
          this.authService.setToken(res.access_token);
          this.router.navigate(["/home"]);   
          alert("Login successful!");
        } else {
          alert("Login failed. Please check your credentials.");
        }
      },
      error: (err) => {
        console.error("Login failed:", err);
        alert("Login failed. Please check your credentials.");
      },
    });
  }
}
