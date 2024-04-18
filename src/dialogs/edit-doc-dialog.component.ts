import { Component, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  DocumentUpdateViewModel,
  Documento,
  ModelFormGroup,
} from '../Models/models';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-doc-version-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    MatDialogClose,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title>
      Eidt:
      {{ this.doc().title }}
    </h2>
    <div mat-dialog-content>
      <form [formGroup]="formGroup">
        <mat-form-field class="w-100">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" />
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
export class EditDocDialogComponent {
  dialogData = inject(MAT_DIALOG_DATA);

  action = signal<string>('');
  doc = signal<Documento>({} as Documento);
  constructor() {
    this.doc.set(this.dialogData.doc);
  }

  fb = inject(FormBuilder);
  ngOnInit() {
    this.formGroup.patchValue(this.doc());
  }
  formGroup: ModelFormGroup<DocumentUpdateViewModel> = this.fb.group({
    title: [this.doc().title, Validators.required],
  });
}
