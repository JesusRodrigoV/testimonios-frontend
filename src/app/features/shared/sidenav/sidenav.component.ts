import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '@app/features/auth/services/auth';
import { MatListModule } from '@angular/material/list';
import { NgClass, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatListModule, NgClass, NgIf, MatButtonModule, RouterLink, RouterLinkActive],
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