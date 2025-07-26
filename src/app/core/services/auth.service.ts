import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  user: string; // id
  rut: string;
  role: string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string = 'https://api-hyosei.up.railway.app/api';

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();

    if (token) {
      const userId = this.getUserIdFromToken(token);
      if (userId) {
        this.fetchUser(userId);
      }
    }
  }

  login(identifier: string, password: string) {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, { identifier, password })
      .subscribe({
        next: (res) => {
          this.handleAuthToken(res.token);
          this.router.navigate(['/dashboard']); // ejemplo redirección post-login
        },
        error: (err) => {
          console.error('Login error:', err);
        },
      });
  }

  signup(name: string, rut: string, password: string) {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/signup`, { name, rut, password })
      .subscribe({
        next: (res) => {
          this.handleAuthToken(res.token);
          this.router.navigate(['/dashboard']); // ejemplo redirección post-signup
        },
        error: (err) => {
          console.error('Signup error:', err);
        },
      });
  }

  private handleAuthToken(token: string) {
    this.setToken(token);
    const userId = this.getUserIdFromToken(token);
    if (userId) {
      this.fetchUser(userId);
    }
  }

  private fetchUser(userId: string) {
    const token = this.getToken();
    if (!token) {
      this.userSubject.next(null);
      return;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<User>(`${this.apiUrl}/${userId}`, { headers }).subscribe({
      next: (user) => {
        this.userSubject.next(user);
        this.setUser(user);
      },
      error: (err) => {
        console.error('Fetch user error:', err);
        this.logout();
      },
    });
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  // --- LocalStorage getters/setters ---

  private setToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setUser(user: User) {
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  getUser(): User | null {
    const userJson = localStorage.getItem('auth_user');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  private getUserIdFromToken(token: string): string | null {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.user || null;
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }
}
