import { Component } from '@angular/core';
import { HeaderComponent } from "../component/common/header/header.component";
import { FooterComponent } from "../component/common/footer/footer.component";

@Component({
  selector: 'app-feedback',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {

}
