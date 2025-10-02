import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ThemeService } from "../../core/services/theme.service";

@Component({
  selector: "app-theme",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./theme.component.html",
  styleUrls: ["./theme.component.scss"],
})
export class ThemeComponent {
  constructor(public themeService: ThemeService) {}

  toggleTheme(): void {
    return this.themeService.toggleTheme();
  }

  get currentTheme() {
    return this.themeService.getTheme();
  }
}
