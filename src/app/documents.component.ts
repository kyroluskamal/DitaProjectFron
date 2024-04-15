import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { KTableComponent } from '../Generic components/k-table.component';
import { GenericService } from '../services/generic.service';
import { DocVersion, Documento } from '../Models/models';
import { MatDialog } from '@angular/material/dialog';
import { ShowDocVersionsDialogComponent } from '../dialogs/show-doc-versions-dialog.component';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog.component';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { AddDocDialogComponent } from '../dialogs/add-doc-dialog.component';
import { DocumentsApi } from '../Models/Api';
import { DOCUMENTS_SERVICE } from '../services/servicesTokens';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-root',
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
  providers: [GenericService<Documento, Documento>, MatDialog],
  template: `
    @if(this.AuthService.isloggedIn() && this.AuthService.isAdminOrAnalyst()) {
    <div class="btn-align-end">
      <button mat-raised-button color="primary" (click)="AddDocument()">
        Add Document
      </button>
    </div>
    }
    <div class="card-container">
      @for (doc of this.docsService.getAllRes(); track doc.id) {
      <mat-card class="doc-card">
        <mat-card-header>
          <mat-card-title>{{ doc.title }}</mat-card-title>
        </mat-card-header>
        <mat-card-content style="margin-top: 7%;margin-bottom: 7%;">
          <mat-select
            placeholder="Select Version"
            (selectionChange)="saveSelectedVersion($event.value)"
          >
            @for(version of doc.docVersions; track version.id){
            <mat-option [value]="version">
              {{ version.versionNumber }}
            </mat-option>
            }
          </mat-select>
        </mat-card-content>
        <mat-card-actions align="end">
          @if(selectedVersion !== null){ @if (this.pdfSrcForRole() === '') {
          <button
            mat-button
            color="primary"
            [disabled]="doc.ditaTopics.length == 0"
          >
            Generate PDF
          </button>
          }
          <button
            mat-icon-button
            color="primary"
            [disabled]="this.pdfSrcForRole() === ''"
          >
            <mat-icon fontIcon="picture_as_pdf"></mat-icon>
          </button>
          } @if (this.AuthService.isAdminOrAnalyst()) {
          <button
            mat-button
            color="primary"
            [routerLink]="[doc.id]"
            [state]="{ data: { doc: doc } }"
          >
            Open repo
          </button>
          <button mat-icon-button color="warn" (click)="deleteDoc(doc)">
            <mat-icon fontIcon="delete"></mat-icon>
          </button>
          }
        </mat-card-actions>
      </mat-card>
      }
    </div>
    <!-- <k-table
      [columns]="colums"
      [dataSource]="this.docsService.getAllRes()"
      [trackByProperty]="'id'"
      [Buttons]="{ view: true, edit: true, Delete: true }"
      (OnViewClick)="openDialog($event)"
      (OnDeleteClick)="deleteDoc($event)"
    ></k-table> -->
  `,
  host: { class: 'margin-block d-block' },
  styles: [],
})
export class DocumentsComponent {
  title = 'DitaTopic';
  docsService = inject(DOCUMENTS_SERVICE);
  AuthService = inject(AuthService);
  dialog = inject(MatDialog);
  colums = [
    { property: 'id', displayText: 'No.' },
    { property: 'title', displayText: 'Title' },
  ];
  selectedVersion: DocVersion | null = null;
  pdfSrcForRole = signal('');
  ngOnInit() {
    this.docsService.getAllSubsciption(DocumentsApi.getAll());
  }

  openDialog(documento: Documento): void {
    const dialogRef = this.dialog.open(ShowDocVersionsDialogComponent, {
      width: '40vw',
      data: documento,
    });
  }

  deleteDoc(documento: Documento) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.docsService.Delete(DocumentsApi.delete(documento.id));
      }
    });
  }

  AddDocument() {
    const dialogRed = this.dialog.open(AddDocDialogComponent, {
      width: '40vw',
    });

    dialogRed.afterClosed().subscribe((result) => {
      if (result) {
        this.docsService.postSubsciption(DocumentsApi.create(), result);
      }
    });
  }
  saveSelectedVersion(version: DocVersion) {
    this.selectedVersion = version;

    if (this.selectedVersion) {
      this.pdfSrcForRole.set(
        this.selectedVersion.Roles.filter(
          (role) => role.role?.name === this.AuthService.currentUser().roles[0]
        )[0].PDFfilePath
      );
    }
  }
}
