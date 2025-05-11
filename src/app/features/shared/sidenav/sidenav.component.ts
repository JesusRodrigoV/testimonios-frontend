import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '@app/features/auth/services/auth';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidenav',
  imports: [MatIconModule, MatButtonModule, RouterLink, RouterLinkActive],
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