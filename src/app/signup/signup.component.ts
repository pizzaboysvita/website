import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HeaderComponent } from "../component/common/header/header.component";
import { FooterComponent } from "../component/common/footer/footer.component";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "../services/auth.service";
@Component({
  selector: "app-signup",
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"], // ✅ fixed
})
export class SignupComponent {
  signupForm!: FormGroup;
  selectedFile?: File;
  constructor(private fb: FormBuilder, private authService: AuthService) {}
  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        first_name: ["", [Validators.required, Validators.minLength(2)]],
        last_name: ["", [Validators.required, Validators.minLength(2)]],
        email: ["", [Validators.required, Validators.email]],
        password_hash: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required, Validators.minLength(6)]],
        city: ["", [Validators.required, Validators.minLength(3)]],
        state: ["", [Validators.required, Validators.minLength(3)]],
        address: ["", [Validators.required, Validators.minLength(10)]],
        country: ["", Validators.required],
        phone_number: [
          "",
          [Validators.required, Validators.pattern("^[0-9]{10}$")],
        ],
        image: [null, Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get("password_hash")?.value; // ✅ fixed
    const confirmPassword = control.get("confirmPassword")?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.signupForm.patchValue({ image: this.selectedFile.name }); // ✅ keep form valid
    }
  }
  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    const userPayload = {
      type: "insert",
      role_id: 1,
      store_id: 4,
      first_name: this.signupForm.value.first_name,
      last_name: this.signupForm.value.last_name,
      phone_number: this.signupForm.value.phone_number,
      email: this.signupForm.value.email,
      password_hash: this.signupForm.value.password_hash,
      address: this.signupForm.value.address,
      country: this.signupForm.value.country,
      state: this.signupForm.value.state,
      city: this.signupForm.value.city,
      pos_pin: 500001,
      status: 1,
      created_by: 1,
      updated_by: 1,
      refresh_token: "",
      permissions: {
        create: false,
        dashboard: true,
        orders_board_view: false,
        orders_list_view: false,
        orders_delete: true,
        bookings: true,
        bookings_delete: true,
        customers: false,
        menus: false,
        menus_images: false,
        settings_systems: false,
        settings_services: false,
        settings_payments: false,
        settings_website: false,
        settings_integrations: false,
        billing: false,
        reports: false,
      },
    };
    this.authService.signup(userPayload, this.selectedFile).subscribe({
      next: (res: any) => {
        console.log("Signup success:", res);
        alert("Signup successful!");
      },
      error: (err: any) => {
        console.error("Signup failed:", err);
        alert("Signup failed. Try again.");
      },
    });
  }
}
