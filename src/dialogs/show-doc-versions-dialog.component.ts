import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogActions,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { DocVersion, Documento } from '../Models/models';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '../environments/environment.development';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-show-doc-versions-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
    MatSelectModule,
    MatButtonModule,
  ],
  template: `<h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content class="mat-typography">
      <mat-select
        placeholder="Select Version"
        (selectionChange)="selectedVersion = $event.value"
      >
        @for(version of data.docVersions; track version.id){
        <mat-option [value]="version">
          {{ version.versionNumber }}
        </mat-option>
        }
      </mat-select>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="warn" (click)="dialogRef.close()">
        Cancel
      </button>
      <button
        mat-raised-button
        color="primary"
        (click)="OpenPdf()"
        cdkFocusInitial
      >
        Open
      </button>
    </mat-dialog-actions>`,
  styles: [],
})
export class ShowDocVersionsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ShowDocVersionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Documento
  ) {}
  selectedVersion: DocVersion = new DocVersion();

  OpenPdf() {
    // window.open(
    //   `${environment.apiDomain}/${this.selectedVersion.pdFfilePath}`,
    //   '_blank'
    // );
  }
}
