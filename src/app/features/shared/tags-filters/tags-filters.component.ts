import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output, input } from '@angular/core';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TestimonioService } from '@app/features/testimony/services';

@Component({
  selector: 'app-tags-filters',
  imports: [MatChipsModule],
  templateUrl: './tags-filters.component.html',
  styleUrl: './tags-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsFiltersComponent implements OnInit{
  tags: { id: number; name: string }[] = [];
  readonly selectedTags = input<number[]>([]);
  @Output() selectedTagsChange = new EventEmitter<number[]>();

  private testimonyService = inject(TestimonioService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.testimonyService.getAllTags().subscribe({
      next: (data) => {
        this.tags = data;
        this.cdr.detectChanges();
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

  toggleTag(id: number) {
    const selectedTags = this.selectedTags();
    const updated = selectedTags.includes(id)
      ? selectedTags.filter(t => t !== id)
      : [...selectedTags, id];
    this.selectedTagsChange.emit(updated);
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
