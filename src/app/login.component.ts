import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MyErrorStateMatcher } from '../services/MyErrorStateMatcher';
import { LocalStorageService } from '../services/local-storage.service';
import { CommonSignalsService } from '../services/common-signals.service';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  providers: [],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterLink,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Login</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="loginForm">
          <mat-form-field appearance="fill">
            <mat-label>Email</mat-label>
            <input
              [errorStateMatcher]="errorStateMatcher"
              matInput
              formControlName="email"
              placeholder="Enter your email"
            />
            @if (loginForm.controls.email.hasError('required')) {
            <mat-error> Email is required </mat-error>
            } @if (loginForm.controls.email.hasError('email')) {
            <mat-error> Enter a valid email address </mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Password</mat-label>
            <input
              matInput
              type="password"
              formControlName="password"
              placeholder="Enter your password"
              [errorStateMatcher]="errorStateMatcher"
            />
            @if (loginForm.controls.password.hasError('required')) {
            <mat-error> Password is required </mat-error>
            } @if (loginForm.controls.password.hasError('minlength')) {
            <mat-error> Password must be at least 6 characters long </mat-error>
            }
          </mat-form-field>
        </form>
      </mat-card-content>
      <mat-card-actions align="end">
        <button
          [disabled]="loginForm.invalid"
          mat-raised-button
          (click)="onSubmit()"
          color="primary"
        >
          Login
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  host: { class: 'd-block container dot-pattern' },
  styles: `

  :host mat-card {
    width: 300px;
    margin: auto;
    background: rgba(255, 255, 255, 0.9); /* Slightly transparent to blend with background */
  }

  :host mat-form-field {
    width: 100%;
  }`,
})
export class LoginComponent implements OnInit {
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  errorStateMatcher = new MyErrorStateMatcher();
  commonSignals = inject(CommonSignalsService);
  local = inject(LocalStorageService);
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    if (this.authService.isloggedIn()) {
      this.authService.currentUser.set(JSON.parse(this.local.getItem('user')));
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['login']);
    }
  }
  AuthService = inject(AuthService);
  onSubmit() {
    if (this.loginForm.valid) {
      this.AuthService.login({
        email: this.loginForm.value.email as string,
        password: this.loginForm.value.password as string,
      });
    }
  }
}
