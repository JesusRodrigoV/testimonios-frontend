import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "./components/footer";
import { HeaderComponent } from "./components/header";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "testimonios-frontend";
}
