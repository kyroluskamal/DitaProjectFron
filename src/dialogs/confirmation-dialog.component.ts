import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MatDialogActions,
  MatDialogTitle,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
    MatDialogClose,
  ],
  template: `
    <h1 mat-dialog-title>Are you sure?</h1>
    <div mat-dialog-content>
      <p>Are you sure you want to delete ?</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-raised-button color="warn" [mat-dialog-close]="false">
        No
      </button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true">
        Yes
      </button>
    </div>
  `,
  styles: ``,
})
export class ConfirmationDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>) {}
}
