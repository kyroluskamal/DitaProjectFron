import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private _snackBar: MatSnackBar) {}

  sucess(message: string, action: string) {
    this._snackBar.open(message, action, {
      panelClass: ['success'],
    });
  }

  error(message: string, action: string) {
    this._snackBar.open(message, action, {
      panelClass: ['error'],
    });
  }

  warning(message: string, action: string) {
    this._snackBar.open(message, action, {
      panelClass: ['warning'],
    });
  }
}
