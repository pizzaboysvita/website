import { Component } from "@angular/core";
import { HeaderComponent } from "../../common/header/header.component";
import { FooterComponent } from "../../common/footer/footer.component";
import { BreadcrumbComponent } from "../../common/breadcrumb/breadcrumb.component";
@Component({
  selector: "app-orderhistory",
  imports: [HeaderComponent, FooterComponent, BreadcrumbComponent],
  templateUrl: "./orderhistory.component.html",
  styleUrl: "./orderhistory.component.scss",
})
export class OrderhistoryComponent {}
