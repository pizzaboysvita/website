import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { OffersComponent } from "../../components/offers/offers.component";

@Component({
  selector: "app-offer",
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, OffersComponent],
  templateUrl: "./offer.component.html",
  styleUrl: "./offer.component.scss",
})
export class OfferComponent {}
