import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ColumnMode, TableColumn } from 'projects/ngx-datatable/src/public-api';
import { Employee } from "../data.model";

@Component({
  selector: 'template-ref-demo',
  template: `
    <div>
      <h3>
        TemplateRef via Column Property
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/master/src/app/templates/template-obj.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        class="material"
        [rows]="rows"
        [columns]="columns"
        [columnMode]="ColumnMode.force"
        [headerHeight]="50"
        [footerHeight]="50"
        rowHeight="auto"
      >
      </ngx-datatable>

      <ng-template #hdrTpl let-column="column"> <strong>Fancy</strong>: {{ column.name }} !! </ng-template>

      <ng-template #editTmpl let-row="row" let-value="value">
        <img *ngIf="value === 'male'" width="150" src="https://media.giphy.com/media/I8nepxWwlEuqI/giphy.gif" />
        <img *ngIf="value === 'female'" width="150" src="https://media.giphy.com/media/sxSVG3XHf7yww/giphy.gif" />
      </ng-template>
    </div>
  `
})
export class TemplateRefTemplatesComponent implements OnInit {
  @ViewChild('editTmpl', { static: true }) editTmpl: TemplateRef<any>;
  @ViewChild('hdrTpl', { static: true }) hdrTpl: TemplateRef<any>;

  rows: Employee[] = [];
  columns: TableColumn[] = [];

  ColumnMode = ColumnMode;

  constructor() {
    this.fetch(data => {
      this.rows = data.splice(0, 5);
    });
  }

  ngOnInit() {
    this.columns = [
      {
        cellTemplate: this.editTmpl,
        headerTemplate: this.hdrTpl,
        name: 'Gender'
      }
    ];
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/company.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }
}
