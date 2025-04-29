import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "../components/footer";
import { HeaderComponent } from "../components/header";
import { ThemeService } from "../services/theme";

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
