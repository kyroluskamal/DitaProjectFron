import { Component, OnInit, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
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
import { DITATOPIC_SERVICE } from '../services/servicesTokens';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DitaTopicsApi } from '../Models/Api';
@Component({
  selector: 'app-dita-topic-dialog',
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
      <button mat-icon-button color="primary" (click)="addDt()">
        <mat-icon fontIcon="add_circle"></mat-icon>
      </button>
      <form [formGroup]="form">
        <ng-container formArrayName="dtForm">
          @for (item of form.controls.dtForm.controls; track item; let i =
          $index) {
          <form
            [formGroup]="item"
            style="display: flex; flex-direction: row; gap:10px"
          >
            <mat-form-field class="w-100">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" />
              @if(item.controls.title.hasError('required')){
              <mat-error> Title is required </mat-error>
              }
            </mat-form-field>
            <mat-checkbox formControlName="isRequired"> </mat-checkbox>
            <button mat-icon-button color="warn" (click)="deleteDt(i)">
              <mat-icon fontIcon="delete"></mat-icon>
            </button>
          </form>
          }
        </ng-container>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-raised-button mat-dialog-close color="warn">Cancel</button>
      <button
        mat-raised-button
        [mat-dialog-close]="dtForm.value"
        color="primary"
      >
        Save
      </button>
    </div>
  `,
  styles: ``,
})
export class FamilyDitaTopicDialogComponent implements OnInit {
  dialogData: { action: string; family: DocFamily } = inject(MAT_DIALOG_DATA);
  family = signal<DocFamily>({} as DocFamily);
  ditaTopicService = inject(DITATOPIC_SERVICE);

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    if (this.dialogData.action == 'edit') this.dtForm.clear();
    this.dialogData.family.ditaTopics.forEach((dt) => {
      this.dtForm.push(this.getFormGroup());
    });
    this.dtForm.patchValue(this.dialogData.family.ditaTopics);
    console.log(this.dtForm.value);
  }

  dtForm: ModelFormArray<
    Pick<DitaTopicModelView, 'title' | 'docFamilyId' | 'id' | 'isRequired'>
  > = this.fb.nonNullable.array([this.getFormGroup()]);

  form = this.fb.group({
    dtForm: this.dtForm,
  });

  deleteDt(index: number): void {
    if (this.dialogData.action == 'edit') {
      this.ditaTopicService.Delete(
        DitaTopicsApi.delete(this.dtForm.at(index).value.id!),
        () => {
          this.dtForm.removeAt(index);
        }
      );
    } else this.dtForm.removeAt(index);
  }

  getFormGroup() {
    let formGroup: ModelFormGroup<
      Pick<DitaTopicModelView, 'title' | 'docFamilyId' | 'id' | 'isRequired'>
    > = this.fb.nonNullable.group({
      id: [0],
      title: ['', Validators.required],
      docFamilyId: [this.dialogData.family.id, Validators.required],
      isRequired: [false],
    });
    return formGroup;
  }

  addDt() {
    this.dtForm.push(this.getFormGroup());
  }
}
