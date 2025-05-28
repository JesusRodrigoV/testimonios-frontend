import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  output,
  signal,
} from "@angular/core";
import { DatePipe, NgIf, NgOptimizedImage } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { FormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDividerModule } from "@angular/material/divider";
import { MatBadgeModule } from "@angular/material/badge";
import { AuthStore } from "@app/auth.store";
import { Router, RouterLink } from "@angular/router";
import { GoldenDirective } from "@app/core/directives/golden.directive";
import { ThemeService } from "@app/core/services";
import { Notificacion } from "@app/features/notification/model/notification.model";
import { NotificationService } from "@app/features/notification/services";
import { SpinnerComponent } from "../ui/spinner";
import { SearchBarComponent } from "../search/components/search-bar";
import { MatDialog } from "@angular/material/dialog";
import { SearchDialogComponent } from "../search/components/search-dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { interval } from "rxjs";

export const Rol = {
  ADMIN: 1,
  CURATOR: 2,
  RESEARCHER: 3,
  VISITOR: 4,
} as const;

@Component({
  selector: "app-header",
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
    FormsModule,
    MatBadgeModule,
    RouterLink,
    GoldenDirective,
    NgOptimizedImage,
    NgIf,
    SpinnerComponent,
    DatePipe,
    SearchBarComponent,
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isMobileSearchActive = signal<boolean>(false);
  notifications = signal<Notificacion[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  intervalId: any = null;

  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private themeService = inject(ThemeService);
  private readonly notificationService = inject(NotificationService);

  toggleSidebar = output<void>();

  unreadNotifications = computed(() =>
    this.notifications().filter((n) => !n.leido).length
  );

  isAdmin = computed(() => this.authStore.user()?.role === Rol.ADMIN);

  constructor() {
    this.authStore.loadUserProfile();
    this.loadNotifications();
    this.intervalId = setInterval(() => this.loadNotifications(), 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  @HostListener("window:scroll")
  onWindowScroll() {
    // Removed isScrolled as it's unused
  }

  onToggleMobileSearch(isActive: boolean) {
    this.isMobileSearchActive.set(isActive);
    document.body.style.overflow = isActive ? "hidden" : "";
  }

  @HostListener("document:keydown.escape")
  onEscapePress() {
    if (this.isMobileSearchActive()) {
      this.onToggleMobileSearch(false);
    }
  }

  async onLogout() {
    await this.authStore.logout();
    await this.router.navigate(["/login"]);
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  loadNotifications() {
    if (!this.authStore.isAuthenticated()) {
      this.notifications.set([]);
      this.isLoading.set(false);
      this.error.set(null);
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.notificationService.getUnread().subscribe({
      next: (notifications) => {
        this.notifications.set(notifications);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set("No se pudieron cargar las notificaciones");
        this.isLoading.set(false);
      },
    });
  }

  markAsRead(id: number) {
    this.notificationService.marcarComoLeido(id).subscribe({
      next: (updatedNotification) => {
        if (updatedNotification) {
          this.notifications.update((notifs) =>
            notifs.map((n) =>
              n.id_notificacion === id ? { ...n, leido: true } : n
            )
          );
        }
      },
    });
  }
}
