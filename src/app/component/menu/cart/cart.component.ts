import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { HeaderComponent } from "../../home/header/header.component";
import { FooterComponent } from "../../home/footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from "../../../shared/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule, ReactiveFormsModule, BreadcrumbComponent]
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(private cartService:CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
      console.log('Cart items updated:', this.cartItems);
      
    });
  }

  removeItem(index: number): void {
    this.cartService.removeItem(index);
  }

  increaseQuantity(index: number): void {
    this.cartItems[index].quantity += 1;
    this.cartService.addItem({ ...this.cartItems[index] }); 
    this.calculateTotal();
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity -= 1;
      this.calculateTotal();
    }
  }

  calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce((sum, item) => {
      const basePrice = parseFloat(item.dish.dish_price || '0');
      const optionsPrice = item.selectedOptions?.reduce((optSum: number, opt: any) => optSum + opt.price, 0) || 0;
      return sum + (basePrice + optionsPrice) * item.quantity;
    }, 0);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    console.log('Proceed to checkout', this.cartItems);
    // You can navigate to checkout page here
  }
}
