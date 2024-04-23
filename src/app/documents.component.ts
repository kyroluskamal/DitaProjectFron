import { Component, OnInit, inject, signal } from '@angular/core';
import {
  KTButtonClickEvent,
  KTButtons,
  KTColumns,
  KTableComponent,
} from '../Generic components/k-table.component';
import { GenericService } from '../services/generic.service';
import { DocVersion, Documento } from '../Models/models';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { AddDocDialogComponent } from '../dialogs/add-doc-dialog.component';
import { DocumentsApi } from '../Models/Api';
import { DOCUMENTS_SERVICE } from '../services/servicesTokens';
import { AuthService } from '../services/auth.service';
import { DocVersionDialogComponent } from '../dialogs/doc-version-dialog.component';
import { EditDocDialogComponent } from '../dialogs/edit-doc-dialog.component';
import { Router } from '@angular/router';
import { environment } from '../environments/environment.development';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [KTableComponent, MatButtonModule],
  providers: [GenericService<Documento, Documento>, MatDialog],
  template: `
    @if(this.AuthService.isloggedIn() && this.AuthService.isAdminOrAnalyst()) {
    <div class="btn-align-end">
      <button mat-raised-button color="primary" (click)="AddDocument()">
        Add Document
      </button>
    </div>
    }
    <k-table
      [columns]="DocColumns"
      [dataSource]="this.docsService.getAllRes()"
      [trackByProperty]="'id'"
      [Buttons]="docButtons"
      (OnRowClick)="
        selectedDoc.set($event); _selectedVersions.set($event.docVersions)
      "
      (OnButtonClick)="OnDocTableButtonClick($event)"
    />
    <k-table
      [columns]="DocVersionColumns"
      [dataSource]="_selectedVersions()"
      [trackByProperty]="'id'"
      [Buttons]="docVersionsButtons"
      (OnRowClick)="saveSelectedVersion(selectedDoc().id, $event)"
      (OnButtonClick)="OnDocVersionTableButtonClick($event)"
    />
  `,
  host: { class: 'margin-block d-block' },
  styles: [],
})
export class DocumentsComponent implements OnInit {
  title = 'DitaTopic';
  docsService = inject(DOCUMENTS_SERVICE);
  AuthService = inject(AuthService);
  router = inject(Router);
  dialog = inject(MatDialog);
  DocColumns: KTColumns[] = [
    {
      property: 'id',
      displayText: 'Id',
      dataType: 'n',
    },
    { property: 'title', displayText: 'Title', dataType: 's' },
    {
      property: 'docVersions',
      displayText: 'No. of Versions',
      dataType: 'counted',
    },
    {
      property: 'ditaTopics',
      displayText: 'No. of DitaTopics',
      dataType: 'counted',
    },
  ];
  DocVersionColumns: KTColumns[] = [
    {
      property: 'id',
      displayText: 'Id',
      dataType: 'n',
    },
    { property: 'versionNumber', displayText: 'No', dataType: 's' },
    {
      property: 'createdAt',
      displayText: 'Created At',
      dataType: 'd',
    },
  ];
  selectedDoc = signal<Documento>({} as Documento);
  _selectedVersions = signal<DocVersion[]>([]);
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
  docButtons: KTButtons[] = [];
  docVersionsButtons: KTButtons[] = [];
  selectedVersions: { [docId: number]: DocVersion } = {};
  OnDocTableButtonClick(event: KTButtonClickEvent<Documento>) {
    switch (event.actionName) {
      case 'view':
        this.router.navigate(['documents', event.element.id]);
        break;
      case 'edit':
        this.editDoc(event.element);
        break;
      case 'del':
        this.deleteDoc(event.element);
        break;
      case 'addVersions':
        this.addEditVersion(event.element, 'add');
        break;
    }
  }
  OnDocVersionTableButtonClick(event: KTButtonClickEvent<DocVersion>) {
    this.saveSelectedVersion(this.selectedDoc().id, event.element);
    switch (event.actionName) {
      case 'design':
        this.router.navigate([
          'documents',
          this.selectedDoc().id,
          'versions',
          event.element.id,
        ]);
        break;
      case 'edit':
        this.addEditVersion(this.selectedDoc(), 'edit');
        break;
      case 'del':
        this.DeleteVersion(this.selectedDoc().id);
        break;
      case 'pdf':
        window.open(
          `${environment.apiDomain}/${
            event.element.roles.filter(
              (r) => r.role?.name === this.AuthService.currentUser().roles[0]
            )[0].pdFfilePath
          }`,
          '_blank'
        );
        break;
    }
  }
  ngOnInit() {
    this.docsService.getAllSubsciption(DocumentsApi.getAll());

    if (this.AuthService.isAdminOrAnalyst()) {
      this.setDocButtons();
      this.setDocVersionsButtons();
    }
    if (this.AuthService.isloggedIn())
      this.docVersionsButtons.unshift({
        name: 'pdf',
        actionName: 'pdf',
        color: 'primary',
        icon: 'picture_as_pdf',
        disabled: (ele: DocVersion) =>
          ele?.roles.filter(
            (r) => r.role?.name === this.AuthService.currentUser().roles[0]
          )[0].pdFfilePath == '',
      });
  }

  deleteDoc(documento: Documento) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.docsService.Delete(DocumentsApi.delete(documento.id));
        this._selectedVersions.set([]);
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
    this.selectedVersions[docId] = version;
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
            docs
              .find((doc) => doc.id === docId)
              ?.docVersions.filter(
                (version) => version.id !== this.selectedVersions[docId].id
              );
            this.docsService.getAllRes.update(() => {
              return docs;
            });
            this.selectedDoc.update((doc) => {
              doc.docVersions = doc.docVersions.filter(
                (version) => version.id !== this.selectedVersions[docId].id
              );
              return doc;
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
            this.docsService.getAllSubsciption(DocumentsApi.getAll());
          });
      }
    });
  }

  private AddDocVeriosn(docId: number, response: any) {
    this.docsService.getAllRes.update((docs) => {
      let doc = docs.find((doc) => doc.id === docId);
      doc?.docVersions.push(response);
      this._selectedVersions.set([...(doc?.docVersions as DocVersion[])]);
      this.selectedDoc.set(doc!);
      return docs;
    });
  }

  private UpdateDocVersion(docId: number, response: any) {
    this.docsService.getAllRes.update((docs) => {
      let i = docs
        .find((doc) => doc.id === docId)
        ?.docVersions.findIndex(
          (version) => version.id === this.selectedVersions[docId].id
        );
      let doc = docs.find((doc) => doc.id === docId);
      doc?.docVersions.splice(i!, 1, response as DocVersion);
      this._selectedVersions.set([...(doc?.docVersions as DocVersion[])]);
      return docs;
    });
    this.selectedVersions[docId] = response;
  }
  private removeDocVersion(docId: number) {
    this.docsService.getAllRes.update((docs) => {
      let doc = docs.find((doc) => doc.id === docId);
      let i = doc?.docVersions.findIndex(
        (version) => version.id === this.selectedVersions[docId].id
      );
      doc?.docVersions.splice(i!, 1);
      this._selectedVersions.set([...(doc?.docVersions as DocVersion[])]);
      return docs;
    });
  }
  private setDocButtons() {
    this.docButtons = [...this.Buttons];

    this.docButtons.unshift({
      name: 'veiw',
      actionName: 'view',
      color: 'primary',
      icon: 'open_in_new',
    });
    this.docButtons.unshift({
      color: 'primary',
      actionName: 'addVersions',
      name: 'addVersion',
      icon: 'add_circle',
    });
  }

  private setDocVersionsButtons() {
    this.docVersionsButtons = [...this.Buttons];
    this.docVersionsButtons.unshift({
      name: 'design',
      actionName: 'design',
      color: 'primary',
      icon: 'design_services',
    });
  }
}
