import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Testimony } from "@app/features/testimony/models/testimonio.model";
import { Subject, takeUntil } from "rxjs";
import { TestimonioService } from "../services";
import { TestimonyDialogComponent } from "./testimony-dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { SpinnerComponent } from "@app/features/shared/ui/spinner";

@Component({
  selector: "app-testimony-management",
  imports: [NgClass, MatButtonModule, MatSnackBarModule, MatFormFieldModule, SpinnerComponent],
  templateUrl: "./testimony-management.component.html",
  styleUrl: "./testimony-management.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonyManagementComponent implements OnInit, OnDestroy {
  testimonies: Testimony[] = [];
  private destroy$ = new Subject<void>();
  isLoading = false;
  selectedStatus: string = "Pendiente";

  private testimonioService = inject(TestimonioService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private ref = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadTestimonies();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTestimonies(): void {
    this.isLoading = true;
    const params: { status?: string; limit: number } = { limit: 100 };
    if (this.selectedStatus) {
      params.status = this.selectedStatus;
    }
    console.log("Fetching testimonies with params:", params);
    this.testimonioService.searchTestimonies(params).subscribe({
      next: (response) => {
        console.log("Testimonies response:", response);
        this.testimonies = response.data;
        this.isLoading = false;
        this.ref.detectChanges();
      },
      error: (err) => {
        console.error("Error loading testimonies:", err);
        this.snackBar.open("Error al cargar testimonios", "Cerrar", {
          duration: 3000,
        });
        this.isLoading = false;
        this.ref.detectChanges();
      },
    });
  }

  refreshTestimonies(): void {
    this.loadTestimonies();
  }

  openTestimonyDialog(testimony: Testimony): void {
    this.dialog.open(TestimonyDialogComponent, {
      width: "600px",
      data: testimony,
    });
  }

  validateTestimony(id: number, approve: boolean): void {
    if (
      confirm(
        `¿Estás seguro de que querés ${approve ? "aprobar" : "rechazar"} este testimonio?`,
      )
    ) {
      this.isLoading = true;
      this.testimonioService
        .validateTestimony(id, approve)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log("Validate testimony response:", response);
            this.loadTestimonies();
            this.snackBar.open(
              `Testimonio ${approve ? "aprobado" : "rechazado"} con éxito`,
              "Cerrar",
              { duration: 3000 },
            );
            this.isLoading = false;
            this.ref.detectChanges();
          },
          error: (err) => {
            console.error("Error validating testimony:", err);
            this.snackBar.open("Error al validar testimonio", "Cerrar", {
              duration: 3000,
            });
            this.isLoading = false;
            this.ref.detectChanges();
          },
        });
    }
  }

  deleteTestimony(id: number): void {
    if (confirm("¿Estás seguro de que querés eliminar este testimonio?")) {
      this.isLoading = true;
      this.testimonioService
        .deleteTestimony(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadTestimonies();
            this.snackBar.open("Testimonio eliminado con éxito", "Cerrar", {
              duration: 3000,
            });
            this.isLoading = false;
            this.ref.detectChanges();
          },
          error: () => {
            this.snackBar.open("Error al eliminar testimonio", "Cerrar", {
              duration: 3000,
            });
            this.isLoading = false;
            this.ref.detectChanges();
          },
        });
    }
  }
}
