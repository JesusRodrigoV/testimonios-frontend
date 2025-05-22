import { ChangeDetectionStrategy, Component, EventEmitter, inject, output, Output } from '@angular/core';
import { AuthService } from '@app/features/auth/services/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SidenavItem } from './models/sidenav-button.model';
import { SidenavButtonComponent } from './sidenav-button/sidenav-button.component';

@Component({
  selector: 'app-sidenav',
  imports: [MatIconModule, MatButtonModule, SidenavButtonComponent],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent {
  toggleSidenav = output<void>();
  isExpanded = true;

  sidenavItems: SidenavItem[] = [
    { routerLink: '/home', icon: 'home', text: 'Inicio', exact: true },
    { routerLink: '/explore', icon: 'explore', text: 'Explorar' },
    { routerLink: '/collections', icon: 'collections', text: 'Mis colecciones' },
    { routerLink: '/maps', icon: 'map', text: 'Mapas' },
    { routerLink: '/forum', icon: 'forum', text: 'Foro' }
  ];

  toggle() {
    this.isExpanded = !this.isExpanded;
    this.toggleSidenav.emit();
  }
}