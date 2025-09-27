import { Component } from "@angular/core";
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
@Component({
  selector: "app-contactus",
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
})
export class ContactComponent {}
