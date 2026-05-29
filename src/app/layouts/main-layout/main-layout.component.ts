import { Component, signal, HostListener, inject } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { NavItemComponent } from '../../shared/components/nav-item/nav-item.component';
import { DropdownComponent, DropdownItem } from '../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, IconComponent, AvatarComponent, NavItemComponent, DropdownComponent],
  template: `<div class="app-shell">
    <!-- Sidebar -->
    <aside class="sidebar" [class.open]="sidebarOpen()" [class.collapsed]="sidebarCollapsed()">
      <div class="sidebar-header">
        <a routerLink="/dashboard" class="sidebar-brand">
          <div class="brand-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
            </svg>
          </div>
          <span class="brand-name">BookWorms</span>
        </a>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <span class="nav-section-label">Main</span>
          <app-nav-item route="/dashboard" icon="home" label="Dashboard" [exact]="true" />
          <app-nav-item route="/books" icon="books" label="Browse Books" />
        </div>
        <div class="nav-section">
          <span class="nav-section-label">Library</span>
          <app-nav-item route="/books/my" icon="bookmark" label="My Books" />
          <app-nav-item route="/books/create" icon="plus" label="Add Book" />
        </div>
        <div class="nav-section">
          <span class="nav-section-label">Borrowing</span>
          <app-nav-item route="/borrowing/requests" icon="swap" label="Requests" />
          <app-nav-item route="/borrowing/borrowed" icon="book-open" label="Borrowed" />
          <app-nav-item route="/borrowing/lent" icon="upload" label="Lent" />
          <app-nav-item route="/borrowing/return" icon="refresh" label="Returns" />
          <app-nav-item route="/borrowing/reviews" icon="star" label="Reviews" />
        </div>
        <div class="nav-section">
          <span class="nav-section-label">Developer</span>
          <app-nav-item route="/debug/jwt" icon="activity" label="Debug JWT" />
        </div>
      </nav>

      <button class="sidebar-collapse-btn" (click)="toggleCollapse()">
        <app-icon [name]="sidebarCollapsed() ? 'chevron-right' : 'chevron-left'" size="18" />
      </button>
    </aside>

    @if (sidebarOpen()) {
      <div class="sidebar-overlay" (click)="sidebarOpen.set(false)"></div>
    }

    <!-- Main Area -->
    <div class="main-area">
      <!-- Top Header -->
      <header class="top-header">
        <button class="menu-toggle" (click)="sidebarOpen.set(!sidebarOpen())">
          <app-icon name="menu" size="20" />
        </button>

        <div class="header-right">
          <button class="header-action">
            <app-icon name="bell" size="18" />
          </button>

          <app-dropdown [items]="userMenuItems" (onSelect)="handleMenuSelect($event)">
            <div class="user-trigger" trigger>
              <app-avatar [name]="userName" size="sm" />
              <span class="user-name">{{ userName }}</span>
              <app-icon name="chevron-down" size="14" />
            </div>
          </app-dropdown>
        </div>
      </header>

      <!-- Page Content -->
      <main class="page-content">
        <router-outlet />
      </main>
    </div>
  </div>`,
  styles: `.app-shell { display: flex; min-height: 100vh; }
    .sidebar { width: 260px; background: #181A1B; border-right: 1px solid rgba(255,255,255,0.04); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1); }
    .sidebar-header { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.04); overflow: hidden; }
    .sidebar-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .brand-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(198, 169, 114, 0.1); display: flex; align-items: center; justify-content: center; color: #C6A972; flex-shrink: 0; }
    .brand-name { font-family: 'Playfair Display', Georgia, serif; font-size: 1.2rem; font-weight: 600; color: #F5F1E8; white-space: nowrap; transition: opacity 200ms ease; }
    .sidebar.collapsed .brand-name { opacity: 0; }
    .sidebar.collapsed .sidebar-nav { padding: 16px 6px; align-items: center; }
    .sidebar.collapsed .nav-section-label { display: none; }
    .sidebar-nav { flex: 1; overflow-y: auto; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
    .nav-section { margin-bottom: 16px; width: 100%; }
    .nav-section-label { display: block; padding: 0 16px; margin-bottom: 6px; font-size: 0.7rem; font-weight: 600; color: #5C5750; text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap; }
    .sidebar-overlay { display: none; }
    .sidebar.collapsed { width: 64px; overflow: hidden; }
    .main-area { flex: 1; margin-left: 260px; min-width: 0; display: flex; flex-direction: column; transition: margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1); }
    .sidebar.collapsed + .sidebar-overlay + .main-area,
    .sidebar.collapsed ~ .main-area { margin-left: 64px; }
    .sidebar-collapse-btn { display: flex; align-items: center; justify-content: center; height: 44px; background: none; border: none; color: #5C5750; cursor: pointer; border-top: 1px solid rgba(255,255,255,0.04); transition: color 200ms ease; &:hover { color: #C6A972; } }
    .sidebar.collapsed .sidebar-collapse-btn { justify-content: center; }
    .top-header { height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; border-bottom: 1px solid rgba(255,255,255,0.04); background: rgba(17, 19, 21, 0.8); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 50; }
    .menu-toggle { display: none; background: none; border: none; color: #8A847C; cursor: pointer; padding: 8px; border-radius: 8px; &:hover { background: rgba(255,255,255,0.04); color: #F5F1E8; } }
    .header-right { display: flex; align-items: center; gap: 12px; }
    .header-action { width: 36px; height: 36px; border-radius: 8px; background: none; border: none; color: #8A847C; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 200ms ease; &:hover { background: rgba(255,255,255,0.04); color: #F5F1E8; } }
    .user-trigger { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 8px; cursor: pointer; transition: background 200ms ease; &:hover { background: rgba(255,255,255,0.04); } }
    .user-name { font-size: 0.85rem; font-weight: 500; color: #B8B2A8; }
    .page-content { flex: 1; padding: 32px; max-width: 1200px; width: 100%; margin: 0 auto; animation: fadeIn 300ms ease; }

    @media (max-width: 768px) {
      .sidebar { transform: translateX(-100%); width: 260px; }
      .sidebar.open { transform: translateX(0); }
      .sidebar-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 99; }
      .sidebar.collapsed .brand-name { opacity: 1; }
      .sidebar.collapsed .sidebar-nav { padding: 16px 12px; align-items: stretch; }
      .sidebar.collapsed .nav-section-label { display: block; }
      .sidebar-collapse-btn { display: none; }
      .main-area { margin-left: 0; }
      .top-header { padding: 0 16px; }
      .menu-toggle { display: flex; }
      .page-content { padding: 20px 16px; }
      .user-name { display: none; }
    }`
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly sidebarOpen = signal(false);
  readonly sidebarCollapsed = signal(false);
  readonly pendingCount = signal(0);

  get userName(): string {
    const user = this.authService.currentUser();
    return user ? user.email.split('@')[0] : 'User';
  }

  readonly userMenuItems: DropdownItem[] = [
    { label: 'My Profile', icon: 'user', value: 'profile' },
    { label: 'Settings', icon: 'settings', value: 'settings' },
    { label: 'Sign Out', icon: 'logout', value: 'logout', danger: true }
  ];

  handleMenuSelect(item: DropdownItem): void {
    if (item.value === 'logout') {
      this.authService.logout();
    } else if (item.value === 'profile') {
      this.router.navigate(['/profile']);
    } else if (item.value === 'settings') {
      window.open(this.authService.getAccountManagementUrl(), '_blank');
    }
  }

  toggleCollapse(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.sidebarOpen.set(false);
  }
}
