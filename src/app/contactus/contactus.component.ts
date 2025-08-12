import { Component } from '@angular/core';
import { HeaderComponent } from '../component/home/header/header.component';
import { FooterComponent } from '../component/home/footer/footer.component';

@Component({
  selector: 'app-contactus',
  imports: [HeaderComponent,FooterComponent],
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.scss'
})
export class ContactusComponent {

}
