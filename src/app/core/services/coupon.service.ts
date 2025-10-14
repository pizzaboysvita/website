import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { StoreService } from "./store.service";

@Injectable({
  providedIn: "root",
})
export class CouponService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private storeService: StoreService) {}

  private showCouponModalSubject = new BehaviorSubject<boolean>(false);
  showCouponModal$ = this.showCouponModalSubject.asObservable();

  private getStoreId(): string {
    return this.storeService.getSelectedStoreId().toString();
  }

  getCoupons(): Observable<any> {
    const params = new HttpParams().set("store_id", this.getStoreId());
    return this.http.get(`${this.baseUrl}/promocode`, { params });
  }

  openCouponModal() {
    this.showCouponModalSubject.next(true);
  }

  closeCouponModal() {
    this.showCouponModalSubject.next(false);
  }
}
