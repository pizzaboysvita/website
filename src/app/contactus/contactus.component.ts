import { Component } from '@angular/core';
import { HeaderComponent } from '../component/home/header/header.component';
import { FooterComponent } from '../component/home/footer/footer.component';
import { BreadcrumbComponent } from "../shared/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-contactus',
  imports: [HeaderComponent, FooterComponent, BreadcrumbComponent],
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.scss'
})
export class ContactusComponent {

}
