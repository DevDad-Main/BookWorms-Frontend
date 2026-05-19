import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

let nextId = 1;

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  private add(message: string, type: ToastType, duration: number): void {
    const id = nextId++;
    this.toasts.update(t => [...t, { id, message, type, duration }]);
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  success(message: string, duration = 4000): void {
    this.add(message, 'success', duration);
  }

  error(message: string, duration = 6000): void {
    this.add(message, 'error', duration);
  }

  warning(message: string, duration = 5000): void {
    this.add(message, 'warning', duration);
  }

  info(message: string, duration = 4000): void {
    this.add(message, 'info', duration);
  }

  dismiss(id: number): void {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
