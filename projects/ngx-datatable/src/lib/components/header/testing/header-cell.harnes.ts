import { ComponentHarness } from '@angular/cdk/testing';

export class HeaderCellHarness extends ComponentHarness {
  static readonly hostSelector = 'datatable-header-cell';

  private cellLabel = this.locatorForOptional('.datatable-header-cell-label');
  private cellWrapper = this.locatorFor('.datatable-header-cell-template-wrap');
  private cellResizeHandle = this.locatorForOptional('.resize-handle');
  private cellCheckbox = this.locatorForOptional('.datatable-checkbox');
  private sortBtn = this.locatorForOptional('.sort-btn');
  private customSortButton = this.locatorForOptional('.custom-sort-button');

  async getHeaderCellText(): Promise<string> {
    const label = await this.cellLabel();
    const wrapperText = await (await this.cellWrapper()).text();
    return label?.text() ?? wrapperText;
  }

  async hasResizeHandle(): Promise<boolean> {
    const resizeHandle = await this.cellResizeHandle();
    return !!resizeHandle;
  }

  async resizeCell(): Promise<void> {
    const resizeHandle = await this.cellResizeHandle();
    if (resizeHandle) {
      await resizeHandle.dispatchEvent('mousedown', { clientX: 0, screenX: 0 });
      const mouseMove = new MouseEvent('mousemove', { clientX: 100, screenX: 100 });
      document.dispatchEvent(mouseMove);
      const mouseUp = new MouseEvent('mouseup');
      document.dispatchEvent(mouseUp);
    }
  }

  async selectAllRows(): Promise<void> {
    const checkbox = await this.cellCheckbox();
    if (checkbox && !(await checkbox.getProperty('checked'))) {
      await checkbox.click();
    }
  }

  async applySort(withKeyboard = false): Promise<void> {
    const sortButton = await this.sortBtn();
    if (sortButton && !withKeyboard) {
      await sortButton.click();
    } else {
      (await this.host()).dispatchEvent('keydown', {
        key: 'Enter'
      });
    }
  }

  async getSortDirection(): Promise<string | undefined> {
    const sortButton = await this.sortBtn();
    if (sortButton) {
      const isAscending = await sortButton.hasClass('sort-asc');
      const isDescending = await sortButton.hasClass('sort-desc');
      return isAscending ? 'asc' : isDescending ? 'desc' : undefined;
    }
    return undefined;
  }

  async cellWidth(): Promise<number> {
    const hostElement = await this.host();
    const width = await hostElement.getProperty('offsetWidth');
    return width ?? 0;
  }

  async clickCustomSortButton(): Promise<void> {
    const button = await this.customSortButton();
    if (button) {
      await button.click();
    }
  }
}
