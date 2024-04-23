import { DatePipe, JsonPipe } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonSignalsService } from '../services/common-signals.service';

export type KTColumns = {
  property: string;
  displayText: string;
  dataType?: 'd' | 'n' | 's' | 'b' | 'counted' | 'changeValue' | 'map' | 'btn';
  disabled?: (element: any) => boolean;
  icon?: string;
  changeValue?: { [key: string]: string };
  color?: 'warn' | 'primary';
  mapFun?: (element: any) => any;
  actionName?: string;
};
export type KTButtons = {
  name: string;
  icon?: string;
  color: 'warn' | 'primary';
  actionName: string;
  propertyToCheck?: string;
  disabled?: (element: any) => boolean;
};
export type KTButtonClickEvent<T> = {
  element: T;
  actionName: string;
};
@Component({
  selector: 'k-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    DatePipe,
    MatIconButton,
    MatIconModule,
    MatCheckboxModule,
    JsonPipe,
  ],
  template: `
    <table mat-table [dataSource]="dataSource()" class="mat-elevation-z8">
      @for (col of columns(); track col) {
      <!-- Checkbox Column -->
      @if (col.property == 'select') {

      <ng-container [matColumnDef]="col.property">
        <th mat-header-cell *matHeaderCellDef>
          <!-- <mat-checkbox
            (change)="$event ? toggleAllRows() : null"
            [checked]="selection.hasValue() && isAllSelected()"
            [indeterminate]="selection.hasValue() && !isAllSelected()"
            [aria-label]="checkboxLabel()"
          >
          </mat-checkbox> -->
        </th>
        <td mat-cell *matCellDef="let row">
          <mat-checkbox
            (click)="$event.stopPropagation()"
            (change)="selectedRows($event, row)"
            [checked]="selection().isSelected(row)"
            [aria-label]="checkboxLabel(row)"
          >
          </mat-checkbox>
        </td>
      </ng-container>
      }@else{
      <ng-container [matColumnDef]="col.property">
        <th mat-header-cell *matHeaderCellDef>{{ col.displayText }}</th>
        <td
          mat-cell
          *matCellDef="let element"
          (click)="OnRowClick.emit(element)"
        >
          @switch (col.dataType) {
          <!-- date -->
          @case ('d') {
          {{ element[col.property] | date }}
          }
          <!-- counted -->
          @case ('counted') {
          {{ element[col.property].length }}
          }
          <!-- chanveValue -->
          @case('changeValue'){

          {{ col?.changeValue?.[element[col.property]] }}
          }
          <!-- chanveValue -->
          @case('map'){

          {{ mapFunc(element[col.property], col.mapFun!) }}
          } @case('btn'){
          <button
            [disabled]="col?.disabled(element[col.property])"
            mat-icon-button
            (click)="OnClick(element, col.actionName!)"
            [color]="col.color"
          >
            <mat-icon [fontIcon]="col.icon!"></mat-icon>
          </button>
          }
          <!-- date -->
          @default {
          {{ element[col.property] }}
          }
          <!-- date -->

          }
        </td>
      </ng-container>
      } }@for (b of Buttons(); track b) {
      <ng-container [matColumnDef]="b.name">
        <!-- <pre>{{ Buttons() | json }}</pre> -->
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let element">
          @if(b.icon != undefined){
          <button
            [disabled]="b.disabled && b.disabled(element)"
            mat-icon-button
            (click)="OnClick(element, b.actionName)"
            [color]="b.color"
          >
            <mat-icon [fontIcon]="b.icon"></mat-icon>
          </button>
          } @else {
          <button
            [disabled]="b.disabled && b.disabled(element)"
            mat-button
            (click)="OnClick(element, b.actionName)"
            color="primary"
          >
            {{ b.name.charAt(0).toUpperCase() + b.name.slice(1) }}
          </button>
          }
        </td>
      </ng-container>
      }
      <tr mat-header-row *matHeaderRowDef="cols()"></tr>
      <tr mat-row *matRowDef="let row; columns: cols()"></tr>
    </table>
  `,
  styles: [
    `
      :host {
        margin-bottom: 20px;
        display: block;
      }
    `,
  ],
})
export class KTableComponent<T> {
  columns = input.required<KTColumns[]>();
  dataSource = input.required<T[]>();
  trackByProperty = input.required<string>();
  Buttons = input<KTButtons[]>([]);
  selected_Rows = input<T[]>([]);
  commonsService = inject(CommonSignalsService);
  selection = computed(() => new SelectionModel<T>(true, this.selected_Rows()));

  OnButtonClick = output<KTButtonClickEvent<T>>();

  cols = computed(() => {
    let columns = this.columns().map((col) => col.property);

    let buttonCols = this.Buttons().map((btn) => btn.name);

    return columns.concat(buttonCols);
  });

  _columns = computed(() => {
    let buttonCols = this.Buttons().map((btn) => ({
      property: 'isUsing' + btn.name,
      displayText: '',
    }));
    return this.columns().concat(buttonCols);
  });
  OnRowClick = output<T>();
  onSelectedRows = output<T[]>();
  OnClick(element: T, actionName: string) {
    this.OnButtonClick.emit({ element, actionName });
  }
  selectedRows(event: MatCheckboxChange, row: T) {
    if (event) {
      this.selection().toggle(row);
      this.onSelectedRows.emit(this.selection().selected);
    }
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection().selected.length;
    const numRows = this.dataSource().length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection().clear();
      return;
    }

    this.selection().select(...this.dataSource());
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: T): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection().isSelected(row) ? 'deselect' : 'select'} row ${
      row['id' as keyof object] + 1
    }`;
  }
  mapFunc<T, U>(element: Iterable<T>, func: (item: T) => U) {
    return Array.from(element).map(func);
  }
}
