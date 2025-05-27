import {
  ChangeDetectionStrategy,
  Component,
  output,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { SidenavItem } from "./models/sidenav-button.model";
import { SidenavButtonComponent } from "./sidenav-button/sidenav-button.component";

@Component({
  selector: "app-sidenav",
  imports: [MatIconModule, MatButtonModule, SidenavButtonComponent],
  templateUrl: "./sidenav.component.html",
  styleUrl: "./sidenav.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  toggleSidenav = output<void>();
  isExpanded = true;

  sidenavItems: SidenavItem[] = [
    {
      routerLink: "/home",
      icon: "home",
      text: "Inicio",
      exact: true,
      tooltip: "Ir a Inicio",
    },
    {
      routerLink: "/explore",
      icon: "explore",
      text: "Explorar",
      tooltip: "Explorar testimonios",
    },
    {
      routerLink: "/collections",
      icon: "collections",
      text: "Mis colecciones",
      tooltip: "Ver mis colecciones",
    },
    {
      routerLink: "/maps",
      icon: "map",
      text: "Mapas",
      tooltip: "Ver ubicacion de cada testimonio",
    },
    {
      routerLink: "/forum",
      icon: "forum",
      text: "Foro",
      tooltip: "Ir al foro de discusion",
    },
  ];

  toggle() {
    this.isExpanded = !this.isExpanded;
    this.toggleSidenav.emit();
  }
}
