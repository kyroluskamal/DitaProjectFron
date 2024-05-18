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
import { LoaderComponent } from '../Generic components/loader.component';
import { CommonSignalsService } from '../services/common-signals.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    KTableComponent,
    MatButtonModule,
    MatToolbarModule,
    RouterLink,
    LoaderComponent,
  ],
  providers: [GenericService<Documento, Documento>, MatDialog],
  template: `
    @if (!isCurrectRouteLoginIn()) {
    <mat-toolbar
      color="primary"
      class="d-flex flex-row justify-content-between"
    >
      <!-- Application Name -->

      <span class="app-name cursor-pointer" routerLink="/docfamilies"
        >Dita documentos</span
      >

      <!-- Spacer to push the rest to the right -->
      <nav
        class="spacer flex-grow-1 d-flex flex-row justify-content-start margin-x"
      >
        <a mat-button routerLink="/documents">Documentos</a>
        @if(this.AuthService.isAdminOrAnalyst()){
        <a mat-button routerLink="/docfamilies">Families</a>
        }
      </nav>
      <div>
        @if (AuthService.isloggedIn()) {
        <!-- Username and Role -->
        @if (AuthService.currentUser() !== null) {
        <span class="user-info">
          {{ this.AuthService.currentUser().firstName! }}
          {{ this.AuthService.currentUser().lastName! }}
          ({{ this.AuthService.currentUser().roles[0]! }})
        </span>
        <button mat-button (click)="this.AuthService.logout()">Loggout</button>
        } }@else{
        <!-- Login Buttons -->
        <button mat-button routerLink="/login">Login</button>
        }
      </div>
    </mat-toolbar>
    } @if (!isCurrectRouteLoginIn()) {

    <div class="bodyContainer">
      <router-outlet></router-outlet>
    </div>
    }@else{

    <router-outlet></router-outlet>
    }
    <loader [isLoading]="CommponService.loaderLoading()"></loader>
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
  CommponService = inject(CommonSignalsService);
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
