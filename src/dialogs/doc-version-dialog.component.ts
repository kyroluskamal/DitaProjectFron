import { Component, OnInit, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DocVersion, Documento } from '../Models/models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TitleCasePipe } from '@angular/common';
@Component({
  selector: 'app-doc-version-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
    MatDialogClose,
    MatInputModule,
    TitleCasePipe,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ this.action() | titlecase }} version for
      {{ this.doc().title }}
    </h2>
    <div mat-dialog-content>
      <form [formGroup]="formGroup">
        <mat-form-field class="w-100">
          <mat-label>Version Number</mat-label>
          <input matInput formControlName="versionNumber" />
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-raised-button mat-dialog-close color="warn">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        [mat-dialog-close]="formGroup.value"
      >
        Save
      </button>
    </div>
  `,
  styles: ``,
})
export class DocVersionDialogComponent implements OnInit {
  dialogData = inject(MAT_DIALOG_DATA);

  action = signal<string>('');
  doc = signal<Documento>({} as Documento);
  version = signal<DocVersion>({} as DocVersion);
  constructor() {
    this.action.set(this.dialogData.action);
    this.doc.set(this.dialogData.doc);
    this.version.set(this.dialogData.version);
  }
  ngOnInit(): void {
    if (this.action() === 'edit') {
      this.formGroup.patchValue(this.version());
    }
  }
  fb = inject(FormBuilder);

  formGroup = this.fb.group({
    versionNumber: ['', Validators.required],
    documentId: [this.dialogData.doc.id],
  });
}
