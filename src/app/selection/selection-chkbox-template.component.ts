import { Component, inject } from '@angular/core';
import {
  ActivateEvent,
  ColumnMode,
  DataTableColumnCellDirective,
  DataTableColumnDirective,
  DataTableColumnHeaderDirective,
  DatatableComponent,
  SelectEvent,
  SelectionType
} from 'projects/ngx-datatable/src/public-api';
import { Employee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'chkbox-selection-template-demo',
  template: `
    <div>
      <h3>
        Custom Checkbox Selection
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/master/src/app/selection/selection-chkbox-template.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
        <small>
          <a href="javascript:void(0)" (click)="add()">Add</a> |
          <a href="javascript:void(0)" (click)="update()">Update</a> |
          <a href="javascript:void(0)" (click)="remove()">Remove</a>
        </small>
      </h3>
      <div style="float:left;width:75%">
        <ngx-datatable
          style="width: 90%"
          class="material selection-row"
          [rows]="rows"
          [columnMode]="ColumnMode.force"
          [headerHeight]="50"
          [footerHeight]="50"
          rowHeight="auto"
          [limit]="5"
          [selected]="selected"
          [selectionType]="SelectionType.checkbox"
          (activate)="onActivate($event)"
          (select)="onSelect($event)"
        >
          <ngx-datatable-column
            [width]="30"
            [sortable]="false"
            [canAutoResize]="false"
            [draggable]="false"
            [resizeable]="false"
          >
            <ng-template
              ngx-datatable-header-template
              let-allRowsSelected="allRowsSelected"
              let-selectFn="selectFn"
            >
              <input type="checkbox" [checked]="allRowsSelected" (change)="selectFn()" />
            </ng-template>
            <ng-template
              ngx-datatable-cell-template
              let-value="value"
              let-isSelected="isSelected"
              let-onCheckboxChangeFn="onCheckboxChangeFn"
            >
              <input type="checkbox" [checked]="isSelected" (change)="onCheckboxChangeFn($event)" />
            </ng-template>
          </ngx-datatable-column>
          <ngx-datatable-column name="Name"></ngx-datatable-column>
          <ngx-datatable-column name="Gender"></ngx-datatable-column>
          <ngx-datatable-column name="Company"></ngx-datatable-column>
        </ngx-datatable>
      </div>

      <div class="selected-column">
        <h4>
          Selections <small>({{ selected?.length }})</small>
        </h4>
        <ul>
          @for (sel of selected; track sel) {
            <li>
              {{ sel.name }}
            </li>
          }
          @if (!selected?.length) {
            <li>No Selections</li>
          }
        </ul>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    DatatableComponent,
    DataTableColumnDirective,
    DataTableColumnHeaderDirective,
    DataTableColumnCellDirective
  ]
})
export class CustomCheckboxSelectionComponent {
  rows: Employee[] = [];
  selected: Employee[] = [];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  private dataService = inject(DataService);

  constructor() {
    this.dataService.load('company.json').subscribe(data => {
      this.rows = data;
    });
  }

  onSelect({ selected }: SelectEvent<Employee>) {
    console.log('Select Event', selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event: ActivateEvent<Employee>) {
    console.log('Activate Event', event);
  }

  add() {
    this.selected.push(this.rows[1], this.rows[3]);
  }

  update() {
    this.selected = [this.rows[1], this.rows[3]];
  }

  remove() {
    this.selected = [];
  }
}
