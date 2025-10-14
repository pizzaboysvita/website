import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./shared/header/header.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { ThemeComponent } from "./shared/theme/theme.component";
import { ThemeService } from "./core/services/theme.service";
import { CouponmodalComponent } from "./components/couponmodal/couponmodal.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ThemeComponent, CouponmodalComponent],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Initialize theme ONCE when app loads
    this.themeService.initTheme();
  }
}
