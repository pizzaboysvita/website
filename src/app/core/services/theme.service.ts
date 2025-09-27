// src/app/services/theme.service.ts
import { Injectable } from "@angular/core";

export type Theme = "light" | "dark";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private activeTheme: Theme = "light";

  constructor() {
    this.loadTheme();
  }

  /** Set theme (light/dark) */
  setTheme(theme: Theme): void {
    this.activeTheme = theme;

    // Remove old theme classes first
    document.body.classList.remove("light", "dark");

    // Apply new theme
    document.body.classList.add(theme);

    // Save in localStorage
    localStorage.setItem("theme", theme);
  }

  /** Toggle theme between light and dark */
  toggleTheme(): void {
    const newTheme: Theme = this.activeTheme === "light" ? "dark" : "light";
    this.setTheme(newTheme);
  }

  /** Load theme from localStorage or set default */
  private loadTheme(): void {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    this.setTheme(savedTheme ?? "light");
  }

  /** Get currently active theme */
  getTheme(): Theme {
    return this.activeTheme;
  }
}
