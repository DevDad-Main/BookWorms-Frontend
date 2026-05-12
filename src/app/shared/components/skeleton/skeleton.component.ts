import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `<div class="skeleton" [style.width]="width()" [style.height]="height()" [style.border-radius]="radius()"></div>`,
  styles: `.skeleton { background: linear-gradient(90deg, #232527 25%, #2A2C2E 50%, #232527 75%); background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite; }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`
})
export class SkeletonComponent {
  readonly width = input<string>('100%');
  readonly height = input<string>('16px');
  readonly radius = input<string>('6px');
}
