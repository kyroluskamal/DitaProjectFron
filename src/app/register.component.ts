import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    RouterLink,
  ],
  template: `<mat-card>
    <form [formGroup]="registerForm" (ngSubmit)="register()">
      <mat-card-header>
        <mat-card-title>Register</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input
            matInput
            formControlName="email"
            placeholder="Enter your email"
          />
          @if(registerForm.controls.email.hasError('required')) {
          <mat-error> Email is required </mat-error>
          } @if(registerForm.controls.email.hasError('email')) {
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
          />

          @if(registerForm.controls.password.hasError('required')) {
          <mat-error> Password is required </mat-error>
          } @if(registerForm.controls.password.hasError('minlength')) {
          <mat-error> Password must be at least 6 characters long </mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>First Name</mat-label>
          <input
            matInput
            formControlName="firstName"
            placeholder="Enter your first name"
          />
          @if(registerForm.controls.firstName.hasError('required')) {
          <mat-error> First name is required </mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Last Name</mat-label>
          <input
            matInput
            formControlName="lastName"
            placeholder="Enter your last name"
          />
          @if(registerForm.controls.lastName.hasError('required')) {
          <mat-error> Last name is required </mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role">
            <mat-option value="user">User</mat-option>
            <mat-option value="admin">Admin</mat-option>
          </mat-select>

          @if(registerForm.controls.role.hasError('required')) {
          <mat-error> Role is required </mat-error>
          }
        </mat-form-field>
      </mat-card-content>
      <mat-card-actions align="end">
        <button mat-raised-button color="primary" type="submit">
          Register
        </button>
      </mat-card-actions>
      <mat-card-actions>
        <p>Have an account? <a routerLink="/login">Login</a></p>
      </mat-card-actions>
    </form>
  </mat-card>`,
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
export class RegisterComponent {
  registerForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    role: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder) {}

  // Method to handle the registration form submission
  register() {
    if (this.registerForm.valid) {
      // Handle registration logic here, e.g., call a service
    }
  }
}
