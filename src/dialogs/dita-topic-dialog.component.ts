import { Component, OnInit, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  DitaTopicModelView,
  DitaTopicType,
  Documento,
  ModelFormGroup,
  StepViewModel,
} from '../Models/models';
import {
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormField, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { MatIconModule } from '@angular/material/icon';

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
  ],
  template: `
    <h2 mat-dialog-title>Doc title : {{ doc().title }}</h2>
    <div mat-dialog-content>
      <form [formGroup]="dtForm">
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput placeholder="Title" formControlName="title" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Short Description</mat-label>
          <input
            matInput
            placeholder="Title"
            formControlName="shortDescription"
          />
        </mat-form-field>
        <mat-select
          formControlName="type"
          placeholder="Select dita topic type"
          (selectionChange)="generateForm($event.value)"
        >
          <mat-option [value]="0">Concept</mat-option>
          <mat-option [value]="1">Task</mat-option>
        </mat-select>
        @if(dtForm.controls.type.value == 0){
        <editor
          formControlName="body"
          apiKey="zatrg4uyib70ow8kikmjibb5ufv6sgc3cxp3aksbnhe4h5ir"
          [init]="{
            height: 500,
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ],
            toolbar:
              'undo redo | formatselect | bold italic backcolor |        alignleft aligncenter alignright alignjustify |        bullist numlist outdent indent | removeformat | help'
          }"
        ></editor>
        <!-- <mat-form-field appearance="outline">
          <mat-label>Body</mat-label>
          <textarea matInput placeholder="Body" formControlName="body">
          </textarea>
        </mat-form-field> -->
        }@else{
        <ng-container formArrayName="steps">
          <button mat-icon-button color="warn" (click)="addStep()">
            <mat-icon fontIcon="add"></mat-icon>
          </button>
          @for(step of steps.controls; track step; let i = $index){
          <form
            [formGroup]="step"
            style="display: flex; flex-direction: row; gap:10px"
          >
            <mat-form-field appearance="outline" style="flex-grow:1">
              <mat-label>Command</mat-label>
              <input matInput placeholder="Command" formControlName="command" />
            </mat-form-field>
            <mat-form-field appearance="outline" style="width:10%">
              <mat-label>Order</mat-label>
              <input matInput placeholder="order" formControlName="order" />
            </mat-form-field>
            <button mat-icon-button color="warn" (click)="deleteStep(i)">
              <mat-icon fontIcon="delete"></mat-icon>
            </button>
          </form>
          }
        </ng-container>

        }
      </form>
    </div>
  `,
  styles: ``,
})
export class DitaTopicDialogComponent {
  dtForm: ModelFormGroup<
    Pick<
      DitaTopicModelView,
      | 'steps'
      | 'body'
      | 'id'
      | 'shortDescription'
      | 'documentId'
      | 'type'
      | 'title'
    >
  > = this.fb.nonNullable.group({
    steps: this.fb.nonNullable.array<ModelFormGroup<StepViewModel>>([]),
    body: ['', [Validators.required]],
    id: [0],
    shortDescription: [''],
    documentId: [0],
    type: [0],
    title: ['', [Validators.required]],
  });
  dialogRef = inject(MatDialogRef<DitaTopicDialogComponent>);
  dialogData = inject(MAT_DIALOG_DATA);
  ditaTopicSeletectType = 0;
  constructor(private fb: FormBuilder) {}
  doc = signal<Documento>(this.dialogData.doc);
  get steps() {
    return this.dtForm.controls.steps as FormArray<
      ModelFormGroup<StepViewModel>
    >;
  }
  addStep() {
    this.steps.push(
      this.fb.nonNullable.group({
        command: ['', [Validators.required]],
        order: [0],
        id: [0],
        taskId: [0],
      })
    );
  }
  generateForm(ditatopicType: number) {
    if (ditatopicType == DitaTopicType.Concept) {
      this.ditaTopicSeletectType = DitaTopicType.Concept;
      this.dtForm.controls.body.addValidators(Validators.required);
      this.dtForm.controls.steps.clearValidators();
    } else if (ditatopicType == DitaTopicType.Task) {
      this.ditaTopicSeletectType = DitaTopicType.Task;
      this.dtForm.controls.steps.addValidators(Validators.required);
      this.dtForm.controls.body.clearValidators();
      this.addStep();
    }
  }
  deleteStep(index: number) {
    this.steps.removeAt(index);
  }
}
