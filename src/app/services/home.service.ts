import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { AuthService } from "./auth.service";
@Injectable({
  providedIn: "root",
})
export class HomeService {
  private baseurl = "http://78.142.47.247:3003/api/";


  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(contentType: boolean = true): { headers: HttpHeaders } {
    const token = this.authService.getToken(); 
    if (!token) {
      console.error(" No token found.");
      return { headers: new HttpHeaders() };
    }

    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    if (contentType) {
      headers = headers.set("Content-Type", "application/json");
    }

    return { headers };
  }
  getCategories(): Observable<any> {
    const params = new HttpParams().set("store_id", "-1").set("type", "web");
    return this.http.get(`${this.baseurl}category`, { params });
  }
  getDishes(): Observable<any> {
    const params = new HttpParams().set("store_id", "-1").set("type", "web");
    return this.http.get(`${this.baseurl}dish` ,{ params });
  }
  addwhishlist(body: any): Observable<any> {
    return this.http.post(`${this.baseurl}wishlist`, body, this.getHeaders());
  }
  getWishlist(userId: number): Observable<any> {
    const params = new HttpParams().set("user_id", userId.toString());
    return this.http.get<any>(`${this.baseurl}wishlist`, { ...this.getHeaders(false), params });
  }
  getOrders(): Observable<any> {
    const params = new HttpParams()
      .set("store_id", "-1")
      .set("type", "web");

    return this.http.get(`${this.baseurl}order`, { ...this.getHeaders(false), params });
  }

  addOrder(order: any): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      console.error(" No token found. Please log in.");
      return throwError(() => new Error("Not logged in"));
    }

    return this.http.post(`${this.baseurl}order`, order, this.getHeaders());
  }
  getstores(): Observable<any> {
    const params = new HttpParams().set("type", "web");
    return this.http.get(`${this.baseurl}store`, {
      ...this.getHeaders(false),
      params,
    });
  }}


