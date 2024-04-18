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
import { DocVersionDialogComponent } from '../dialogs/doc-version-dialog.component';
import { FormsModule } from '@angular/forms';
import { EditDocDialogComponent } from '../dialogs/edit-doc-dialog.component';
import { version } from 'os';

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
    FormsModule,
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
        <mat-card-header class="d-flex flex-column">
          <mat-card-title>{{ doc.title }}</mat-card-title>
          <div class="d-flex justify-content-end">
            <button
              mat-button
              color="primary"
              [routerLink]="[doc.id]"
              [state]="{ data: { doc: doc } }"
            >
              Open repo
            </button>
            <button mat-icon-button color="primary" (click)="editDoc(doc)">
              <mat-icon fontIcon="edit"></mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteDoc(doc)">
              <mat-icon fontIcon="delete"></mat-icon>
            </button>
          </div>
        </mat-card-header>
        <mat-card-content style="margin-top: 7%;margin-bottom: 7%;">
          <mat-select
            [(ngModel)]="selectedVersions[doc.id]"
            #selectVersion
            placeholder="Select Version"
            (selectionChange)="saveSelectedVersion(doc.id, $event.value)"
          >
            @for(version of doc.docVersions; track version.id){
            <mat-option [value]="version">
              {{ version.versionNumber }}
            </mat-option>
            }
          </mat-select>
        </mat-card-content>
        <mat-card-actions align="end">
          @if(isSelectedVersion(doc.id)){ @if (this.pdfSrcForRole() === '') {
          <button
            mat-button
            color="primary"
            [disabled]="doc.ditaTopics.length == 0"
          >
            Generate PDF
          </button>
          } @else{

          <button mat-icon-button color="primary">
            <mat-icon fontIcon="picture_as_pdf"></mat-icon>
          </button>
          } } @if (this.AuthService.isAdminOrAnalyst() &&
          isSelectedVersion(doc.id)) {

          <button mat-icon-button color="warn" (click)="DeleteVersion(doc.id)">
            <mat-icon fontIcon="delete"></mat-icon>
          </button>
          <button mat-icon-button color="primary" (click)="addEditVersion(doc)">
            <mat-icon fontIcon="add_circle"></mat-icon>
          </button>
          <button
            mat-icon-button
            color="primary"
            (click)="addEditVersion(doc, 'edit')"
          >
            <mat-icon fontIcon="edit"></mat-icon>
          </button>
          }
        </mat-card-actions>
      </mat-card>
      }
    </div>
  `,
  host: { class: 'margin-block d-block' },
  styles: [],
})
export class DocumentsComponent {
  title = 'DitaTopic';
  docsService = inject(DOCUMENTS_SERVICE);
  AuthService = inject(AuthService);
  dialog = inject(MatDialog);

  selectedVersions: { [docId: number]: DocVersion } = {};

  isSelectedVersion(docId: number): boolean {
    return this.selectedVersions.hasOwnProperty(docId);
  }
  pdfSrcForRole = signal('');
  ngOnInit() {
    this.docsService.getAllSubsciption(DocumentsApi.getAll());
  }

  openDialog(documento: Documento): void {
    this.dialog.open(ShowDocVersionsDialogComponent, {
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
  saveSelectedVersion(docId: number, version: DocVersion) {
    console.log(version);
    this.selectedVersions[docId] = version;
    if (this.selectedVersions[docId]) {
      this.pdfSrcForRole.set(
        this.selectedVersions[docId].roles.filter(
          (DocVersionRole) =>
            DocVersionRole.role?.name ===
            this.AuthService.currentUser().roles[0]
        )[0].pdFfilePath
      );
    }
  }

  DeleteVersion(docId: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.docsService
          .DeleteObservable(
            DocumentsApi.deleteVersion(docId, this.selectedVersions[docId].id)
          )
          .subscribe(() => {
            this.removeDocVersion(docId);
            let docs = this.docsService.getAllRes();
            this.docsService.getAllRes.update(() => {
              delete this.selectedVersions[docId];
              return docs;
            });
          });
      }
    });
  }
  addEditVersion(doc: Documento, action: 'add' | 'edit' = 'add') {
    const docRef = this.dialog.open(DocVersionDialogComponent, {
      data: {
        action: action,
        doc: doc,
        version: this.selectedVersions[doc.id],
      },
    });
    docRef.afterClosed().subscribe((result) => {
      if (result) {
        if (action === 'add')
          this.docsService
            .postObservable(DocumentsApi.createVersion(doc.id), result)
            .subscribe((res) => {
              this.AddDocVeriosn(doc.id, res);
            });
        else
          this.docsService
            .putObservable(
              DocumentsApi.updateVersion(
                doc.id,
                this.selectedVersions[doc.id].id
              ),
              result
            )
            .subscribe((res) => {
              this.UpdateDocVersion(doc.id, res);
            });
      }
    });
  }
  editDoc(doc: Documento) {
    const dialogRed = this.dialog.open(EditDocDialogComponent, {
      data: { doc: doc },
    });

    dialogRed.afterClosed().subscribe((result) => {
      if (result) {
        this.docsService
          .putObservable(DocumentsApi.update(doc.id), result)
          .subscribe((res) => {
            console.log(res);
            this.docsService.getAllSubsciption(DocumentsApi.getAll());
          });
      }
    });
  }

  private AddDocVeriosn(docId: number, response: any) {
    this.docsService
      .getAllRes()
      .find((d) => d.id === docId)
      ?.docVersions.push(response as DocVersion);
    this.docsService.getAllRes.update((docs) => {
      docs.find((doc) => doc.id === docId)?.docVersions.push(response);
      return docs;
    });
  }

  private UpdateDocVersion(docId: number, response: any) {
    let doc = this.docsService.getAllRes().find((doc) => doc.id === docId);
    let index = doc?.docVersions?.findIndex(
      (version) => version.id === this.selectedVersions[docId].id
    );
    this.docsService.getAllRes.update((docs) => {
      docs
        .find((doc) => doc.id === docId)
        ?.docVersions.splice(index!, 1, response);
      return docs;
    });
    this.selectedVersions[docId] = response;
  }
  private removeDocVersion(docId: number) {
    let doc = this.docsService.getAllRes().find((doc) => doc.id === docId);
    let index = doc?.docVersions?.findIndex(
      (version) => version.id === this.selectedVersions[docId].id
    );
    this.docsService
      .getAllRes()
      .find((doc) => doc.id === docId)
      ?.docVersions.splice(index!, 1);
  }
}
