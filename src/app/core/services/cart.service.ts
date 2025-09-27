import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartItems = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor(private http: HttpClient) {}

  // 🔹 Load cart for specific user
  loadCart(userId: number) {
    const params = new HttpParams().set("user_id", userId.toString());

    this.http
      .get<any[]>(this.apiUrl, { params })
      .pipe(
        tap((items) => this.cartItems.next(items)),
        catchError((error: HttpErrorResponse) => {
          console.error("Failed to load cart items:", error);
          return throwError(() => new Error("Failed to load cart items."));
        })
      )
      .subscribe();
  }

  addItem(
    userId: number,
    dishId: number,
    storeId: number,
    price: number,
    quantity: number,
    options: any
  ) {
    const body = {
      type: "insert",
      user_id: userId,
      dish_id: dishId,
      store_id: storeId,
      quantity,
      price,
      options_json: JSON.stringify(options),
    };
    return this.http.post(this.apiUrl, body).pipe(
      tap(() => this.loadCart(userId)), // 🔹 reload cart for this user
      catchError((error: HttpErrorResponse) => {
        console.error("Failed to add item to cart:", error);
        return throwError(() => new Error("Failed to add item to cart."));
      })
    );
  }

  removeItem1(cartItemId: number, userId: number) {
    const body = { type: "delete_item", user_id: userId, cart_id: cartItemId };
    return this.http.post(this.apiUrl, body).pipe(
      tap(() => this.loadCart(userId)), // 🔹 reload cart for this user
      catchError((error: HttpErrorResponse) => {
        console.error("Failed to remove item from cart:", error);
        return throwError(() => new Error("Failed to remove item from cart."));
      })
    );
  }

  removeItem(cartItemId: number) {
    return this.http.delete(`${this.apiUrl}/${cartItemId}`).pipe(
      tap(() => this.loadCartFromLocal()), // reload using stored userId
      catchError((error: HttpErrorResponse) => {
        console.error("Failed to remove item from cart:", error);
        return throwError(() => new Error("Failed to remove item from cart."));
      })
    );
  }

  clearCart() {
    this.cartItems.next([]);
  }

  getTotalPrice(): number {
    return this.cartItems.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  // Optional: use stored userId from localStorage
  private loadCartFromLocal() {
    const userId = Number(localStorage.getItem("user_id")) || 0;
    if (userId > 0) this.loadCart(userId);
  }
}
