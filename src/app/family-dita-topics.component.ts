import {
  ChangeDetectorRef,
  Component,
  OnInit,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  KTButtonClickEvent,
  KTButtons,
  KTColumns,
  KTableComponent,
} from '../Generic components/k-table.component';
import {
  DITATOPIC_SERVICE,
  DOCUMENTS_SERVICE,
  FAMILY_SERVICE,
  ROLE_SERVICE,
} from '../services/servicesTokens';
import { AuthService } from '../services/auth.service';
import {
  DitaTopicsApi,
  DocFamilyApi,
  DocumentsApi,
  authApi,
} from '../Models/Api';
import { MatDialog } from '@angular/material/dialog';
import {
  DitaTopic,
  DitaTopicVersionViewModel,
  DitatopicVersion,
  DocFamily,
} from '../Models/models';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog.component';
import { JsonPipe } from '@angular/common';
import { DitaTopicVersionComponent } from '../dialogs/dita-topic-version.component';
import { CommonSignalsService } from '../services/common-signals.service';
import { FamilyDitaTopicDialogComponent } from '../dialogs/family-dita-topic-dialog.component';
import { AddUpdateOneDitaTopicDialogComponent } from '../dialogs/add-update-one-dita-topic-dialog.component';
@Component({
  selector: 'app-document-edit',
  standalone: true,
  imports: [
    RouterOutlet,
    KTableComponent,
    MatButtonModule,
    MatCardModule,
    MatIconButton,
    MatIconModule,
    RouterLink,
    MatSelectModule,
    JsonPipe,
  ],
  template: `
    <h1
      style="text-align:center; background-color: #cfcfcf; padding-top: 20px; padding-bottom:20px"
    >
      DitaTopic in Family: {{ this.familyService.getBy().title }}
    </h1>
    <k-table
      [columns]="ditaTopicColumns"
      [dataSource]="this.familyService.getBy().ditaTopics"
      [trackByProperty]="'id'"
      [Buttons]="dtBtns"
      (OnRowClick)="this.selectedDitaTopic.set($event)"
      (OnButtonClick)="onDitatopicButtonsClick($event)"
    />

    <k-table
      [columns]="dtVersionsColumns"
      [dataSource]="this.selectedDitaTopic().ditatopicVersions"
      [trackByProperty]="'id'"
      [Buttons]="Buttons"
      (OnRowClick)="this.selectedVersion.set($event)"
      (OnButtonClick)="onDitatopic_Versions_ButtonsClick($event)"
    />
    <!-- @if(this.AuthService.isloggedIn() && this.AuthService.isAdminOrAnalyst()) {
    <h1
      style="text-align:center; background-color: #cfcfcf; padding-top: 20px; padding-bottom:20px"
    >
      Repo for: {{ this.docService.getBy().title }}
    </h1>
    @if(this.versionId()) {
    <h2>
      Dita topics and its version for Doc version:
      {{ selectedDocVersion()?.versionNumber }}
    </h2>
    <div>
      <ul>
        @for (dt of this.selectedDocVersion()?.ditaTopics; track dt.id) {
        <li>
          {{ dt.title }}
          <ul></ul>
        </li>
        }
      </ul>
    </div>
    }
    <div class="btn-align-end">
      @if(!this.versionId()) {
      <button mat-raised-button color="primary" (click)="AddDitaTopic()">
        Add Dita Topic
      </button>
      }@else{
      <button
        mat-raised-button
        color="accent"
        (click)="AttachDtVersionsToDocVersion()"
      >
        Save
      </button>
      }
    </div>
    }
    <k-table
      [columns]="ditaTopicColumns"
      [dataSource]="this.docService.getBy().ditaTopics"
      [trackByProperty]="'id'"
      [Buttons]="dtBtns"
      (OnRowClick)="this.selectedDitaTopic.set($event)"
      (OnButtonClick)="onDitatopicButtonsClick($event)"
    /> -->
  `,
  host: { class: 'margin-block d-block' },
  styles: ``,
})
export class FamilyDitaTopicsComponent {
  familyId = input.required<number>();
  familyService = inject(FAMILY_SERVICE);
  roleService = inject(ROLE_SERVICE);
  ditaTopicService = inject(DITATOPIC_SERVICE);
  AuthService = inject(AuthService);
  dialog = inject(MatDialog);
  selectedVersion = signal<DitatopicVersion>({} as DitatopicVersion);
  selectedDitaTopic = signal<DitaTopic>(new DitaTopic());
  dtVersionsColumns: KTColumns[] = [
    { property: 'id', displayText: 'Id', dataType: 'n' },
    { property: 'versionNumber', displayText: 'Version no.', dataType: 'n' },
    { property: 'createdAt', displayText: 'Created at', dataType: 'd' },
    {
      property: 'type',
      displayText: 'Type',
      dataType: 'changeValue',
      changeValue: { 0: 'Concept', 1: 'Task', 2: 'Reference' },
    },
    {
      property: 'roles',
      displayText: 'Roles',
      dataType: 'map',
      mapFun: (v) => this.roleService.getAllRes().find((r) => r.id == v)?.name,
    },
    { property: 'shortDescription', displayText: 'Shor dsec', dataType: 's' },
  ];
  selected_dtVersionsForCurrentDocVersion = signal<DitatopicVersion[]>([]);

  ditaTopicColumns: KTColumns[] = [
    { property: 'id', displayText: 'Id', dataType: 'n' },
    { property: 'title', displayText: 'Title', dataType: 's' },
    { property: 'isRequired', displayText: 'Required', dataType: 'b' },
    {
      property: 'ditatopicVersions',
      displayText: 'No of versions',
      dataType: 'counted',
    },
  ];
  Buttons: KTButtons[] = [];
  dtBtns: KTButtons[] = [];
  ngOnInit(): void {
    this.roleService.getAllSubsciption(authApi.getRoles());
    if (this.AuthService.isAdminOrAnalyst()) {
      this.Buttons = [
        {
          name: 'edit',
          actionName: 'edit',
          color: 'primary',
          icon: 'edit',
        },
        {
          name: 'delete',
          actionName: 'del',
          color: 'warn',
          icon: 'delete',
        },
      ];
      this.dtBtns = [
        {
          name: 'addVersions',
          actionName: 'addVersions',
          color: 'primary',
          icon: 'add_circle',
        },
        ...this.Buttons,
      ];
    }
    this.familyService.getBySubsciption(DocFamilyApi.getById(this.familyId()));
  }
  onDitatopicButtonsClick(event: KTButtonClickEvent<DitaTopic>) {
    switch (event.actionName) {
      case 'edit':
        this.updateDitaTopic(event.element);
        break;
      case 'del':
        this.DeleteDitaTopic(event.element);
        break;
      case 'addVersions':
        this.DitaTopicVersion(event.element);
        break;
    }
  }
  onDitatopic_Versions_ButtonsClick(
    event: KTButtonClickEvent<DitatopicVersion>
  ) {
    this.selectedVersion.set(event.element);
    switch (event.actionName) {
      case 'edit':
        this.selectedVersion.set(event.element);
        this.DitaTopicVersion(this.selectedDitaTopic(), 'edit');
        break;
      case 'del':
        this.DeleteVersion(event.element.id);
        break;
    }
  }
  DeleteDitaTopic(dt: DitaTopic) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ditaTopicService.Delete(DitaTopicsApi.delete(dt.id));
        this.getFamily();
      }
    });
  }
  DitaTopicVersion(dt: DitaTopic, action: 'edit' | 'add' = 'add') {
    this.selectedDitaTopic.set(dt);
    const dialogRef = this.dialog.open(DitaTopicVersionComponent, {
      data: { action: action, dt: dt, dtv: this.selectedVersion() },
    });
    dialogRef.afterClosed().subscribe((result: DitaTopicVersionViewModel) => {
      if (result) {
        if (result.type === 1) result.body = ' ';
        if (action === 'add') {
          this.ditaTopicService.postSubsciption(
            DitaTopicsApi.createVersion(),
            result
          );
        } else {
          this.ditaTopicService.putSubsciption(
            DitaTopicsApi.updateVersion(result.id),
            result
          );
          this.getFamily();
        }
        this.getFamily();
      }
    });
  }
  DeleteVersion(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ditaTopicService.Delete(DitaTopicsApi.deleteVersion(id));
        this.selectedVersion.set({} as DitatopicVersion);
        this.getFamily();
      }
    });
  }
  AddDitaTopic(dt: DitaTopic) {
    // const dialogRef = this.dialog.open(FamilyDitaTopicDialogComponent, {
    //   data: {
    //     action: action,
    //     family: family,
    //   },
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(result);
    //   if (result) {
    //     if (action == 'add') {
    //       this.ditaTopicService.postSubsciption(DitaTopicsApi.create(), result);
    //     } else {
    //       this.ditaTopicService.putSubsciption(
    //         DitaTopicsApi.updateMany(),
    //         result
    //       );
    //     }
    //     this.gerAllFamily();
    //   }
    // });
  }

  updateDitaTopic(dt: DitaTopic) {
    const dialogRef = this.dialog.open(AddUpdateOneDitaTopicDialogComponent, {
      data: {
        family: this.familyService.getBy(),
        ditaTopic: dt,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ditaTopicService.putSubsciption(
          DitaTopicsApi.update(dt.id),
          result
        );
      }
      this.getFamily();
    });
  }
  getFamily() {
    setTimeout(() => {
      this.familyService.getBySubsciption(
        DocFamilyApi.getById(this.familyId())
      );
      setTimeout(() => {
        let selectedDt = this.familyService
          .getBy()
          .ditaTopics.find((dt) => dt.id == this.selectedDitaTopic().id);
        this.selectedDitaTopic.set(selectedDt!);
      }, 500);
    }, 500);
  }
}
