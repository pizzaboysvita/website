import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GuestUserService {
  private guestIdKey = "guestId";
  private isGuestKey = "isGuestUser";
  private guestCartKey = "guest_cart";
  private guestFavKey = "guest_favorites";
  private guestOrderKey = "guest_order";

  constructor() {
    this.ensureGuestId();
  }

  /** ✅ Create or get Guest ID */
  ensureGuestId(): string {
    let guestId = localStorage.getItem(this.guestIdKey);
    if (!guestId) {
      guestId = "guest_" + new Date().getTime();
      localStorage.setItem(this.guestIdKey, guestId);
    }
    return guestId;
  }

  /** ✅ Enable Guest Mode (and create guest ID if missing) */
  enableGuestMode(): void {
    localStorage.setItem(this.isGuestKey, "true");
    this.ensureGuestId();
  }

  /** ✅ Fully activate guest mode */
  activateGuest(): string {
    this.enableGuestMode();
    return this.ensureGuestId();
  }

  disableGuestMode(): void {
    localStorage.removeItem(this.isGuestKey);
    localStorage.removeItem(this.guestIdKey);
    this.clearAll();
  }

  isGuest(): boolean {
    return localStorage.getItem(this.isGuestKey) === "true";
  }

  getGuestId(): string | null {
    return localStorage.getItem(this.guestIdKey);
  }

  // 🛒 ----------------- CART -----------------
  getCart(): any[] {
    return JSON.parse(localStorage.getItem(this.guestCartKey) || "[]");
  }

  addToCart(item: any): void {
    const cart = this.getCart();
    const existing = cart.find((x) => x.dish_id === item.dish_id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem(this.guestCartKey, JSON.stringify(cart));
  }

  removeFromCart(dishId: number): void {
    const cart = this.getCart().filter((x) => x.dish_id !== dishId);
    localStorage.setItem(this.guestCartKey, JSON.stringify(cart));
  }

  clearCart(): void {
    localStorage.removeItem(this.guestCartKey);
  }

  // ❤️ ---------------- FAVORITES ----------------
  getFavorites(): any[] {
    return JSON.parse(localStorage.getItem(this.guestFavKey) || "[]");
  }

  addToFavorites(item: any): void {
    const favs = this.getFavorites();
    const exists = favs.find((x) => x.dish_id === item.dish_id);
    if (!exists) {
      favs.push(item);
      localStorage.setItem(this.guestFavKey, JSON.stringify(favs));
    }
  }

  removeFromFavorites(dishId: number): void {
    const favs = this.getFavorites().filter((x) => x.dish_id !== dishId);
    localStorage.setItem(this.guestFavKey, JSON.stringify(favs));
  }

  clearFavorites(): void {
    localStorage.removeItem(this.guestFavKey);
  }

  /** ✅ FAVORITE Wrappers */
  addFavorite(dish: any): void {
    this.activateGuest();
    this.addToFavorites(dish);
  }

  removeFavorite(dishId: number): void {
    this.removeFromFavorites(dishId);
  }

  // 🧾 ---------------- ORDER INFO ----------------
  saveOrderInfo(orderData: any): void {
    localStorage.setItem(this.guestOrderKey, JSON.stringify(orderData));
  }

  getOrderInfo(): any {
    return JSON.parse(localStorage.getItem(this.guestOrderKey) || "{}");
  }

  clearOrderInfo(): void {
    localStorage.removeItem(this.guestOrderKey);
  }

  /** ✅ CLEAR ALL */
  clearAll(): void {
    localStorage.removeItem(this.guestCartKey);
    localStorage.removeItem(this.guestFavKey);
    localStorage.removeItem(this.guestOrderKey);
  }
}
