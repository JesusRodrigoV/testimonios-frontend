import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { AuthStore } from "@app/auth.store";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-profile",
  imports: [CommonModule, MatCardModule, MatDividerModule, MatButtonModule],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfileComponent {
  private readonly authStore = inject(AuthStore);
  user = this.authStore.user;

  getRoleName(roleId: number | undefined): string {
    switch (roleId) {
      case 1:
        return "Administrador";
      case 2:
        return "Curador";
      case 3:
        return "Investigador";
      case 4:
        return "Visitante";
      default:
        return "Desconocido";
    }
  }

  async onLogout() {
    await this.authStore.logout();
  }
}
