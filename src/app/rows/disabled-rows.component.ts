import { Component } from '@angular/core';
import { ColumnMode, SelectionType } from 'projects/ngx-datatable/src/public-api';

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
            <ng-template let-value="value" ngx-datatable-cell-template>
              <select [style.height]="'auto'" [style.margin]="0">
                <option>Male</option>
                <option [selected]="value==='female'">Female</option>
              </select>
            </ng-template>
          </ngx-datatable-column>
          <ngx-datatable-column name="Age">
            <ng-template let-value="value" ngx-datatable-cell-template>
              <input [value]="value" />
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

  isRowDisabled(row) {
    if (row.age < 40) {
      return false;
    } else {
      return true;
    }
  }
}
