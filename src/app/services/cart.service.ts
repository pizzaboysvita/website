import { Injectable } from "@angular/core";
import { BehaviorSubject, tap, catchError, throwError } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  options?: any;
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  private apiUrl = "http://78.142.47.247:3003/api/cart";
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfaWQiOjF9LCJpYXQiOjE3NTU5NjU5OTksImV4cCI6MTc1NTk2OTU5OX0.3RrhzmApB8bUQeUMwjCvoDo401aq-BRKplDlGTT_1oY";
    // const token = localStorage.getItem("auth_token");
    // if (!token) {
    //   console.error("Authentication token not found.");
    //   return { headers: new HttpHeaders() };
    // }

    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  loadCart() {
    this.http
      .get<CartItem[]>(this.apiUrl, this.getHeaders())
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
      user_id: userId,
      dish_id: dishId,
      store_id: storeId,
      quantity: quantity,
      price: price,
      options_json: JSON.stringify(options),
    };

    return this.http.post(this.apiUrl, body, this.getHeaders()).pipe(
      tap(() => this.loadCart()),
      catchError((error: HttpErrorResponse) => {
        console.error("Failed to add item to cart:", error);
        return throwError(() => new Error("Failed to add item to cart."));
      })
    );
  }

  removeItem(cartItemId: number) {
    return this.http
      .delete(`${this.apiUrl}/${cartItemId}`, this.getHeaders())
      .pipe(
        tap(() => this.loadCart()),
        catchError((error: HttpErrorResponse) => {
          console.error("Failed to remove item from cart:", error);
          return throwError(
            () => new Error("Failed to remove item from cart.")
          );
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
}
