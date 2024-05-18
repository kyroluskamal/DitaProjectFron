import { Component, OnInit, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  DitaTopic,
  DitaTopicType,
  DitaTopicVersionViewModel,
  DitatopicVersion,
  ModelFormGroup,
  Step,
  StepViewModel,
} from '../Models/models';
import {
  FormArray,
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
import { ROLE_SERVICE } from '../services/servicesTokens';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { JsonPipe } from '@angular/common';
import { authApi } from '../Models/Api';

@Component({
  selector: 'app-add-dita-topic-version',
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
    MatListModule,
    JsonPipe,
  ],
  template: `
    <h2 mat-dialog-title>
      {{
        dialogData.action == 'edit'
          ? ditaTopicVersion().type == 0
            ? 'Concept'
            : 'Task'
          : 'Dita Topic'
      }}
      title :
      {{ ditatTopic().title }}
    </h2>
    <div mat-dialog-content>
      <form [formGroup]="dtForm">
        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Version Number</mat-label>
          <input
            matInput
            placeholder="Version Number"
            formControlName="versionNumber"
          />
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Short Description</mat-label>
          <input
            matInput
            placeholder="Short description"
            formControlName="shortDescription"
          />
        </mat-form-field>
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Type</mat-label>
          <mat-select
            formControlName="type"
            (selectionChange)="generateForm($event.value)"
          >
            <mat-option [value]="0">Concept</mat-option>
            <mat-option [value]="1">Task</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field style="width: 100%;" appearance="outline">
          <mat-label>Users</mat-label>
          <mat-select formControlName="roles" multiple>
            @for (role of roleService.getAllRes(); track role.id) {
            <mat-option [value]="role.id">{{ role.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <br />
        @if(dtForm.controls.type.value == 0){
        <mat-label>Body</mat-label>
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
        }@else if(dtForm.controls.type.value == 1){
        <ng-container formArrayName="steps">
          <mat-label>Steps</mat-label>
          <br />
          <button mat-icon-button color="primary" (click)="addStep()">
            <mat-icon fontIcon="add_circle"></mat-icon>
          </button>
          <button mat-icon-button color="primary" (click)="reorderSteps()">
            <mat-icon fontIcon="reorder"></mat-icon>
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
    <div mat-dialog-actions align="end">
      <button mat-raised-button mat-dialog-close color="warn">Cancel</button>
      <button mat-raised-button (click)="sendData()" color="primary">
        Save
      </button>
    </div>
  `,
  styles: ``,
})
export class DitaTopicVersionComponent implements OnInit {
  dialogData: { action: 'edit' | 'add' | 'view'; dt: DitaTopic; dtv: any } =
    inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<DitaTopicVersionComponent>);
  roleService = inject(ROLE_SERVICE);
  ditatTopic = signal<DitaTopic>(this.dialogData.dt);
  ditaTopicVersion = signal<DitaTopicVersionViewModel>(this.dialogData.dtv);
  dtForm: ModelFormGroup<DitaTopicVersionViewModel> = this.fb.nonNullable.group(
    {
      id: [0],
      type: [-1, Validators.required],
      roles: this.fb.nonNullable.control<number[]>([], Validators.required),
      shortDescription: [''],
      steps: this.fb.nonNullable.array<ModelFormGroup<StepViewModel>>([]),
      body: ['', [Validators.required]],
      ditaTopicId: [this.ditatTopic().id],
      versionNumber: ['', [Validators.required]],
    }
  );
  ditaTopicSeletectType = 0;
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.roleService.getAllSubsciption(authApi.getRoles());
    console.log(this.dialogData.dtv);
    if (this.dialogData.action == 'edit') {
      if (this.dialogData.dtv.steps)
        (this.dialogData.dtv.steps as Step[]).forEach((s) => this.addStep());
      this.dtForm.patchValue(this.dialogData.dtv);
      this.dtForm.controls.type.disable();
    }
    if (this.dialogData.action == 'view') {
      this.dtForm.patchValue(this.dialogData.dtv);
      this.dtForm.disable();
    }
  }

  get steps() {
    return this.dtForm.controls.steps as FormArray<
      ModelFormGroup<StepViewModel>
    >;
  }
  addStep() {
    this.steps.push(
      this.fb.nonNullable.group({
        command: ['', [Validators.required]],
        order: [this.steps.length + 1],
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
      this.steps.clear();
    } else if (ditatopicType == DitaTopicType.Task) {
      this.ditaTopicSeletectType = DitaTopicType.Task;
      this.dtForm.controls.steps.addValidators(Validators.required);
      this.dtForm.controls.body.clearValidators();
      this.dtForm.controls.body.reset();
      this.addStep();
    }
  }
  deleteStep(index: number) {
    this.steps.removeAt(index);

    this.steps.controls.forEach((control, i) => {
      control.controls.order.setValue(i + 1);
    });
  }

  reorderSteps() {
    this.steps.controls.sort((a, b) => {
      return a.controls.order.value - b.controls.order.value;
    });
  }
  sendData() {
    this.dtForm.controls.type.enable();
    if (this.dtForm.controls.type.value == DitaTopicType.Task)
      this.dtForm.controls.body.setValue(' ');
    this.dialogRef.close(this.dtForm.value);
  }
}
