import { Component } from '@angular/core';
import { ColumnMode, SelectionType } from 'projects/ngx-datatable/src/public-api';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'disabled-rows-demo',
  template: `
    <div>
      <h3>
        Disable Row
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/master/src/app/rows/disabled-rows.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <div>
        <ngx-datatable
          class="material"
          [rows]="rows"
          columnMode="force"
          [headerHeight]="50"
          [footerHeight]="0"
          [rowHeight]="50"
          [scrollbarV]="true"
          [checkRowDisabled]="isRowDisabled"
        >
          <ngx-datatable-column  name="Name">
          <ng-template let-value="value" ngx-datatable-cell-template>
          {{value}}
          </ng-template>
          </ngx-datatable-column>
          <ngx-datatable-column name="Gender">
            <ng-template let-value="value" let-rowIndex="rowIndex"
            let-row="row" let-updateRowState$="updateRowState$" ngx-datatable-cell-template>
              <select [style.height]="'auto'" (change)="updateValue($event, 'gender', rowIndex, updateRowState$)"
               [disabled]="updateRowState$ ? (updateRowState$ | async) : false" [style.margin]="0">
                <option>Male </option>
                <option [selected]="value==='female'">Female</option>
              </select>
            </ng-template>
          </ngx-datatable-column>
          <ngx-datatable-column name="Age">
            <ng-template let-row="row" let-updateRowState$="updateRowState$" let-rowIndex="rowIndex"
            let-value="value" ngx-datatable-cell-template>
              <input (blur)="updateValue($event, 'age', rowIndex, updateRowState$)"
              [disabled]="updateRowState$ ? (updateRowState$ | async) : false" [value]="value" />
            </ng-template>
          </ngx-datatable-column>
        </ngx-datatable>
      </div>
    </div>
  `
})
export class DisabledRowsComponent {
  rows = [];

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor() {
    this.fetch(data => {
      this.rows = data;
    });
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/100k.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  isRowDisabled(row: any) {
    console.log('called');
    if (row.age < 40) {
      return false;
    } else {
      return true;
    }
  }

  updateValue(event, cell, rowIndex, checkDisableRow$) {
    console.log('inline editing rowIndex', rowIndex);
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    console.log('UPDATED!', this.rows[rowIndex][cell]);
    if (checkDisableRow$ && cell === 'age' && this.rows[rowIndex][cell] > 50) {
      checkDisableRow$.next(true);
    }
  }
}
