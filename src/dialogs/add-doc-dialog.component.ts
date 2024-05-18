import { Component, OnInit, inject } from '@angular/core';
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
import { DocFamily } from '../Models/models';
import { FAMILY_SERVICE } from '../services/servicesTokens';
import { DocFamilyApi } from '../Models/Api';

interface AddDocForm {
  title: FormControl<string | null>;
  versionNumber: FormControl<string | null>;
  authorId: FormControl<number | null>;
  id: FormControl<number | null>;
  docFamilyId: FormControl<number | null>;
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
        <mat-form-field style="width: 100%;" appearance="outline">
          <mat-label>Family</mat-label>
          <mat-select formControlName="docFamilyId">
            @for (family of familyService.getAllRes(); track family.id) {
            <mat-option [value]="family.id">{{ family.title }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="warn" [matDialogClose]="false">
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
  familyService = inject(FAMILY_SERVICE);
  constructor(
    private formBuilder: FormBuilder,
    private local: LocalStorageService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.familyService.getAllSubsciption(DocFamilyApi.getAll());
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
      docFamilyId: this.formBuilder.control<number | null>(
        null,
        Validators.required
      ),
    });
  }
}
