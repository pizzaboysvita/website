// src/app/core/services/home.service.ts
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { StoreService } from "./store.service";

@Injectable({
  providedIn: "root",
})
export class HomeService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private storeService: StoreService) {}

  // 🔹 Utility to get current storeId (defaults to -1)
  private getStoreId(): string {
    return this.storeService.getSelectedStoreId().toString();
  }

  getCategories(): Observable<any> {
    const params = new HttpParams()
      .set("store_id", this.getStoreId())
      .set("type", "web");
    return this.http.get(`${this.baseUrl}/category`, { params });
  }

  getDishes(): Observable<any> {
    const params = new HttpParams()
      .set("store_id", this.getStoreId())
      .set("type", "web");
    return this.http.get(`${this.baseUrl}/dish`, { params });
  }

  addWishlist(body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/wishlist`, body);
  }

  getWishlist(userId: number): Observable<any> {
    const params = new HttpParams().set("user_id", userId.toString());
    return this.http.get(`${this.baseUrl}/wishlist`, { params });
  }

  getOrders(userId: number): Observable<any> {
    const params = new HttpParams()
      .set("user_id", userId.toString())
      .set("store_id", this.getStoreId())
      .set("type", "web");
    return this.http.get(`${this.baseUrl}/order`, { params });
  }

  getOrderById(orderId: number, type: string = "web"): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/order?order_id=${orderId}&type=${type}`
    );
  }

  addOrder(order: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/order`, order);
  }

  getStores(): Observable<any> {
    const params = new HttpParams().set("type", "web");
    return this.http.get(`${this.baseUrl}/store`, { params });
  }
    getBanners() {
      const params = new HttpParams()
      .set("store_id", this.getStoreId())
      // .set("user_id", '-1')
      .set("type", "web");
       return this.http.get(`${this.baseUrl}/banner`, { params });
      //     return this.http.get(
      // `${this.baseUrl}/banner?user_id=${userId}&type=${type}`
    // );
    
  }
}
