import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { HeaderComponent } from '../component/home/header/header.component';
import { FooterComponent } from '../component/home/footer/footer.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
signupForm: any;

}
