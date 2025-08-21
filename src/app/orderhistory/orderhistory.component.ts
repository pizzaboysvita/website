import { Component } from '@angular/core';
import { FooterComponent } from "../component/home/footer/footer.component";
import { HeaderComponent } from "../component/home/header/header.component";
import { BreadcrumbComponent } from "../shared/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-orderhistory',
  imports: [FooterComponent, HeaderComponent, BreadcrumbComponent],
  templateUrl: './orderhistory.component.html',
  styleUrl: './orderhistory.component.scss'
})
export class OrderhistoryComponent {

}
