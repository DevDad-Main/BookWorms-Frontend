import { Component, input } from '@angular/core';

export type IconName =
  | 'book' | 'book-open' | 'books' | 'library'
  | 'search' | 'plus' | 'edit' | 'trash' | 'archive'
  | 'share' | 'eye' | 'eye-off' | 'check' | 'x' | 'chevron-down'
  | 'chevron-left' | 'chevron-right' | 'menu' | 'bell'
  | 'user' | 'users' | 'settings' | 'logout' | 'login'
  | 'mail' | 'lock' | 'calendar' | 'clock' | 'star'
  | 'heart' | 'message' | 'arrow-left' | 'arrow-right'
  | 'upload' | 'download' | 'filter' | 'more-horizontal'
  | 'grid' | 'list' | 'refresh' | 'loader' | 'alert-circle'
  | 'check-circle' | 'info' | 'warning' | 'home' | 'trending'
  | 'activity' | 'bookmark' | 'swap' | 'verified' | 'camera'
  | 'close';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `<svg
    xmlns="http://www.w3.org/2000/svg"
    [attr.width]="size()"
    [attr.height]="size()"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    [class]="class()"
  >
    @switch (name()) {
      @case ('book') {
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
      }
      @case ('book-open') {
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      }
      @case ('books') {
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20"/>
        <path d="M20 2v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2"/>
      }
      @case ('library') {
        <path d="M16 6v18"/>
        <path d="M6 6v18"/>
        <rect x="2" y="2" width="20" height="4" rx="1"/>
        <path d="M16 2a4 4 0 0 0-8 0"/>
      }
      @case ('search') {
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
      }
      @case ('plus') {
        <path d="M5 12h14"/>
        <path d="M12 5v14"/>
      }
      @case ('edit') {
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
      }
      @case ('trash') {
        <path d="M3 6h18"/>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
      }
      @case ('archive') {
        <rect x="2" y="3" width="20" height="4" rx="1"/>
        <path d="M4 7v9c0 1 1 2 2 2h12c1 0 2-1 2-2V7"/>
        <path d="M10 12h4"/>
      }
      @case ('share') {
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <polyline points="16 6 12 2 8 6"/>
        <line x1="12" y1="2" x2="12" y2="15"/>
      }
      @case ('eye') {
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
        <circle cx="12" cy="12" r="3"/>
      }
      @case ('eye-off') {
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
        <line x1="2" y1="2" x2="22" y2="22"/>
      }
      @case ('check') {
        <polyline points="20 6 9 17 4 12"/>
      }
      @case ('x') {
        <path d="M18 6 6 18"/>
        <path d="m6 6 12 12"/>
      }
      @case ('chevron-down') {
        <polyline points="6 9 12 15 18 9"/>
      }
      @case ('chevron-left') {
        <polyline points="15 18 9 12 15 6"/>
      }
      @case ('chevron-right') {
        <polyline points="9 18 15 12 9 6"/>
      }
      @case ('menu') {
        <line x1="4" x2="20" y1="12" y2="12"/>
        <line x1="4" x2="20" y1="6" y2="6"/>
        <line x1="4" x2="20" y1="18" y2="18"/>
      }
      @case ('bell') {
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
      }
      @case ('user') {
        <circle cx="12" cy="8" r="4"/>
        <path d="M20 21a8 8 0 0 0-16 0"/>
      }
      @case ('users') {
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      }
      @case ('settings') {
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      }
      @case ('logout') {
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      }
      @case ('login') {
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
        <polyline points="10 17 15 12 10 7"/>
        <line x1="15" y1="12" x2="3" y2="12"/>
      }
      @case ('mail') {
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      }
      @case ('lock') {
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      }
      @case ('calendar') {
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      }
      @case ('clock') {
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      }
      @case ('star') {
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      }
      @case ('heart') {
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      }
      @case ('message') {
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      }
      @case ('arrow-left') {
        <path d="M12 19 5 12l7-7"/>
        <path d="M19 12H5"/>
      }
      @case ('arrow-right') {
        <path d="M5 12h14"/>
        <path d="m12 5 7 7-7 7"/>
      }
      @case ('upload') {
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
      }
      @case ('download') {
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      }
      @case ('filter') {
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
      }
      @case ('more-horizontal') {
        <circle cx="12" cy="12" r="1"/>
        <circle cx="19" cy="12" r="1"/>
        <circle cx="5" cy="12" r="1"/>
      }
      @case ('grid') {
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      }
      @case ('list') {
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      }
      @case ('refresh') {
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M3 21v-5h5"/>
      }
      @case ('loader') {
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      }
      @case ('alert-circle') {
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      }
      @case ('check-circle') {
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      }
      @case ('info') {
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4"/>
        <path d="M12 8h.01"/>
      }
      @case ('warning') {
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      }
      @case ('home') {
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      }
      @case ('trending') {
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
      }
      @case ('activity') {
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      }
      @case ('bookmark') {
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
      }
      @case ('swap') {
        <path d="M7 16V4m0 0L3 8m4-4 4 4"/>
        <path d="M17 8v12m0 0 4-4m-4 4-4-4"/>
      }
      @case ('verified') {
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="m9 12 2 2 4-4"/>
      }
      @case ('camera') {
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      }
      @case ('close') {
        <path d="M18 6 6 18"/>
        <path d="m6 6 12 12"/>
      }
      @default {
        <circle cx="12" cy="12" r="10"/>
      }
    }
  </svg>`,
  styles: `:host { display: inline-flex; align-items: center; justify-content: center; }`
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input<number | string>(20);
  readonly class = input<string>('');
}
