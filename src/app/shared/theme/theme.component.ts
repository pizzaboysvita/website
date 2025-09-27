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
export class ThemeComponent implements OnInit {
  currentTheme: "light" | "dark" = "light";

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.currentTheme = this.themeService.getTheme();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.currentTheme = this.themeService.getTheme();
  }
}
