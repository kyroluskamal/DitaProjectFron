import { Component, Inject, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KTableComponent } from '../Generic components/k-table.component';
import { GenericServiceService } from '../services/generic-service.service';
import { Documento } from '../Models/models';
import { environment } from '../environments/environment.development';
import { MatDialog } from '@angular/material/dialog';
import { ShowDocVersionsDialogComponent } from '../dialogs/show-doc-versions-dialog.component';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { AddDocDialogComponent } from '../dialogs/add-doc-dialog.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, KTableComponent, MatButtonModule],
  providers: [GenericServiceService<Documento>, MatDialog],
  // templateUrl: './app.component.html',
  template: ` <div class="btn-align-end">
      <button mat-raised-button color="primary" (click)="AddDocument()">
        Add Document
      </button>
      <button mat-raised-button color="primary">Add Dita Topic</button>
    </div>
    <k-table
      [columns]="colums"
      [dataSource]="this.docsService.getAllRes()"
      [trackByProperty]="'id'"
      [Buttons]="{ view: true, edit: true, Delete: true }"
      (OnViewClick)="openDialog($event)"
      (OnDeleteClick)="deleteDoc($event)"
    ></k-table>`,
  host: { class: 'margin-block d-block' },
  styles: [],
})
export class DocumentsComponent {
  title = 'DitaTopic';
  docsService = inject(GenericServiceService<Documento>);
  dialog = inject(MatDialog);
  colums = [
    { property: 'id', displayText: 'No.' },
    { property: 'title', displayText: 'Title' },
  ];

  ngOnInit() {
    this.docsService.getAllSubsciption(`${environment.apiUrl}/Documents`);
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
        this.docsService.Delete(
          `${environment.apiUrl}/Documents/${documento.id}`
        );
      }
    });
  }

  AddDocument() {
    const dialogRed = this.dialog.open(AddDocDialogComponent, {
      width: '40vw',
    });

    dialogRed.afterClosed().subscribe((result) => {
      if (result) {
        this.docsService.postSubsciption(
          `${environment.apiUrl}/Documents`,
          result
        );
      }
    });
  }
}
