import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../component/home/header/header.component";
import { FooterComponent } from "../component/home/footer/footer.component";
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
  ],
  templateUrl: "./signup.component.html",
  styleUrl: "./signup.component.scss",
})
export class SignupComponent {
  signupForm!: FormGroup;
  selectedFile?: File;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        firstName: ["", [Validators.required, Validators.minLength(2)]],
        lastName: ["", [Validators.required, Validators.minLength(2)]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get("password")?.value;
    const confirmPassword = control.get("confirmPassword")?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const userPayload = {
      type: "insert",
      role_id: 5,
      store_id: 4,
      first_name: this.signupForm.value.firstName,
      last_name: this.signupForm.value.lastName,
      phone_number: "1234567890",
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      // CORRECTED: Explicitly set a default value for 'profiles' to satisfy backend validation
      profiles: this.selectedFile ? this.selectedFile.name : "NA",
      address: "Default Address",
      country: "India",
      state: "TS",
      city: "Hyderabad",
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
