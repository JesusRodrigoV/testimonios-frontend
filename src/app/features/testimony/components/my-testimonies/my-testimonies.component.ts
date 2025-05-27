import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  signal,
} from "@angular/core";
import { Testimony } from "../../models/testimonio.model";
import { TestimonioService } from "../../services";
import { MatButtonModule } from "@angular/material/button";
import { TestimonyCardComponent } from "./components/testimony-card";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
  selector: "app-my-testimonies",
  imports: [MatButtonModule, TestimonyCardComponent],
  templateUrl: "./my-testimonies.component.html",
  styleUrl: "./my-testimonies.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MyTestimoniesComponent {
  protected testimonies = signal<Testimony[]>([]);
  private testimonyService = inject(TestimonioService);

  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.loadTestimonies();
  }

  loadTestimonies(): void {
    this.testimonyService.getMyTestimonies().subscribe({
      next: (testimonies) => {
        this.testimonies.set(testimonies);
      },
      error: (error) => {
        console.error("Error fetching testimonies:", error);
        this.snackBar.open("Error al cargar testimonios", "Cerrar", {
          duration: 3000,
        });
      },
    });
  }

  editTestimony(testimony: Testimony): void {
    this.router.navigate(["/testimony", testimony.id, "edit"]);
  }

  deleteTestimony(testimony: Testimony): void {
    this.snackBar.open(
      "La eliminación está en desarrollo. Por ahora, no es posible eliminar testimonios.",
      "Cerrar",
      { duration: 5000 }
    );
  }
}
