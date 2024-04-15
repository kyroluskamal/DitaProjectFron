import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  AppRegisterRequest,
  ApplicationUser,
  LoginRequest,
  LoginResponse,
  SuccessResponse,
  roles,
} from '../Models/models';
import { authApi } from '../Models/Api';
import { LocalStorageService } from './local-storage.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private local: LocalStorageService
  ) {
    if (this.local.getItem('token') && this.local.getItem('token') != '') {
      this.isloggedIn.set(true);
    } else {
      this.isloggedIn.set(false);
    }
  }
  isloggedIn = signal(false);
  allusers = signal<ApplicationUser[]>([]);
  currentUser = signal<ApplicationUser>({} as ApplicationUser);
  isAdminOrAnalyst = signal(false);
  isDeveloper = signal(false);
  isTechnician = signal(false);
  login(LoginRequest: LoginRequest) {
    forkJoin([
      this.http.post<LoginResponse>(authApi.login(), LoginRequest),
      this.http.get<SuccessResponse>(
        authApi.getUserByEmail(LoginRequest.email)
      ),
      this.http.get<SuccessResponse>(
        authApi.getRoleByEmail(LoginRequest.email)
      ),
    ]).subscribe({
      next: ([tokens, user, role]) => {
        this.local.setItem('token', tokens.accessToken);
        this.isloggedIn.set(true);
        user.data.roles = role.data;
        this.currentUser.set(user.data as ApplicationUser);
        this.validateRole(role.data[0]);
        this.local.setItem('user', JSON.stringify(user.data));
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isloggedIn.set(false);
      },
    });
  }

  logout() {
    this.local.removeItem('token');
    this.local.removeItem('user');
    this.isloggedIn.set(false);
    this.router.navigate(['']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  createUser(user: AppRegisterRequest) {
    this.http.post<any>(authApi.register(), user).subscribe({
      next: (response) => {
        this.allusers.update((users) => [...users, response.data]);
      },
    });
  }

  public validateRole(role: string) {
    switch (role) {
      case roles.Admin:
      case roles.Analyst:
        this.isAdminOrAnalyst.set(true);
        break;
      case roles.Developer:
        this.isDeveloper.set(true);
        break;
      case roles.Technician:
        this.isTechnician.set(true);
        break;
      default:
        break;
    }
  }
}
