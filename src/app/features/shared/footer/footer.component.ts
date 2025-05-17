import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { NgOptimizedImage } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TestimonioService } from "@app/features/testimony/services";
import { MatButtonModule } from "@angular/material/button";

interface FooterLink {
  name: string;
  url: string;
  icon: string;
  external?: boolean;
}

interface Milestone {
  year: number;
  description: string;
  url: string;
  external?: boolean;
}

@Component({
  selector: "app-footer",
  imports: [RouterModule, NgOptimizedImage, MatButtonModule],
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {

  private readonly testimonioService = inject(TestimonioService);
  private ref = inject(ChangeDetectorRef);

  readonly currentYear = new Date().getFullYear();
  numberOfTestimonies = 0;
  

  ngOnInit(): void {
    this.testimonioService.getTestimonyCount().subscribe({
      next: (count) => {
        this.numberOfTestimonies = count;
        this.ref.markForCheck();
      },
      error: (error) => {
        console.error("Error al obtener el conteo de testimonios", error);
      },
    });
  }

  readonly brand = {
    logo: 'assets/images/logo-Sfondo.png',
    title: 'Legado de Bolivia',
    description: 'Sistema de Archivos de Testimonios del Bicentenario',
  };

  readonly links: FooterLink[] = [
    {
      name: 'GitHub',
      url: 'https://github.com/JesusRodrigoV/testimonios-frontend',
      icon: 'bx bxl-github',
      external: true,
    },
  ];
}
