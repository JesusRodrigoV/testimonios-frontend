import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
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
  categorias: { id_categoria: number; nombre: string; descripcion: string }[] = [];
  @Input() selectedCategories: number[] = [];
  @Output() selectedCategoriesChange = new EventEmitter<number[]>();

  private testimonyService = inject(TestimonioService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.testimonyService.getAllCategories().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges();
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

  toggleCategory(id: number) {
    const updated = this.selectedCategories.includes(id)
      ? this.selectedCategories.filter(c => c !== id)
      : [...this.selectedCategories, id];
    this.selectedCategoriesChange.emit(updated);
  }

  onSelectionChange(event: MatChipListboxChange) {
    // Optional: Handle multi-select if needed
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
