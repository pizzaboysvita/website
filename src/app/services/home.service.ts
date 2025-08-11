import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HomeService {
  private categoryUrl = "http://78.142.47.247:3003/api/category";
  private dishUrl = "http://78.142.47.247:3003/api/dish";

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    const params = new HttpParams().set("user_id", "1").set("type", "web");

    return this.http.get(this.categoryUrl, { params: params });
  }

  getDishes(): Observable<any> {
    const params = new HttpParams().set("user_id", "1").set("type", "web");

    return this.http.get(this.dishUrl, { params: params });
  }
}
