import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
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
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="fill">
            <mat-label>Email</mat-label>
            <input
              matInput
              formControlName="email"
              placeholder="Enter your email"
            />
            @if (loginForm.controls.email.hasError('required')) {
            <mat-error> Email is required </mat-error>
            } @if (loginForm.controls.email.hasError('email')) {
            <mat-error *ngIf="registerForm?.controls.email.hasError('email')">
              Enter a valid email address
            </mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>Password</mat-label>
            <input
              matInput
              type="password"
              formControlName="password"
              placeholder="Enter your password"
            />
            @if (loginForm.controls.password.hasError('required')) {
            <mat-error> Password is required </mat-error>
            } @if (loginForm.controls.password.hasError('minlength')) {
            <mat-error
              *ngIf="registerForm?.controls.password.hasError('minlength')"
            >
              Password must be at least 6 characters long
            </mat-error>
            }
          </mat-form-field>
        </form>
      </mat-card-content>
      <mat-card-actions align="end">
        <button mat-raised-button color="primary">Login</button>
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
export class LoginComponent {
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder) {}

  onSubmit() {
    if (this.loginForm.valid) {
      // Perform login logic here
    }
  }
}
