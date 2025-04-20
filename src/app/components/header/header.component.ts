import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatBadgeModule } from "@angular/material/badge";
import { AuthStore } from "@app/auth.store";
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-header",
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
    FormsModule,
    MatBadgeModule,
    RouterLink,
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  isMobileSearchActive = false;

  navigateToProfile(): void {
    this.router.navigate(["/profile"]);
  }

  navigateToSettings(): void {
    this.router.navigate(["/settings"]);
  }

  toggleMobileSearch(): void {
    this.isMobileSearchActive = !this.isMobileSearchActive;
    const searchField = document.querySelector(".search-field");
    if (searchField) {
      searchField.classList.toggle("mobile-search-active");
    }
  }

  async onLogout() {
    await this.authStore.logout();
  }

  notifications = [
    { id: 1, message: "Nuevo testimonio agregado", read: false },
    { id: 2, message: "Comentario en tu testimonio", read: true },
  ];

  get unreadNotifications(): number {
    return this.notifications.filter((n) => !n.read).length;
  }
  searchQuery = "";

  onSearch(): void {
    this.search.emit(this.searchQuery);
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  markAsRead(notificationId: number): void {
    const notification = this.notifications.find(
      (n) => n.id === notificationId,
    );
    if (notification) {
      notification.read = true;
    }
  }
}
