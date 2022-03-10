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
          [rowHeight]="80"
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
            let-row="row" let-disableRow$="disableRow$" ngx-datatable-cell-template>
              <select [style.height]="'auto'" [value]="value" (change)="updateValue($event, 'gender', rowIndex, disableRow$)"
               [disabled]="disableRow$ ? (disableRow$ | async) : false" [style.margin]="0">
               <option value="male">Male</option>
               <option value="female">Female</option>
              </select>
            </ng-template>
          </ngx-datatable-column>
          <ngx-datatable-column name="Age">
            <ng-template let-row="row" let-disableRow$="disableRow$" let-rowIndex="rowIndex"
            let-value="value" ngx-datatable-cell-template>
            <div [disabled]="disableRow$ | async" disable-row>
              <input (blur)="updateValue($event, 'age', rowIndex, disableRow$)"
              [value]="value" />
              <br/>
              <input (blur)="updateValue($event, 'age', rowIndex, disableRow$)"
              [disabled]="disableRow$ ? (disableRow$ | async) : false" [value]="value" />
            </div>
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
    if (row.age < 40) {
      return false;
    } else {
      return true;
    }
  }

  updateValue(event, cell, rowIndex, checkDisableRow$) {
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    if (checkDisableRow$ && cell === 'age' && this.rows[rowIndex][cell] > 40) {
      checkDisableRow$.next(true);
    }
  }
}
