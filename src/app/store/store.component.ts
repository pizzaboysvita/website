import { Component } from '@angular/core';
import { HeaderComponent } from '../component/home/header/header.component';
import { FooterComponent } from '../component/home/footer/footer.component';

@Component({
  selector: 'app-store',
  imports: [HeaderComponent,FooterComponent],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export class StoreComponent {

}
