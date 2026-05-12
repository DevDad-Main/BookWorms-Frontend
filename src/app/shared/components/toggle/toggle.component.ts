import { Component, model } from '@angular/core';

@Component({
  selector: 'app-toggle',
  standalone: true,
  template: `<label class="toggle">
    <input type="checkbox" [checked]="checked()" (change)="checked.set(!checked())" />
    <span class="slider"></span>
  </label>`,
  styles: `.toggle { position: relative; display: inline-block; width: 40px; height: 22px; cursor: pointer; }
    .toggle input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; inset: 0; background: #2A2C2E; border-radius: 11px; transition: all 250ms ease; border: 1px solid rgba(255,255,255,0.06); }
    .slider::before { content: ''; position: absolute; width: 16px; height: 16px; left: 2px; bottom: 2px; background: #5C5750; border-radius: 50%; transition: all 250ms ease; }
    .toggle input:checked + .slider { background: rgba(198, 169, 114, 0.2); border-color: #C6A972; }
    .toggle input:checked + .slider::before { transform: translateX(18px); background: #C6A972; }`
})
export class ToggleComponent {
  readonly checked = model(false);
}
