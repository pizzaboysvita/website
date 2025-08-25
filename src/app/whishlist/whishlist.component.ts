import { Component } from '@angular/core';
import { HeaderComponent } from "../component/home/header/header.component";
import { FooterComponent } from "../component/home/footer/footer.component";

import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-whishlist',
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './whishlist.component.html',
  styleUrl: './whishlist.component.scss'
})
export class WhishlistComponent {


}
