import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { AuthStore } from "@app/auth.store";
import { Notificacion } from "../../model/notification.model";
import { NotificationService } from "../../services";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { SpinnerComponent } from "@app/features/shared/ui/spinner";
import { NotificationComponent } from "../notification/notification.component";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-notifications-menu",
  imports: [
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    SpinnerComponent,
    NotificationComponent,
  ],
  templateUrl: "./notifications-menu.component.html",
  styleUrl: "./notifications-menu.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsMenuComponent {
  private authStore = inject(AuthStore);
  private notificationService = inject(NotificationService);

  notifications = signal<Notificacion[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  intervalId: any = null;

  unreadNotifications = computed(
    () => this.notifications().filter((n) => !n.leido).length
  );

  constructor() {
    this.loadNotifications();
    this.intervalId = setInterval(() => this.loadNotifications(), 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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

  markAllAsRead() {
    const unreadIds = this.notifications()
      .filter((n) => !n.leido)
      .map((n) => n.id_notificacion);
    if (unreadIds.length === 0) return;

    this.isLoading.set(true);
    const requests = unreadIds.map((id) =>
      this.notificationService.marcarComoLeido(id)
    );
    Promise.all(requests.map((req) => req.toPromise()))
      .then(() => {
        this.notifications.update((notifs) =>
          notifs.map((n) => ({ ...n, leido: true }))
        );
        this.isLoading.set(false);
      })
      .catch(() => {
        this.error.set("Error al marcar todas las notificaciones como leídas");
        this.isLoading.set(false);
      });
  }
}
