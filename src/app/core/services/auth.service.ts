import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, tap } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  // reactive current user (null when not logged)
  private currentUserSubject = new BehaviorSubject<any>(this.getUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Login — tolerant to different token property names from backend.
   * Expects backend to return an object containing user and some token.
   */
  login(credentials: { email: string; password_hash: string }): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/loginUser?store_id=-1&type=web`, credentials)
      .pipe(
        tap((res: any) => {
          // Accept multiple token names used by different backends
          const token =
            res?.token || res?.access_token || res?.accessToken || res?.data?.token || null;

          if (token) {
            localStorage.setItem("token", token);
            if (res?.refresh_token) {
              localStorage.setItem("refreshToken", res.refresh_token);
            } else if (res?.data?.refresh_token) {
              localStorage.setItem("refreshToken", res.data.refresh_token);
            }
          }

          // Accept different user payload shapes
          const user = res?.user || res?.data?.user || res?.data || null;
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            this.currentUserSubject.next(user);
          } else if (token) {
            // token present but user not returned — still trigger update so components re-check localStorage
            this.currentUserSubject.next(this.getUser());
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
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  getUser(): any {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    this.currentUserSubject.next(null);
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
          const access = res?.accessToken || res?.access_token || res?.token;
          if (access) {
            localStorage.setItem("token", access);
            // notify others if needed (user likely unchanged)
            this.currentUserSubject.next(this.getUser());
          }
          if (res?.refresh_token) {
            localStorage.setItem("refreshToken", res.refresh_token);
          }
        })
      );
  }

  updateProfile(payload: { name: string; password: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-profile`, payload);
  }
}
