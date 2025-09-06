import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from "../../../common/footer/footer.component";
import { HeaderComponent } from "../../../common/header/header.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [FooterComponent, HeaderComponent,CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
   order: any;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.order = nav?.extras.state?.['order'];
  }
  goToOrders(): void {
   
    this.router.navigate(['/myorders']);
  }
}
