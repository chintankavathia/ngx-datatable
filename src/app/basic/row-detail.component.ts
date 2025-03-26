import { Component, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  ColumnMode,
  DataTableColumnCellDirective,
  DataTableColumnDirective,
  DatatableComponent,
  DatatableRowDetailDirective,
  DatatableRowDetailTemplateDirective,
  DetailToggleEvents,
  PageEvent
} from 'projects/ngx-datatable/src/public-api';
import { FullEmployee } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'row-details-demo',
  template: `
    <div>
      <h3>
        Row Detail Demo
        <small>
          <a
            href="https://github.com/siemens/ngx-datatable/blob/master/src/app/basic/row-detail.component.ts"
            target="_blank"
          >
            Source
          </a>
        </small>
        <small>
          <a href="javascript:void(0)" (click)="table.rowDetail.expandAllRows()">Expand All</a>
          |
          <a href="javascript:void(0)" (click)="table.rowDetail.collapseAllRows()">Collapse All</a>
        </small>
      </h3>
      <ngx-datatable
        #myTable
        class="material expandable"
        [columnMode]="ColumnMode.force"
        [headerHeight]="50"
        [footerHeight]="50"
        [rowHeight]="50"
        [scrollbarV]="true"
        [rows]="rows"
        (page)="onPage($event)"
      >
        <!-- Row Detail Template -->
        <ngx-datatable-row-detail [rowHeight]="100" #myDetailRow (toggle)="onDetailToggle($event)">
          <ng-template let-row="row" let-expanded="expanded" ngx-datatable-row-detail-template>
            <div style="padding-left:35px;">
              <div><strong>Address</strong></div>
              <div>{{ row.address.city }}, {{ row.address.state }}</div>
            </div>
          </ng-template>
        </ngx-datatable-row-detail>

        <!-- Column Templates -->
        <ngx-datatable-column
          [width]="50"
          [resizeable]="false"
          [sortable]="false"
          [draggable]="false"
          [canAutoResize]="false"
        >
          <ng-template let-row="row" let-expanded="expanded" ngx-datatable-cell-template>
            <a
              href="javascript:void(0)"
              [class.datatable-icon-right]="!expanded"
              [class.datatable-icon-down]="expanded"
              title="Expand/Collapse Row"
              (click)="toggleExpandRow(row)"
            >
            </a>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Index" [width]="80">
          <ng-template let-rowIndex="rowIndex" let-row="row" ngx-datatable-cell-template>
            <strong>{{ rowIndex }}</strong>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Expanded" [width]="80">
          <ng-template let-row="row" let-expanded="expanded" ngx-datatable-cell-template>
            <strong>{{ expanded }}</strong>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Name" [width]="200">
          <ng-template let-value="value" ngx-datatable-cell-template>
            <strong>{{ value }}</strong>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Gender" [width]="300">
          <ng-template let-row="row" let-value="value" ngx-datatable-cell-template>
            <i [innerHTML]="row['name']"></i> and <i>{{ value }}</i>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Age"></ngx-datatable-column>
      </ngx-datatable>
    </div>
  `,
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    DatatableComponent,
    DatatableRowDetailDirective,
    DatatableRowDetailTemplateDirective,
    DataTableColumnDirective,
    DataTableColumnCellDirective
  ]
})
export class RowDetailsComponent {
  @ViewChild('myTable') table: DatatableComponent<FullEmployee>;

  rows: FullEmployee[] = [];
  expanded: any = {};
  timeout: any;

  ColumnMode = ColumnMode;

  private dataService = inject(DataService);

  constructor() {
    this.dataService.load('100k.json').subscribe(data => {
      this.rows = data;
    });
  }

  onPage(event: PageEvent) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      console.log('paged!', event);
    }, 100);
  }

  toggleExpandRow(row: FullEmployee) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event: DetailToggleEvents<FullEmployee>) {
    console.log('Detail Toggled', event);
  }
}
