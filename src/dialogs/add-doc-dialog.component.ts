import { Component, OnInit } from '@angular/core';
import {
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

interface AddDocForm {
  title: FormControl<string | null>;
  versionNumber: FormControl<string | null>;
  authorId: FormControl<number | null>;
  id: FormControl<number | null>;
}
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
    <h2 mat-dialog-title>Add new document</h2>
    <mat-dialog-content class="mat-typography d-colums">
      <form [formGroup]="documentForm!" class="d-column">
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput placeholder="Title" formControlName="title" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Version number</mat-label>
          <input
            matInput
            placeholder="Version number"
            formControlName="versionNumber"
          />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="warn" [matDialogClose]="true">
        Cancel
      </button>
      <button
        [disabled]="documentForm?.invalid"
        mat-raised-button
        color="primary"
        [matDialogClose]="documentForm?.value"
        cdkFocusInitial
      >
        Add
      </button>
    </mat-dialog-actions>
  `,
  styles: [],
})
export class AddDocDialogComponent implements OnInit {
  documentForm: FormGroup | null = null;
  matcher = new MyErrorStateMatcher();
  constructor(
    private formBuilder: FormBuilder,
    private local: LocalStorageService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.documentForm = this.formBuilder.nonNullable.group<AddDocForm>({
      title: this.formBuilder.control<string | null>(null, Validators.required),
      versionNumber: this.formBuilder.control<string | null>(
        null,
        Validators.required
      ),
      authorId: this.formBuilder.control<number | null>(
        this.authService.currentUser().id
      ),
      id: this.formBuilder.control<number | null>(0),
    });
  }
}
