import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "./components/footer";
import { HeaderComponent } from "./components/header";
import { ThemeService } from "./services/theme/";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "testimonios-frontend";
  readonly themeService = inject(ThemeService);
}
