import { Component } from '@angular/core';
import { HeaderComponent } from "../component/common/header/header.component";
import { FooterComponent } from "../component/common/footer/footer.component";

@Component({
  selector: 'app-profile',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

}
