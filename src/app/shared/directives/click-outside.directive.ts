import { Directive, output, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[clickOutside]',
  standalone: true
})
export class ClickOutsideDirective {
  readonly clickOutside = output<void>();

  constructor(private el: ElementRef<HTMLElement>) {}

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!this.el.nativeElement.contains(target)) {
      this.clickOutside.emit();
    }
  }
}
