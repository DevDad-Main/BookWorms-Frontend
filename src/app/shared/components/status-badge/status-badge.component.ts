import { Component, input, computed } from '@angular/core';
import { BorrowStatus } from '../../../core/models/borrowing.model';
import { BadgeComponent, BadgeVariant } from '../badge/badge.component';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [BadgeComponent],
  template: `<app-badge [variant]="variant()">{{ label() }}</app-badge>`
})
export class StatusBadgeComponent {
  readonly status = input.required<BorrowStatus>();

  readonly variant = computed<BadgeVariant>(() => {
    switch (this.status()) {
      case BorrowStatus.PENDING: return 'warning';
      case BorrowStatus.APPROVED: return 'success';
      case BorrowStatus.REJECTED: return 'danger';
      case BorrowStatus.RETURNED: return 'info';
      case BorrowStatus.RETURN_REQUESTED: return 'accent';
      default: return 'default';
    }
  });

  readonly label = computed<string>(() => {
    switch (this.status()) {
      case BorrowStatus.PENDING: return 'Pending';
      case BorrowStatus.APPROVED: return 'Approved';
      case BorrowStatus.REJECTED: return 'Rejected';
      case BorrowStatus.RETURNED: return 'Returned';
      case BorrowStatus.RETURN_REQUESTED: return 'Return Requested';
      default: return 'Unknown';
    }
  });
}
