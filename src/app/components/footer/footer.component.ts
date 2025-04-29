import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { RouterModule } from "@angular/router";

interface FooterLink {
  name: string;
  url: string;
  icon: string;
  external?: boolean;
}

@Component({
  selector: "app-footer",
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();

  readonly brand = {
    logo: "assets/images/logo-Sfondo.png",
    title: "Legado de Bolivia",
    description: "Sistema de Archivos de Testimonios del Bicentenario",
  };

  readonly links: FooterLink[] = [
    {
      name: "GitHub",
      url: "https://github.com/tu-organizacion/testimonios-frontend",
      icon: "bx bxl-github",
      external: true,
    },
  ];
}
