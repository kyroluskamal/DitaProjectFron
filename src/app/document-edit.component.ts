import { Component, OnInit, inject, input } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, RouterOutlet } from '@angular/router';
import { KTableComponent } from '../Generic components/k-table.component';
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
    <div class="btn-align-end">
      <button mat-raised-button color="primary" (click)="AddDitaTopic()">
        Add Dita Topic
      </button>
    </div>
    }
    <div class="card-container">
      @for (dt of this.docService.getBy().ditaTopics; track dt.id) {
      <mat-card class="doc-card">
        <mat-card-header class="d-flex flex-column">
          <mat-card-title>{{ dt.title }}</mat-card-title>
          <div class="d-flex justify-content-end">
            <button mat-icon-button color="primary" (click)="EditDitaTopic(dt)">
              <mat-icon fontIcon="edit"></mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="DeleteDitaTopic(dt)">
              <mat-icon fontIcon="delete"></mat-icon>
            </button>
          </div>
        </mat-card-header>
        <mat-card-content style="margin-top: 7%;margin-bottom: 7%;">
          <mat-select
            #selectedVersion
            placeholder="Select Version"
            (selectionChange)="onVersionSelected(dt.id, $event.value)"
          >
            @for(version of dt.ditatopicVersions; track version.id){
            <mat-option [value]="version">
              {{ version.versionNumber }}
            </mat-option>
            }
          </mat-select>
        </mat-card-content>
        <mat-card-actions align="end">
          @if(isSelectedVersion(dt.id)){
          <button
            mat-icon-button
            color="primary"
            (click)="DitaTopicVersion(dt, 'edit')"
          >
            <mat-icon fontIcon="edit"></mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="DeleteVersion(dt.id)">
            <mat-icon fontIcon="delete"></mat-icon>
          </button>
          }
          <button
            mat-icon-button
            color="primary"
            (click)="DitaTopicVersion(dt)"
          >
            <mat-icon fontIcon="add_circle"></mat-icon>
          </button>
        </mat-card-actions>
      </mat-card>
      }
    </div>
  `,
  host: { class: 'margin-block d-block' },
  styles: ``,
})
export class DocumentEditComponent implements OnInit {
  ditaTopicService = inject(DITATOPIC_SERVICE);
  docService = inject(DOCUMENTS_SERVICE);
  roleService = inject(ROLE_SERVICE);
  AuthService = inject(AuthService);
  docId = input.required<number>();

  dialog = inject(MatDialog);
  selectedVersions: { [topicId: number]: DitatopicVersion } = {};
  onVersionSelected(topicId: number, version: DitatopicVersion) {
    this.selectedVersions[topicId] = version;
  }
  isSelectedVersion(topicId: number): boolean {
    return this.selectedVersions.hasOwnProperty(topicId);
  }
  ngOnInit(): void {
    this.docService.getBySubsciption(DocumentsApi.getById(this.docId()));
    this.docService.getBy();
    this.roleService.getAllSubsciption(authApi.getRoles());
  }

  AddDitaTopic() {
    const dialogRef = this.dialog.open(DitaTopicDialogComponent, {
      data: { doc: this.docService.getBy() },
      width: '45vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ditaTopicService
          .postObservable(DitaTopicsApi.create(), result)
          .subscribe((res) => {
            this.docService.getBy.update((d) => {
              d.ditaTopics.push(res as DitaTopic);
              return d;
            });
          });
      }
    });
  }

  DeleteDitaTopic(dt: DitaTopic) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
    });
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
    const dialogRef = this.dialog.open(DitaTopicVersionComponent, {
      data: { action: action, dt: dt, dtv: this.selectedVersions[dt.id] },
      width: '45vw',
    });
    dialogRef.afterClosed().subscribe((result: DitaTopicVersionViewModel) => {
      if (result) {
        if (result.type === 1) result.body = ' ';
        console.log(result);
        if (action === 'add') {
          this.ditaTopicService
            .postObservable(DitaTopicsApi.createVersion(), result)
            .subscribe((res) => {
              this.docService.getBy.update((d) => {
                d.ditaTopics
                  .find((d) => d.id === dt.id)
                  ?.ditatopicVersions.push(res as DitatopicVersion);
                return d;
              });
            });
        } else {
          this.ditaTopicService
            .putObservable(DitaTopicsApi.updateVersion(result.id), result)
            .subscribe((res) => {
              console.log(res);
              this.docService.getBy.update((d) => {
                let dt = d.ditaTopics.find(
                  (d) => d.id === (res as DitatopicVersion).ditaTopicId
                );

                let index = dt?.ditatopicVersions.findIndex(
                  (v) => v.id === (res as DitatopicVersion).id
                );

                dt?.ditatopicVersions.splice(
                  index!,
                  1,
                  res as DitatopicVersion
                );
                this.onVersionSelected(dt!.id, res as DitatopicVersion);
                return d;
              });
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
                d.ditaTopics.forEach((d) => {
                  if (d.id === ditatopicId) {
                    d.ditatopicVersions = d.ditatopicVersions.filter(
                      (v) => v.id !== this.selectedVersions[ditatopicId].id
                    );
                  }
                });
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
            this.docService.getBy.update((d) => {
              let index = d.ditaTopics.findIndex((d) => d.id === dt.id);
              d.ditaTopics.splice(index, 1, res as DitaTopic);
              return d;
            });
          });
      }
    });
  }
}
