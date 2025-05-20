import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TestimonioService } from '@app/features/testimony/services';

@Component({
  selector: 'app-tags-filters',
  imports: [],
  templateUrl: './tags-filters.component.html',
  styleUrl: './tags-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsFiltersComponent implements OnInit{
  tags: { id: number; name: string }[] = [];

  private testimonyService = inject(TestimonioService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.testimonyService.getAllTags().subscribe({
      next: (data) => {
        this.tags = data;
      },
      error: (err) => {
        this.openSnackBar(
          "Error al cargar etiquetas: " + err.message,
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
