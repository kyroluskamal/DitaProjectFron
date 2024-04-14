import { Component, computed, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'k-table',
  standalone: true,
  imports: [MatTableModule, MatButtonModule],
  template: `
    <table mat-table [dataSource]="dataSource()" class="mat-elevation-z8">
      @for (col of columns(); track col) {
      <ng-container [matColumnDef]="col.property">
        <th mat-header-cell *matHeaderCellDef>{{ col.displayText }}</th>
        <td mat-cell *matCellDef="let element">{{ element[col.property] }}</td>
      </ng-container>
      }@for (b of buttons(); track b) {
      <ng-container [matColumnDef]="'isUsing' + b">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let element">
          <button mat-button (click)="OnClick(element, b)" color="primary">
            {{ b.charAt(0).toUpperCase() + b.slice(1) }}
          </button>
        </td>
      </ng-container>
      }
      <tr mat-header-row *matHeaderRowDef="cols()"></tr>
      <tr mat-row *matRowDef="let row; columns: cols()"></tr>
    </table>
  `,
  styles: [],
})
export class KTableComponent {
  columns = input.required<{ property: string; displayText: string }[]>();
  dataSource = input.required<any[]>();
  trackByProperty = input.required<string>();
  cols = computed(() => this.columns().map((col) => col.property));
  Buttons = input<{ Delete?: boolean; edit?: boolean; view?: boolean }>({
    Delete: false,
    edit: false,
    view: false,
  });

  OnEditClick = output<any>();
  OnViewClick = output<any>();
  OnDeleteClick = output<any>();

  buttons = computed(() => {
    let btns = Object.keys(this.Buttons()).filter(
      (key) =>
        this.Buttons()[key as keyof ReturnType<typeof this.Buttons>] === true
    );

    this.cols = signal([...this.cols(), ...btns.map((b) => 'isUsing' + b)]);
    return btns;
  });

  OnClick(element: any, button: string) {
    switch (button) {
      case 'edit':
        this.OnEditClick.emit(element);
        break;
      case 'view':
        this.OnViewClick.emit(element);
        break;
      case 'Delete':
        this.OnDeleteClick.emit(element);
        break;
    }
  }
}
