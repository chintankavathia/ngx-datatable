import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectionType } from '../../types/selection.type';
import { selectRows, selectRowsBetween } from '../../utils/selection';
import { Keys } from '../../utils/keys';

export interface Model {
  type: string;
  event: MouseEvent | KeyboardEvent;
  row: any;
  rowElement: any;
  cellElement: any;
  cellIndex: number;
  colGroup: string;
}

@Component({
  selector: 'datatable-selection',
  template: ` <ng-content></ng-content> `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableSelectionComponent {
  @Input() rows: any[];
  @Input() selected: any[];
  @Input() selectEnabled: boolean;
  @Input() selectionType: SelectionType;
  @Input() rowIdentity: any;
  @Input() selectCheck: any;
  @Input() disableCheck: any;
  @Input() groupedRows: any[];

  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() select: EventEmitter<any> = new EventEmitter();

  prevIndex: number;

  selectRow(event: KeyboardEvent | MouseEvent, index: number, row: any): void {
    if (!this.selectEnabled) {return;}

    const chkbox = this.selectionType === SelectionType.checkbox;
    const multi = this.selectionType === SelectionType.multi;
    const multiClick = this.selectionType === SelectionType.multiClick;
    let selected: any[] = [];

    if (multi || chkbox || multiClick) {
      if (event.shiftKey) {
        selected = selectRowsBetween([], this.rows, index, this.prevIndex, this.getRowSelectedIdx.bind(this));
      } else if ((event as KeyboardEvent).key === 'a' && (event.ctrlKey || event.metaKey)) {
        // select all rows except dummy rows which are added for ghostloader in case of virtual scroll
        selected = this.rows.filter(rowItem => !!rowItem);
      } else if (event.ctrlKey || event.metaKey || multiClick || chkbox) {
        selected = selectRows([...this.selected], row, this.getRowSelectedIdx.bind(this));
      } else {
        selected = selectRows([], row, this.getRowSelectedIdx.bind(this));
      }
    } else {
      selected = selectRows([], row, this.getRowSelectedIdx.bind(this));
    }

    if (typeof this.selectCheck === 'function') {
      selected = selected.filter(this.selectCheck.bind(this));
    }

    if (typeof this.disableCheck === 'function') {
      selected = selected.filter(rowData => !this.disableCheck(rowData));
    }

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);

    this.prevIndex = index;

    this.select.emit({
      selected
    });
  }

  onActivate(model: Model, index: number): void {
    const { type, event, row } = model;
    const chkbox = this.selectionType === SelectionType.checkbox;
    const select = (!chkbox && (type === 'click' || type === 'dblclick')) || (chkbox && type === 'checkbox');

    if (select) {
      this.selectRow(event, index, row);
    } else if (type === 'keydown') {
      if ((event as KeyboardEvent).keyCode === Keys.return) {
        this.selectRow(event, index, row);
      } else if ((event as KeyboardEvent).key === 'a' && (event.ctrlKey || event.metaKey)) {
        this.selectRow(event, 0, this.rows[this.rows.length - 1]);
      } else {
        this.onKeyboardFocus(model);
      }
    }
    this.activate.emit(model);
  }

  onKeyboardFocus(model: Model): void {
    const { keyCode } = model.event as KeyboardEvent;
    const shouldFocus = keyCode === Keys.up || keyCode === Keys.down || keyCode === Keys.right || keyCode === Keys.left;

    if (shouldFocus) {
      const isCellSelection = this.selectionType === SelectionType.cell;
      if (typeof this.disableCheck === 'function') {
        const isRowDisabled = this.disableCheck(model.row);
        if (isRowDisabled) {
          return;
        }
      }
      if (!model.cellElement || !isCellSelection) {
        this.focusRow(model.rowElement, keyCode);
      } else if (isCellSelection) {
        this.focusCell(model.cellElement, model.rowElement, keyCode, model.cellIndex, model.colGroup);
      }
    }
  }

  focusRow(rowElement: any, keyCode: number): void {
    const nextRowElement = this.getPrevNextRow(rowElement, keyCode);
    if (nextRowElement) {nextRowElement.focus();}
  }

  getPrevNextRow(rowElement: any, keyCode: number): any {
    const parentElement = this.groupedRows ? rowElement : rowElement.parentElement;
    if (parentElement) {
      let focusElement: HTMLElement;
      if (keyCode === Keys.up) {
        focusElement = parentElement.previousElementSibling;
      } else if (keyCode === Keys.down) {
        focusElement = parentElement.nextElementSibling;
      }
      if (this.groupedRows) {
        // In case of row grouping skip group header div
        if(focusElement && keyCode === Keys.up && !focusElement.matches('datatable-body-row')) {
          focusElement = focusElement.closest('datatable-row-wrapper')?.previousElementSibling?.lastElementChild as HTMLElement;
        }
        // If the row is last in group then jump to the first row of next group
        if(!focusElement && keyCode === Keys.down) {
          focusElement = rowElement.parentElement?.nextElementSibling?.children[1];
        }
        return focusElement;
      }
      if (focusElement && focusElement.children.length) {
        return focusElement.children[0];
      }
    }
  }

  focusCell(cellElement: any, rowElement: any, keyCode: number, cellIndex: number, colGroup: string): void {
    let nextCellElement: HTMLElement;

    if (keyCode === Keys.left) {
      nextCellElement = cellElement.previousElementSibling ?? cellElement.parentElement?.previousElementSibling?.lastElementChild;
    } else if (keyCode === Keys.right) {
      nextCellElement = cellElement.nextElementSibling ?? cellElement.parentElement?.nextElementSibling?.firstElementChild;
    } else if (keyCode === Keys.up || keyCode === Keys.down) {
      const nextRowElement = this.getPrevNextRow(rowElement, keyCode);
      if (nextRowElement) {
        // By default cells are part of div.datatable-row-center
        const selector = `.datatable-row-${colGroup ?? 'center'}`;
        const children = nextRowElement.querySelectorAll(`${selector} .datatable-body-cell`);
        if (children.length) {nextCellElement = children[cellIndex];}
      }
    }

    if (nextCellElement) {nextCellElement.focus();}
  }

  getRowSelected(row: any): boolean {
    return this.getRowSelectedIdx(row, this.selected) > -1;
  }

  getRowSelectedIdx(row: any, selected: any[]): number {
    if (!selected || !selected.length) {return -1;}

    const rowId = this.rowIdentity(row);
    return selected.findIndex(r => {
      const id = this.rowIdentity(r);
      return id === rowId;
    });
  }
}
