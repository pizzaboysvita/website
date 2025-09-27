import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap, BehaviorSubject } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private authChangedSubject = new BehaviorSubject<void>(undefined);
  authChanged$ = this.authChangedSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: {
    email: string;
    password_hash: string;
  }): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/loginUser?store_id=-1&type=web`, credentials)
      .pipe(
        tap((res: any) => {
          if (res.token) {
            localStorage.setItem("token", res.token);
            if (res.refresh_token) {
              localStorage.setItem("refreshToken", res.refresh_token);
            }
            localStorage.setItem("user", JSON.stringify(res.user));
            this.authChangedSubject.next();
          }
        })
      );
  }

  signup(userData: any, imageFile?: File): Observable<any> {
    const formData = new FormData();
    if (imageFile) formData.append("image", imageFile);
    formData.append("body", JSON.stringify(userData));
    return this.http.post(`${this.apiUrl}/user?store_id=-1&type=web`, formData);
  }

  setToken(token: string) {
    localStorage.setItem("token", token);
    this.authChangedSubject.next();
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    this.authChangedSubject.next();
    // Optionally redirect to login page
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      this.logout();
      throw new Error("No refresh token found");
    }

    return this.http
      .post(`${this.apiUrl}/refreshToken`, { refresh_token: refreshToken })
      .pipe(
        tap((res: any) => {
          if (res.accessToken) {
            localStorage.setItem("token", res.accessToken);
            this.authChangedSubject.next();
          }
          if (res.refresh_token) {
            localStorage.setItem("refreshToken", res.refresh_token);
          }
        })
      );
  }

  updateProfile(payload: { name: string; password: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-profile`, payload);
  }
}
