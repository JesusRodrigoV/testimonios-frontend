import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ThemeService } from "@app/core/services/theme";
import { FooterComponent } from "@app/features/shared/footer";
import { HeaderComponent } from "@app/features/shared/header";


@Component({
  selector: "app-layout",
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LayoutComponent {
  readonly themeService = inject(ThemeService);
}
