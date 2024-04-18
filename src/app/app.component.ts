import { Component, inject, signal } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { KTableComponent } from '../Generic components/k-table.component';
import { ApplicationUser, Documento } from '../Models/models';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GenericService } from '../services/generic.service';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    KTableComponent,
    MatButtonModule,
    MatToolbarModule,
    RouterLink,
  ],
  providers: [GenericService<Documento, Documento>, MatDialog],
  template: `
    @if (!isCurrectRouteLoginIn()) {
    <mat-toolbar color="primary">
      <!-- Application Name -->
      <span class="app-name">My Application</span>

      <!-- Spacer to push the rest to the right -->

      <span class="toolbar-spacer"></span>

      @if (AuthService.isloggedIn()) {
      <!-- Username and Role -->
      @if (AuthService.currentUser() !== null) {
      <span class="user-info">
        {{ this.AuthService.currentUser()?.firstName! }}
        {{ this.AuthService.currentUser()?.lastName! }}
        ({{ this.AuthService.currentUser().roles[0]! }})
      </span>
      } }@else{
      <!-- Login Buttons -->
      <button mat-button routerLink="/login">Login</button>
      }
    </mat-toolbar>
    } @if (!isCurrectRouteLoginIn()) {

    <div class="bodyContainer">
      <router-outlet></router-outlet>
    </div>
    }@else{

    <router-outlet></router-outlet>
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class AppComponent {
  title = 'DitaTopic';
  local = inject(LocalStorageService);
  AuthService = inject(AuthService);
  isCurrectRouteLoginIn = signal(false);
  constructor(private router: Router) {
    this.router.events.subscribe((val) => {
      // see also
      if (val instanceof NavigationEnd) {
        this.isCurrectRouteLoginIn.set(val.url === '/login');
      }
    });
  }
  ngOnInit() {
    if (!this.local.getItem('token')) {
      this.AuthService.logout();
    } else {
      this.AuthService.isloggedIn.set(true);
      this.AuthService.currentUser.set(
        JSON.parse(this.local.getItem('user')) as ApplicationUser
      );
      if (this.AuthService.currentUser().roles[0])
        this.AuthService.validateRole(this.AuthService.currentUser().roles[0]);
    }
  }
}
