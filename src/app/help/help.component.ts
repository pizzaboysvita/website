import { Component } from '@angular/core';
import { HeaderComponent } from "../component/common/header/header.component";
import { FooterComponent } from "../component/common/footer/footer.component";

@Component({
  selector: 'app-help',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent {

}
