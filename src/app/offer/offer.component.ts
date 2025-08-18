import { Component } from '@angular/core';
import { HeaderComponent } from '../component/home/header/header.component';
import { FooterComponent } from '../component/home/footer/footer.component';
import { OffersComponent } from '../component/home/offers/offers.component';
import { BreadcrumbComponent } from "../shared/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-offer',
  imports: [HeaderComponent, FooterComponent, OffersComponent, BreadcrumbComponent],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.scss'
})
export class OfferComponent {

}
