import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '@app/features/auth/services/auth';
import {MatListModule} from '@angular/material/list';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  imports: [MatListModule, NgClass, NgIf],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent {
  @Output() toggleSidenav = new EventEmitter<void>();
  isExpanded = true;

  private authService = inject(AuthService);

  toggle() {
    this.isExpanded = !this.isExpanded;
    this.toggleSidenav.emit();
  }
}
