import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Output, input } from '@angular/core';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TestimonioService } from '@app/features/testimony/services';

@Component({
  selector: 'app-events-filters',
  imports: [MatChipsModule],
  templateUrl: './events-filters.component.html',
  styleUrl: './events-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsFiltersComponent {
  events: { id: number; name: string; description: string; date: string }[] = [];
  readonly selectedEvents = input<number[]>([]);
  @Output() selectedEventsChange = new EventEmitter<number[]>();

  private testimonyService = inject(TestimonioService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.testimonyService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.openSnackBar(
          "Error al cargar eventos: " + err.message,
          "Cerrar",
          "error",
        );
      },
    });
  }

  toggleEvent(id: number) {
    const updated = this.selectedEvents().includes(id) ? [] : [id]; // Single selection
    this.selectedEventsChange.emit(updated);
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
