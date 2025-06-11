import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { Notificacion } from "../../model/notification.model";
import { DatePipe } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-notification",
  imports: [DatePipe, MatIconModule],
  templateUrl: "./notification.component.html",
  styleUrl: "./notification.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  notification = input.required<Notificacion>();
  markAsRead = output<number>();

  onMarkAsRead() {
    if (!this.notification().leido) {
      this.markAsRead.emit(this.notification().id_notificacion);
    }
  }
}
