// src/app/services/theme.service.ts
import { Injectable } from "@angular/core";

export type Theme = "light" | "dark";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private activeTheme: Theme = "dark"; // ✅ default DARK

  constructor() {
    this.initTheme();
  }

  /** Apply a given theme */
  setTheme(theme: Theme): void {
    this.activeTheme = theme;

    // Remove both theme classes
    document.body.classList.remove("light", "dark");

    // Apply new theme
    document.body.classList.add(theme);

    // Save choice
    localStorage.setItem("theme", theme);
  }

  /** Toggle theme manually */
  toggleTheme(): void {
    const newTheme: Theme = this.activeTheme === "light" ? "dark" : "light";
    this.setTheme(newTheme);
  }

  /** Load from storage or default (dark) */
  initTheme(): void {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    this.setTheme(savedTheme ?? "dark"); // ✅ dark if nothing saved
  }

  /** Get current theme */
  getTheme(): Theme {
    return this.activeTheme;
  }
}
