import { Component } from "@angular/core";
import { HeaderComponent } from "../component/common/header/header.component";
import { FooterComponent } from "../component/common/footer/footer.component";
import { BreadcrumbComponent } from "../component/common/breadcrumb/breadcrumb.component";
@Component({
  selector: "app-aboutus",
  imports: [HeaderComponent, FooterComponent, BreadcrumbComponent],
  templateUrl: "./aboutus.component.html",
  styleUrl: "./aboutus.component.scss",
})
export class AboutusComponent {}
