import { Component, OnInit, inject, signal } from '@angular/core';
import {
  KTButtonClickEvent,
  KTButtons,
  KTColumns,
  KTableComponent,
} from '../Generic components/k-table.component';
import { MatButtonModule } from '@angular/material/button';
import { GenericService } from '../services/generic.service';
import { MatDialog } from '@angular/material/dialog';
import { DocFamily, DocFamilyViewModel } from '../Models/models';
import { Router } from '@angular/router';
import { DITATOPIC_SERVICE, FAMILY_SERVICE } from '../services/servicesTokens';
import { AuthService } from '../services/auth.service';
import { FamilyDialogComponent } from '../dialogs/family-dialog.component';
import { DitaTopicsApi, DocFamilyApi } from '../Models/Api';
import { ConfirmationDialogComponent } from '../dialogs/confirmation-dialog.component';
import { FamilyDitaTopicDialogComponent } from '../dialogs/family-dita-topic-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [KTableComponent, MatButtonModule],
  providers: [
    GenericService<DocFamily | DocFamilyViewModel, DocFamily>,
    MatDialog,
  ],
  template: `
    @if(this.AuthService.isloggedIn() && this.AuthService.isAdminOrAnalyst()) {
    <div class="btn-align-end">
      <button mat-raised-button color="primary" (click)="AddUpdateFamily()">
        Add Family
      </button>
    </div>
    }
    <k-table
      [columns]="FamilyColumns"
      [dataSource]="this.familyService.getAllRes()"
      [trackByProperty]="'id'"
      [Buttons]="Buttons"
      (OnButtonClick)="onFamilyTableButtonsClick($event)"
    />
  `,
  host: { class: 'margin-block d-block' },
  styles: [],
})
export class FamilyComponent implements OnInit {
  ngOnInit(): void {
    this.familyService.getAllSubsciption(DocFamilyApi.getAll());
  }
  title = 'DitaTopic';
  familyService = inject(FAMILY_SERVICE);
  ditaTopicService = inject(DITATOPIC_SERVICE);
  AuthService = inject(AuthService);
  router = inject(Router);
  dialog = inject(MatDialog);
  FamilyColumns: KTColumns[] = [
    {
      property: 'id',
      displayText: 'Id',
      dataType: 'n',
    },
    { property: 'title', displayText: 'Title', dataType: 's' },
    {
      property: 'description',
      displayText: 'Description',
    },
    {
      property: 'documentos',
      displayText: 'No. of Docs',
      dataType: 'counted',
    },
    {
      property: 'ditaTopics',
      displayText: 'No. of Ditatopics',
      dataType: 'counted',
    },
  ];

  selectedFamily = signal<DocFamily>({} as DocFamily);
  // _selectedVersions = signal<DocVersion[]>([]);
  Buttons: KTButtons[] = [
    {
      name: 'Open Dt',
      actionName: 'opendt',
      color: 'primary',
    },
    {
      name: 'add',
      actionName: 'add',
      color: 'primary',
      icon: 'add_circle',
    },
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
  AddUpdateFamily(family: DocFamily | null = null) {
    const dialogRef = this.dialog.open(FamilyDialogComponent, {
      data: { family: family },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        if (family == null)
          this.familyService.postSubsciption(DocFamilyApi.create(), result);
        else
          this.familyService.putSubsciption(
            DocFamilyApi.update(family.id),
            result
          );
      }
      this.gerAllFamily();
    });
  }

  onFamilyTableButtonsClick(event: KTButtonClickEvent<DocFamily>) {
    switch (event.actionName) {
      case 'edit':
        this.AddUpdateFamily(event.element);
        break;
      case 'del':
        this.deleteFamily(event.element);
        break;
      case 'view':
        this.router.navigate(['docfamilies', event.element.id]);
        break;
      case 'add':
        this.AddDitaTopic(event.element);
        break;
      case 'opendt':
        this.router.navigate(['docfamilies', event.element.id, 'dts']);
        break;
    }
  }
  deleteFamily(family: DocFamily) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.familyService.Delete(DocFamilyApi.delete(family.id));
      }
    });
  }

  AddDitaTopic(family: DocFamily) {
    let action = family.ditaTopics.length == 0 ? 'add' : 'edit';

    const dialogRef = this.dialog.open(FamilyDitaTopicDialogComponent, {
      data: {
        action: action,
        family: family,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        if (action == 'add') {
          this.ditaTopicService.postSubsciption(DitaTopicsApi.create(), result);
        } else {
          this.ditaTopicService.putSubsciption(
            DitaTopicsApi.updateMany(),
            result
          );
        }
        this.gerAllFamily();
      }
    });
  }
  gerAllFamily() {
    setTimeout(() => {
      this.familyService.getAllSubsciption(DocFamilyApi.getAll());
    }, 500);
  }
}
