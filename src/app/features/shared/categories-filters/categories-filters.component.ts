import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TestimonioService } from '@app/features/testimony/services';

@Component({
  selector: 'app-categories-filters',
  imports: [MatChipsModule],
  templateUrl: './categories-filters.component.html',
  styleUrl: './categories-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesFiltersComponent implements OnInit {
  categorias: { id_categoria: number; nombre: string; descripcion: string }[] =
    [];

  private testimonyService = inject(TestimonioService);
  private snackBar = inject(MatSnackBar);
  private ref = inject(ChangeDetectorRef);

  ngOnInit() {
    this.testimonyService.getAllCategories().subscribe({
      next: (data) => {
        this.categorias = data;
        
        this.ref.detectChanges();
      },
      error: (err) => {
        this.openSnackBar(
          "Error al cargar categorías: " + err.message,
          "Cerrar",
          "error",
        );
      },
    });
  }

  openSnackBar(
    message: string,
    action: string,
    type: "success" | "error",
  ): void {
    this.snackBar.open(message, action, {
      duration: type === "success" ? 3000 : 5000,
      panelClass:
        type === "success" ? ["snackbar-success"] : ["snackbar-error"],
      verticalPosition: "bottom",
      horizontalPosition: "center",
    });
  }
}
