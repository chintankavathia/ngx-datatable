import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PagerPageEvent } from '../../types/public.types';
import { Page } from '../../types/internal.types';

@Component({
  selector: 'datatable-pager',
  template: `
    <ul class="pager">
      <li [class.disabled]="!canPrevious()">
        <a role="button" aria-label="go to first page" (click)="selectPage(1)">
          <i class="{{ pagerPreviousIcon ?? 'datatable-icon-prev' }}"></i>
        </a>
      </li>
      <li [class.disabled]="!canPrevious()">
        <a role="button" aria-label="go to previous page" (click)="prevPage()">
          <i class="{{ pagerLeftArrowIcon ?? 'datatable-icon-left' }}"></i>
        </a>
      </li>
      @for (pg of pages; track pg.number) {
        <li
          [attr.aria-label]="'page ' + pg.number"
          class="pages"
          [class.active]="pg.number === page"
        >
          <a role="button" (click)="selectPage(pg.number)">
            {{ pg.text }}
          </a>
        </li>
      }
      <li [class.disabled]="!canNext()">
        <a role="button" aria-label="go to next page" (click)="nextPage()">
          <i class="{{ pagerRightArrowIcon ?? 'datatable-icon-right' }}"></i>
        </a>
      </li>
      <li [class.disabled]="!canNext()">
        <a role="button" aria-label="go to last page" (click)="selectPage(totalPages)">
          <i class="{{ pagerNextIcon ?? 'datatable-icon-skip' }}"></i>
        </a>
      </li>
    </ul>
  `,
  host: {
    class: 'datatable-pager'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class DataTablePagerComponent {
  @Input() pagerLeftArrowIcon?: string;
  @Input() pagerRightArrowIcon?: string;
  @Input() pagerPreviousIcon?: string;
  @Input() pagerNextIcon?: string;

  @Input()
  set size(val: number) {
    this._size = val;
    this.pages = this.calcPages();
  }

  get size(): number {
    return this._size;
  }

  @Input()
  set count(val: number) {
    this._count = val;
    this.pages = this.calcPages();
  }

  get count(): number {
    return this._count;
  }

  @Input()
  set page(val: number) {
    this._page = val;
    this.pages = this.calcPages();
  }

  get page(): number {
    return this._page;
  }

  get totalPages(): number {
    const count = this.size < 1 ? 1 : Math.ceil(this.count / this.size);
    return Math.max(count || 0, 1);
  }

  @Output() change: EventEmitter<PagerPageEvent> = new EventEmitter();

  _count = 0;
  _page = 1;
  _size = 0;
  pages: Page[];

  canPrevious(): boolean {
    return this.page > 1;
  }

  canNext(): boolean {
    return this.page < this.totalPages;
  }

  prevPage(): void {
    this.selectPage(this.page - 1);
  }

  nextPage(): void {
    this.selectPage(this.page + 1);
  }

  selectPage(page: number): void {
    if (page > 0 && page <= this.totalPages && page !== this.page) {
      this.page = page;

      this.change.emit({
        page
      });
    }
  }

  calcPages(page?: number): Page[] {
    const pages: Page[] = [];
    let startPage = 1;
    let endPage = this.totalPages;
    const maxSize = 5;
    const isMaxSized = maxSize < this.totalPages;

    page = page || this.page;

    if (isMaxSized) {
      startPage = page - Math.floor(maxSize / 2);
      endPage = page + Math.floor(maxSize / 2);

      if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(startPage + maxSize - 1, this.totalPages);
      } else if (endPage > this.totalPages) {
        startPage = Math.max(this.totalPages - maxSize + 1, 1);
        endPage = this.totalPages;
      }
    }

    for (let num = startPage; num <= endPage; num++) {
      pages.push({
        // eslint-disable-next-line id-blacklist
        number: num,
        text: num.toString()
      });
    }

    return pages;
  }
}
