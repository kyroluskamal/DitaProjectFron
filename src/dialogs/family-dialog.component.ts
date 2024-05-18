import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MyErrorStateMatcher } from '../services/MyErrorStateMatcher';
import { MatInputModule } from '@angular/material/input';
import { LocalStorageService } from '../services/local-storage.service';
import { AuthService } from '../services/auth.service';
import {
  DocFamily,
  DocFamilyViewModel,
  ModelFormGroup,
} from '../Models/models';

@Component({
  selector: 'app-add-doc-dialog',
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
    <h2 mat-dialog-title>Add new document Family</h2>
    <mat-dialog-content class="mat-typography d-colums">
      <form [formGroup]="familyForm" class="d-column">
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput placeholder="Title" formControlName="title" />
          @if(familyForm.controls.title.hasError('required')){
          <mat-error> Title is required </mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea
            matInput
            placeholder="Description"
            formControlName="description"
          >
          </textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="warn" [matDialogClose]="true">
        Cancel
      </button>
      <button
        [disabled]="familyForm.invalid"
        mat-raised-button
        color="primary"
        [matDialogClose]="familyForm.value"
        cdkFocusInitial
      >
        @if(data.family) { Add } @else { Save }
      </button>
    </mat-dialog-actions>
  `,
  styles: [],
})
export class FamilyDialogComponent {
  familyForm: ModelFormGroup<
    Pick<DocFamilyViewModel, 'id' | 'description' | 'title'>
  > = this.formBuilder.nonNullable.group({
    id: [0],
    title: ['', Validators.required],
    description: [''],
  });
  constructor(
    private formBuilder: FormBuilder,
    private local: LocalStorageService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA)
    public data: { family: DocFamilyViewModel | DocFamily | null }
  ) {}

  ngOnInit(): void {
    if (this.data.family !== null) {
      this.familyForm.patchValue(this.data.family);
    }
  }
}
