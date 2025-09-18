import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class HomeService {
  private categoryUrl = "http://78.142.47.247:3003/api/category";
  private dishUrl = "http://78.142.47.247:3003/api/dish";
  private apiUrl = "http://78.142.47.247:3003/api/wishlist";
  private apiorder = "http://78.142.47.247:3003/api/";
  private storeUrl = "http://78.142.47.247:3003/api/store";




  constructor(private http: HttpClient) { }


  getCategories(): Observable<any> {
    const params = new HttpParams().set("store_id", "-1").set("type", "web");
    return this.http.get(this.categoryUrl, { params: params });
  }
  getDishes(): Observable<any> {
    const params = new HttpParams().set("store_id", "-1").set("type", "web");
    return this.http.get(this.dishUrl, { params: params });
  }
  //addwhishlist
  addwhishlist(body: any): Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    return this.http.post(`${this.apiUrl}`, body, { headers });
  }
  //get wishlist
  getWishlist(userId: number): Observable<any> {
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const params = new HttpParams().set('user_id', userId.toString());

    return this.http.get<any>(this.apiUrl, { headers, params });
  }
   // get all order
  getOrders(): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const params = new HttpParams()

      .set('store_id', '-1')
      .set('type', 'web');

    return this.http.get(`${this.apiorder}order`, { params, headers });
  }
  // addorder
  addOrder(order: any): Observable<any> {
  const token = localStorage.getItem("token"); // 👈 check if token exists

  if (!token) {
    console.error("⚠️ No token found in localStorage. Please login first.");
    return throwError(() => new Error("Not logged in"));
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,  // 👈 send token here
    "Content-Type": "application/json"
  });

  return this.http.post(`${this.apiorder}order`, order, { headers });
}

getstores(): Observable<any> {
  const params = new HttpParams().set("type", "web");
  return this.http.get(this.storeUrl, { params: params });
}



}


