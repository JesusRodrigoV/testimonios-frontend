import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { FormsModule } from "@angular/forms";
import { ThemeService } from "@app/core/services/theme";

@Component({
  selector: "app-settings",
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    FormsModule,
  ],
  templateUrl: "./settings.component.html",
  styleUrl: "./settings.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsComponent {
  private themeService = inject(ThemeService);

  notificationsEnabled = true;
  emailNotifications = true;
  language = "es";

  get darkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  onThemeChange(isDark: boolean): void {
    this.themeService.setTheme(isDark ? "dark" : "light");
  }

  onSaveSettings(): void {
    // Aquí implementaremos la lógica para guardar las configuraciones
    console.log("Configuraciones guardadas");
  }
}
