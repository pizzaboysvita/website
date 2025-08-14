import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  options?: any[];
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  addItem(item: Partial<CartItem>) {
    console.log(item, 'item from cart');
    
    const current = [...this.cartItems.value];
    const existing = current.find(ci => ci.id === item.id);

    if (existing) {
      existing.quantity += item.quantity || 1;
    } else {
      current.push({
        id: item.id!,
        name: item.name!,
        price: item.price!,
        image: item.image,
        quantity: item.quantity || 1,
        options: item.options || []
      });
    }

    this.cartItems.next(current);
  }

  removeItem(id: number) {
    this.cartItems.next(this.cartItems.value.filter(ci => ci.id !== id));
  }

  increaseQuantity(id: number) {
    const updated = this.cartItems.value.map(ci =>
      ci.id === id ? { ...ci, quantity: ci.quantity + 1 } : ci
    );
    this.cartItems.next(updated);
  }

  decreaseQuantity(id: number) {
    const updated = this.cartItems.value.map(ci =>
      ci.id === id && ci.quantity > 1
        ? { ...ci, quantity: ci.quantity - 1 }
        : ci
    );
    this.cartItems.next(updated);
  }

  clearCart() {
    this.cartItems.next([]);
  }

  getTotalPrice() {
    return this.cartItems.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
}
