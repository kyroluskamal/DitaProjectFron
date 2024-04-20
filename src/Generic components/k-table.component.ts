import { DatePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
export type KTColumns = {
  property: string;
  displayText: string;
  dataType?: 'd' | 'n' | 's' | 'b' | 'counted' | 'changeValue';
  changeValue?: { [key: string]: string };
};
export type KTButtons = {
  name: string;
  icon?: string;
  color: 'warn' | 'primary';
  actionName: string;
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
  ],
  template: `
    <table mat-table [dataSource]="dataSource()" class="mat-elevation-z8">
      @for (col of columns(); track col) {
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
          <!-- date -->
          @default {
          {{ element[col.property] }}
          }
          <!-- date -->

          }
        </td>
      </ng-container>
      }@for (b of Buttons(); track b) {
      <ng-container [matColumnDef]="b.name">
        <!-- <pre>{{ Buttons() | json }}</pre> -->
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let element">
          @if(b.icon != undefined){
          <button
            mat-icon-button
            (click)="OnClick(element, b.actionName)"
            [color]="b.color"
          >
            <mat-icon [fontIcon]="b.icon"></mat-icon>
          </button>
          } @else {
          <button
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

  OnClick(element: T, actionName: string) {
    this.OnButtonClick.emit({ element, actionName });
  }
}
