import { Component } from '@angular/core';
import { HeaderComponent } from "../component/common/header/header.component";
import { FooterComponent } from "../component/common/footer/footer.component";

@Component({
  selector: 'app-review',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {

}
