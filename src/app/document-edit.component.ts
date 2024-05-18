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
import { DitaTopicsApi, DocumentsApi, authApi } from '../Models/Api';
import { MatDialog } from '@angular/material/dialog';
import {
  DitaTopic,
  DitaTopicVersionViewModel,
  DitatopicVersion,
} from '../Models/models';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog.component';
import { JsonPipe } from '@angular/common';
import { DitaTopicVersionComponent } from '../dialogs/dita-topic-version.component';
import { CommonSignalsService } from '../services/common-signals.service';
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
    @if(this.AuthService.isloggedIn() && this.AuthService.isAdminOrAnalyst()) {
    <h1
      style="text-align:center; background-color: #cfcfcf; padding-top: 20px; padding-bottom:20px"
    >
      Document title: {{ this.docService.getBy().title }} - Version number:
      {{ currentDocVersion()?.versionNumber }}
    </h1>
    <div class="btn-align-end">
      <button
        [disabled]="!isDocValidByChosenAllRequiredDitaTopics()"
        mat-raised-button
        color="accent"
        (click)="AttachDtVersionsToDocVersion()"
      >
        Save
      </button>
    </div>
    }
    <k-table
      [columns]="ditaTopicColumns"
      [dataSource]="this.docService.getBy().ditaTopics!"
      [trackByProperty]="'id'"
      (OnRowClick)="this.selectedDitaTopic.set($event)"
      [rowClassConditions]="evaluateRowClass"
    />
    <k-table
      [columns]="dtVersionsColumns"
      [dataSource]="this.selectedDitaTopic().ditatopicVersions"
      [trackByProperty]="'id'"
      [Buttons]="Buttons"
      [selected_Rows]="selected_dtVersionsForCurrentDocVersion()"
      (onSelectedRows)="CaptureChosenVersions($event)"
      (OnRowClick)="onVersionSelected(this.selectedDitaTopic().id, $event)"
      (OnButtonClick)="onDitatopic_Versions_ButtonsClick($event)"
    />
  `,
  host: { class: 'margin-block d-block' },
  styles: ``,
})
export class DocumentEditComponent implements OnInit {
  constructor() {
    effect(
      () => {
        if (this.versionId()) {
          let selectedDitaTopicVersions_ids = this.docService
            .getBy()
            .docVersions?.find((docv) => docv.id == Number(this.versionId()))
            ?.ditatopicVersions?.map((dtv) => dtv.ditatopicVersionId);
          let dtVersions =
            this.docService
              .getBy()
              ?.ditaTopics?.map((dt) => dt.ditatopicVersions) ?? [];
          //
          let selectedVersions = dtVersions
            ?.flat()
            ?.filter((dtv) => selectedDitaTopicVersions_ids?.includes(dtv.id));
          this.selectedDitaTopicVersions.set(selectedVersions);
          this.selected_dtVersionsForCurrentDocVersion.set(selectedVersions);
          this.docService.getBy().ditaTopics?.forEach((dt) => {
            dt.chosen = selectedVersions?.some((v) => v.ditaTopicId == dt.id);
          });
          this.updateStatusInTable();
        }
      },
      { allowSignalWrites: true }
    );
  }
  commonSignalService = inject(CommonSignalsService);
  ditaTopicService = inject(DITATOPIC_SERVICE);
  familyService = inject(FAMILY_SERVICE);
  docService = inject(DOCUMENTS_SERVICE);
  roleService = inject(ROLE_SERVICE);
  selectedVersion = signal<DitatopicVersion>({} as DitatopicVersion);
  AuthService = inject(AuthService);
  docId = input.required<number>();
  router = inject(Router);
  versionId = input<number>(0);
  currentDocVersion = computed(() => {
    return this.docService
      .getBy()
      ?.docVersions?.find((dv) => dv.id == this.versionId());
  }); // this.docService.getBy().docVersions?.find((dv) => dv.id == this.versionId());
  selectedDitaTopicVersions = signal<DitatopicVersion[]>([]);
  selectedDitaTopic = signal<DitaTopic>(new DitaTopic());
  selected_dtVersionsForCurrentDocVersion = signal<DitatopicVersion[]>([]);
  totalSelectedDitaTopicVersions = signal<number[]>([]);
  docById = signal<number>(0);
  cdr = inject(ChangeDetectorRef);
  isDocValidByChosenAllRequiredDitaTopics = signal<boolean>(false);
  selectedDocVersion = computed(() =>
    this.docService
      .getBy()
      ?.docVersions?.find((dv) => dv.id == this.versionId())
  );
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

  Buttons: KTButtons[] = [
    {
      name: 'view',
      actionName: 'view',
      color: 'primary',
      icon: 'visibility',
    },
  ];
  dtBtns: KTButtons[] = [
    {
      name: 'addVersions',
      actionName: 'addVersions',
      color: 'primary',
      icon: 'add_circle',
    },
    ...this.Buttons,
  ];
  dialog = inject(MatDialog);
  selectedVersions: { [topicId: number]: DitatopicVersion } = {};
  onVersionSelected(topicId: number, version: DitatopicVersion) {
    this.selectedVersions[topicId] = version;
  }

  onDitatopic_Versions_ButtonsClick(
    event: KTButtonClickEvent<DitatopicVersion>
  ) {
    this.onVersionSelected(this.selectedDitaTopic().id, event.element);
    this.selectedVersion.set(event.element);
    switch (event.actionName) {
      case 'view':
        this.DitaTopicVersion(this.selectedDitaTopic(), 'view');
        break;
    }
  }
  AttachDtVersionsToDocVersion() {
    this.commonSignalService.loaderLoading.set(true);
    this.docService
      .postObservable(
        DocumentsApi.AttachDitaTopic_Versions(this.docId(), this.versionId()),
        this.selectedDitaTopicVersions().map((v) => v.id) as any
      )
      .subscribe(() => {
        this.commonSignalService.loaderLoading.set(false);
        this.getDoc();
      });
  }
  ngOnInit(): void {
    this.docService.getBySubsciption(DocumentsApi.getById(this.docId()));
    this.roleService.getAllSubsciption(authApi.getRoles());
    if (this.versionId()) {
      this.dtVersionsColumns.unshift({
        property: 'select',
        displayText: '',
        dataType: 'n',
      });
    }
  }

  DitaTopicVersion(dt: DitaTopic, action: 'edit' | 'add' | 'view' = 'add') {
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
        } else if (action === 'edit') {
          this.ditaTopicService.putSubsciption(
            DitaTopicsApi.updateVersion(result.id),
            result
          );
        }
        this.getDoc();
      }
    });
  }

  DeleteVersion(ditatopicId: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ditaTopicService.Delete(
          DitaTopicsApi.deleteVersion(this.selectedVersions[ditatopicId].id)
        );
        this.getDoc();
      }
    });
  }

  //#endregion
  CaptureChosenVersions(versions: DitatopicVersion[]) {
    this.selectedDitaTopicVersions.set(versions);
    let selectedDitaTopicsId = this.selectedDitaTopicVersions().map(
      (v) => v.ditaTopicId
    );
    this.docService.getBy().ditaTopics?.forEach((dt) => {
      dt.chosen = selectedDitaTopicsId.includes(dt.id);
    });
    this.updateStatusInTable();
  }
  getDoc() {
    setTimeout(() => {
      this.docService.getBySubsciption(DocumentsApi.getById(this.docId()));
    }, 500);
  }
  evaluateRowClass(row: DitaTopic): { [key: string]: boolean } {
    return {
      required: row.isRequired && !row.chosen,
      chosen: row.isRequired && row.chosen,
    };
  }
  updateStatusInTable() {
    this.isDocValidByChosenAllRequiredDitaTopics.set(
      this.docService
        .getBy()
        .ditaTopics?.every((dt) => !dt.isRequired || dt.chosen) ?? false
    );
  }
}
