import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../../common/header/header.component";
import { FooterComponent } from "../../common/footer/footer.component";
import { BreadcrumbComponent } from "../../common/breadcrumb/breadcrumb.component";
@Component({
  selector: "app-whishlist",
  imports: [HeaderComponent, FooterComponent, CommonModule, BreadcrumbComponent],
  templateUrl: "./whishlist.component.html",
  styleUrl: "./whishlist.component.scss",
})
export class WhishlistComponent {}
