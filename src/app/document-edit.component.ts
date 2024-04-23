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
  ROLE_SERVICE,
} from '../services/servicesTokens';
import { AuthService } from '../services/auth.service';
import { DitaTopicsApi, DocumentsApi, authApi } from '../Models/Api';
import { MatDialog } from '@angular/material/dialog';
import { DitaTopicDialogComponent } from '../dialogs/dita-topic-dialog.component';
import {
  DitaTopic,
  DitaTopicVersionViewModel,
  DitatopicVersion,
} from '../Models/models';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog.component';
import { JsonPipe } from '@angular/common';
import { DitaTopicVersionComponent } from '../dialogs/dita-topic-version.component';
import { EditDitaTopicComponent } from '../dialogs/edit-dita-topic.component';
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
      Repo for: {{ this.docService.getBy().title }}
    </h1>
    <!--  -->
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
      <button
        mat-raised-button
        color="accent"
        (click)="AttachDtVersionsToDocVersion()"
      >
        Save
      </button>
      <button mat-raised-button color="primary" (click)="AddDitaTopic()">
        Add Dita Topic
      </button>
    </div>
    }
    <k-table
      [columns]="ditaTopicColumns"
      [dataSource]="this.docService.getBy().ditaTopics"
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
      [selected_Rows]="selected_dtVersionsForCurrentDocVersion()"
      (onSelectedRows)="this.selectedDitaTopicVersions.set($event)"
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
        }
      },
      { allowSignalWrites: true }
    );
  }
  commonSignalService = inject(CommonSignalsService);
  ditaTopicService = inject(DITATOPIC_SERVICE);
  docService = inject(DOCUMENTS_SERVICE);
  roleService = inject(ROLE_SERVICE);
  AuthService = inject(AuthService);
  docId = input.required<number>();
  router = inject(Router);
  versionId = input<number>(0);
  selectedDitaTopicVersions = signal<DitatopicVersion[]>([]);
  selectedDitaTopic = signal<DitaTopic>(new DitaTopic());
  selected_dtVersionsForCurrentDocVersion = signal<DitatopicVersion[]>([]);
  totalSelectedDitaTopicVersions = signal<number[]>([]);
  docById = signal<number>(0);
  cdr = inject(ChangeDetectorRef);
  selectedDocVersion = computed(() =>
    this.docService
      .getBy()
      ?.docVersions?.find((dv) => dv.id == this.versionId())
  );
  ditaTopicColumns: KTColumns[] = [
    { property: 'id', displayText: 'Id', dataType: 'n' },
    { property: 'title', displayText: 'Title', dataType: 's' },
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
  onDitatopicButtonsClick(event: KTButtonClickEvent<DitaTopic>) {
    switch (event.actionName) {
      case 'edit':
        this.EditDitaTopic(event.element);
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
    this.onVersionSelected(this.selectedDitaTopic().id, event.element);
    switch (event.actionName) {
      case 'design':
        // this.DitaTopicVersion(event.row as DitaTopic, 'edit');
        break;
      case 'edit':
        this.DitaTopicVersion(this.selectedDitaTopic(), 'edit');
        break;
      case 'del':
        this.DeleteVersion(this.selectedDitaTopic().id);
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
      .subscribe((res) => {
        this.docService.getBy.update(() => res);
        let ditaTopic = this.docService
          .getBy()
          .ditaTopics.find((dt) => dt.id == this.selectedDitaTopic().id);
        if (ditaTopic) {
          this.selectedDitaTopic.set(ditaTopic);
        }
        this.commonSignalService.loaderLoading.set(false);
      });
  }
  ngOnInit(): void {
    this.docService.getBySubsciption(DocumentsApi.getById(this.docId()));
    this.docService.getBy();
    this.roleService.getAllSubsciption(authApi.getRoles());
    if (this.versionId()) {
      this.dtVersionsColumns.unshift({
        property: 'select',
        displayText: '',
        dataType: 'n',
      });
    }
  }

  AddDitaTopic() {
    const dialogRef = this.dialog.open(DitaTopicDialogComponent, {
      data: { doc: this.docService.getBy() },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ditaTopicService
          .postObservable(DitaTopicsApi.create(), result)
          .subscribe((res: any) => {
            this.docService.getBy.update((d) => {
              res.roles = res.roles.map((r: any) => r.roleId);
              console.log(res);
              d.ditaTopics = d.ditaTopics.concat(res as DitaTopic);
              console.log(d.ditaTopics);
              return d;
            });
          });
      }
    });
  }

  DeleteDitaTopic(dt: DitaTopic) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ditaTopicService.Delete(DitaTopicsApi.delete(dt.id));
        this.docService.getBy.update((d) => {
          d.ditaTopics = d.ditaTopics.filter((d) => d.id !== dt.id);
          return d;
        });
      }
    });
  }

  DitaTopicVersion(dt: DitaTopic, action: 'edit' | 'add' = 'add') {
    this.selectedDitaTopic.set(dt);
    const dialogRef = this.dialog.open(DitaTopicVersionComponent, {
      data: { action: action, dt: dt, dtv: this.selectedVersions[dt.id] },
      width: '45vw',
    });
    dialogRef.afterClosed().subscribe((result: DitaTopicVersionViewModel) => {
      if (result) {
        if (result.type === 1) result.body = ' ';
        if (action === 'add') {
          this.ditaTopicService
            .postObservable(DitaTopicsApi.createVersion(), result)
            .subscribe((res) => {
              this.updateTopicVersions(res as DitatopicVersion);
            });
        } else {
          this.ditaTopicService
            .putObservable(DitaTopicsApi.updateVersion(result.id), result)
            .subscribe((res) => {
              this.updateTopicVersions(res as DitatopicVersion);
            });
        }
      }
    });
  }

  DeleteVersion(ditatopicId: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ditaTopicService
          .DeleteObservable(
            DitaTopicsApi.deleteVersion(this.selectedVersions[ditatopicId].id)
          )
          .subscribe({
            next: (res) => {
              this.docService.getBy.update((d) => {
                const topic = d.ditaTopics.find((d) => d.id === ditatopicId);
                const dtVersions = topic?.ditatopicVersions.filter(
                  (v) => v.id !== this.selectedVersions[ditatopicId].id
                );
                if (topic) {
                  topic.ditatopicVersions = [...dtVersions!];
                }
                delete this.selectedVersions[ditatopicId];
                return d;
              });
            },
            error: (error) => {
              console.error('There was an error!', error);
            },
          });
      }
    });
  }

  EditDitaTopic(dt: DitaTopic) {
    const dialogRef = this.dialog.open(EditDitaTopicComponent, {
      data: { doc: this.docService.getBy(), dt: dt },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ditaTopicService
          .putObservable(DitaTopicsApi.update(dt.id), result)
          .subscribe((res) => {
            let index = this.docService
              .getBy()
              .ditaTopics.findIndex((d) => d.id === dt.id);

            this.docService.getBy.update((d) => {
              let dita = [...d.ditaTopics];
              dita.splice(index, 1, res as DitaTopic);
              d.ditaTopics = dita;
              return d;
            });
          });
        this.cdr.detectChanges();
      }
    });
  }

  private updateTopicVersions(dtVersion: DitatopicVersion) {
    this.docService.getBy.update((d) => {
      const dt = d.ditaTopics.find((d) => d.id === this.selectedDitaTopic().id);
      if (dt) {
        const dtVersions = [...dt.ditatopicVersions];
        dtVersions.splice(
          dt.ditatopicVersions.findIndex((v) => v.id == dtVersion.id),
          1,
          dtVersion
        );
        dt.ditatopicVersions = [...dtVersions];
      }
      this.onVersionSelected(this.selectedDitaTopic().id, dtVersion);
      return d;
    });
  }
}
