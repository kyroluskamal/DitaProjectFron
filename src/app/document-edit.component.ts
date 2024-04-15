import { Component, OnInit, inject, input } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { KTableComponent } from '../Generic components/k-table.component';
import {
  DITATOPIC_SERVICE,
  DOCUMENTS_SERVICE,
} from '../services/servicesTokens';
import { AuthService } from '../services/auth.service';
import { DitaTopicsApi, DocumentsApi } from '../Models/Api';
import { MatDialog } from '@angular/material/dialog';
import { DitaTopicDialogComponent } from '../dialogs/dita-topic-dialog.component';

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
          <mat-select placeholder="Select Version">
            @for(version of dt.ditaTopicVersions; track version.id){
            <mat-option [value]="version">
              {{ version.versionNumber }}
            </mat-option>
            }
          </mat-select>
        </mat-card-content>
        <mat-card-actions align="end">
          <button mat-icon-button color="warn">
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
  AuthService = inject(AuthService);
  docId = input.required<number>();

  dialog = inject(MatDialog);

  constructor() {}
  ngOnInit(): void {
    this.docService.getBySubsciption(DocumentsApi.getById(this.docId()));
    this.docService.getBy();
  }

  AddDitaTopic() {
    this.dialog.open(DitaTopicDialogComponent, {
      data: { doc: this.docService.getBy() },
      width: '40vw',
    });
  }
}
