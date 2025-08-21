import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { FooterComponent } from "../component/home/footer/footer.component";
import { HeaderComponent } from "../component/home/header/header.component";

@Component({
  selector: 'app-login',
  imports: [FooterComponent, HeaderComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
submitted: any;
f: any;

}
