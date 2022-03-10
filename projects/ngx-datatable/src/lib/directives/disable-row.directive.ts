import { AfterContentInit, Directive, ElementRef, Input } from '@angular/core';

/**
 * Row Disable Directive
 *
 */
@Directive({ selector: '[disable-row]' })
export class DisableRowDirective {

  private _disabled = false;
  @Input() set disabled(val: boolean){
    this._disabled = val;
    if (val) {
      this.disableAllElements();
    }
  };

  get disabled() {
    return this._disabled;
  }

  constructor(private element: ElementRef) {}

  disableAllElements() {
    const el = this.element?.nativeElement;
    if (!el) {
      return;
    }
    Array.from(el.querySelectorAll('*') as HTMLAllCollection).forEach(child => {
      child?.setAttribute('disabled', '');
    });
  }
}
