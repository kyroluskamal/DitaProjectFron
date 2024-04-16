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
import { DitaTopic, DitatopicVersion } from '../Models/models';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog.component';
import { JsonPipe } from '@angular/common';
import { DitaTopicVersionComponent } from '../dialogs/dita-topic-version.component';
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
    <div class="btn-align-end">
      <button mat-raised-button color="primary" (click)="AddDitaTopic()">
        Add Dita Topic
      </button>
    </div>
    }
    <div class="card-container">
      @for (dt of this.docService.getBy().ditaTopics; track dt.id) {
      <mat-card class="doc-card">
        <mat-card-header>
          <mat-card-title>{{ dt.title }}</mat-card-title>
        </mat-card-header>
        <mat-card-content style="margin-top: 7%;margin-bottom: 7%;">
          <mat-select
            placeholder="Select Version"
            (selectionChange)="selectedVersion = $event.value"
          >
            @for(version of dt.ditatopicVersions; track version.id){
            <mat-option [value]="version">
              {{ version.versionNumber }}
            </mat-option>
            }
          </mat-select>
        </mat-card-content>
        <mat-card-actions align="end">
          @if(selectedVersion !== null){
          <button
            mat-icon-button
            color="primary"
            (click)="DitaTopicVersion(dt)"
          >
            <mat-icon fontIcon="add_circle"></mat-icon>
          </button>
          <button
            mat-icon-button
            color="primary"
            (click)="DitaTopicVersion(dt, 'edit')"
          >
            <mat-icon fontIcon="edit"></mat-icon>
          </button>

          }
          <button mat-icon-button color="warn" (click)="DeleteDitaTopic(dt)">
            <mat-icon fontIcon="delete"></mat-icon>
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
  selectedVersion: DitatopicVersion | null = null;
  constructor() {}
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
              d.ditaTopics.push(res.data as DitaTopic);
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
      data: { action: action, dt: dt, dtv: this.selectedVersion },
      width: '45vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ditaTopicService
          .postObservable(DitaTopicsApi.createVersion(), result)
          .subscribe((res) => {
            this.docService.getBy.update((d) => {
              d.ditaTopics = d.ditaTopics.map((d) =>
                d.id === dt.id
                  ? {
                      ...d,
                      ditatopicVersions: [...d.ditatopicVersions, res.data],
                    }
                  : d
              );
              return d;
            });
          });
      }
    });
  }
}
