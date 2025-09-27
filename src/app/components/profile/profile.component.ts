import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.profileForm = this.fb.group({
      name: ["", Validators.required],
      newPassword: ["", [Validators.minLength(6)]],
      confirmPassword: [""],
    });
  }

  saveChanges(): void {
    if (this.profileForm.invalid) return;

    const { name, newPassword, confirmPassword } = this.profileForm.value;

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const payload = { name, password: newPassword };
    this.authService.updateProfile(payload).subscribe({
      next: (res) => {
        alert("Profile updated successfully!");
        console.log(res);
      },
      error: (err) => {
        console.error("Error updating profile:", err);
      },
    });
  }
}
