import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, tap } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://78.142.47.247:3003/api";
  constructor(private http: HttpClient) {}
  login(credentials: {
    email: string;
    password_hash: string;
  }): Observable<any> {
    console.log("credentioals", credentials);
    return this.http.post(
      `${this.apiUrl}/loginUser?store_id=-1&type=web`,
      credentials
    );
  }
  signup(userData: any, imageFile?: File): Observable<any> {
    const formData = new FormData();
    if (imageFile) {
      formData.append("image", imageFile);
    }
    formData.append("body", JSON.stringify(userData));
    return this.http.post(`${this.apiUrl}/user?store_id=-1&type=web`, formData);
  }
  setToken(token: string) {
    localStorage.setItem("token", token);
  }
  getToken(): string | null {
    return localStorage.getItem("token");
  }
  logout() {
    localStorage.removeItem("token");
  }
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('Refresh token not available');
    return this.http.post(`${this.apiUrl}refreshToken`, { token: refreshToken })
      .pipe(
        tap((res: any) => {
          if (res.accessToken) {
            localStorage.setItem('accessToken', res.accessToken);
            console.log('Access token refreshed');
          } else {
            console.warn('Failed to refresh token', res);
          }
        })
      );
}}
