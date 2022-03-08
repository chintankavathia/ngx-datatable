import { AfterContentChecked, Directive, ElementRef, Input } from '@angular/core';

/**
 * Row Disable Directive
 *
 */
@Directive({ selector: '[disable-row]' })
export class DisableRowDirective implements AfterContentChecked {
  @Input() disabled;
  constructor(private element: ElementRef) {}

  ngAfterContentChecked(): void {
    const el = this.element.nativeElement.parentElement;
    const parent = el.parentElement;
    if (!this.disabled || !el || !parent) {
      return;
    }
    Array.from(el.children as HTMLAllCollection).forEach(child => {
      child?.setAttribute('disabled', '');
    });
  }
}
