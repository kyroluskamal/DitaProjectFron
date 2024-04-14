import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment.development';
import { Router } from '@angular/router';
import { AppRegisterRequest, ApplicationUser } from '../Models/models';
import { authApi } from '../Models/Api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private htpp: HttpClient, private router: Router) {}
  isloggedIn = signal(false);
  allusers = signal<ApplicationUser[]>([]);
  login(username: string, password: string) {
    this.htpp
      .post<any>(authApi.login(), {
        username,
        password,
      })
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.isloggedIn.set(true);
          this.router.navigate(['/documents']);
        },
        error: (error) => {
          this.isloggedIn.set(false);
        },
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.isloggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  createUser(user: AppRegisterRequest) {
    this.htpp.post<any>(authApi.register(), user).subscribe({
      next: (response) => {
        this.allusers.update((users) => [...users, response.data]);
      },
    });
  }
}
