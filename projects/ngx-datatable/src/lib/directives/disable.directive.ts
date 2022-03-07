import { AfterContentInit, Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';

/**
 * Row Disable Directive
 *
 */
@Directive({ selector: '[disable]' })
export class DisableDirective implements AfterContentInit {
  @Input() disabled;
  constructor(private element: ElementRef, private zone: NgZone) {}

  ngAfterContentInit(): void {
    if (!this.disabled) {
      return;
    }
    const el = this.element.nativeElement.parentElement;
    el.innerHTML += '';
    Array.from(el.children as HTMLAllCollection).forEach(child => {
      console.log(child);
      child?.setAttribute('disabled', '');
    });
    console.log(el);
  }
}
