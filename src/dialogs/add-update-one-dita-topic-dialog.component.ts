import { Component, OnInit, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  DitaTopic,
  DitaTopicModelView,
  DocFamily,
  ModelFormArray,
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
import { EditorModule } from '@tinymce/tinymce-angular';
import { MatIconModule } from '@angular/material/icon';
import { DITATOPIC_SERVICE, ROLE_SERVICE } from '../services/servicesTokens';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DitaTopicsApi } from '../Models/Api';

@Component({
  selector: 'app-add-update-one-dita-topic-dialog',
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
    EditorModule,
    MatIconModule,
    MatDividerModule,
    MatCheckboxModule,
    MatListModule,
  ],
  template: `
    <h2 mat-dialog-title>Family title : {{ family().title }}</h2>
    <div mat-dialog-content>
      <form
        [formGroup]="formGroup"
        style="display: flex; flex-direction: row; gap:10px"
      >
        <mat-form-field class="w-100">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" />
          @if(formGroup.controls.title.hasError('required')){
          <mat-error> Title is required </mat-error>
          }
        </mat-form-field>
        <mat-checkbox formControlName="isRequired"> </mat-checkbox>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-raised-button mat-dialog-close color="warn">Cancel</button>
      <button
        mat-raised-button
        [mat-dialog-close]="formGroup.value"
        color="primary"
      >
        Save
      </button>
    </div>
  `,
  styles: ``,
})
export class AddUpdateOneDitaTopicDialogComponent {
  dialogData: { action: string; family: DocFamily; ditaTopic: DitaTopic } =
    inject(MAT_DIALOG_DATA);
  family = signal<DocFamily>(this.dialogData.family);
  fb = inject(FormBuilder);
  formGroup: ModelFormGroup<
    Pick<DitaTopicModelView, 'title' | 'docFamilyId' | 'id' | 'isRequired'>
  > = this.fb.nonNullable.group({
    id: [0],
    title: ['', Validators.required],
    docFamilyId: [this.dialogData.family.id, Validators.required],
    isRequired: [false],
  });

  ngOnInit(): void {
    this.formGroup.patchValue(this.dialogData.ditaTopic);
  }
}
