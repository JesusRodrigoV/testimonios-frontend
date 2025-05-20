import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from "@angular/core";
import { provideNativeDateAdapter } from "@angular/material/core";
import { HeroSectionComponent } from "./components/hero-section";
import { Testimony } from "@app/features/testimony/models/testimonio.model";
import { TestimonyComponent } from "@app/features/testimony/components/testimony";
import { SpinnerComponent } from "@app/features/shared/ui/spinner";
import { CalificationService, TestimonioService } from "@app/features/testimony/services";
import { CacheService } from "@app/core/services";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-home",
  imports: [
    CommonModule,
    HeroSectionComponent,
    SpinnerComponent,
    TestimonyComponent,
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export default class HomeComponent {
  highlightedTestimonies: Testimony[] = [];
  loading = false;

  private ref = inject(ChangeDetectorRef);
  private calificationService = inject(CalificationService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.loadHighlightedTestimonies();
  }

  loadHighlightedTestimonies() {
    this.loading = true;
    this.calificationService.getTopRatedTestimonies(5).subscribe({
      next: (testimonies) => {
        this.highlightedTestimonies = testimonies;
        console.log("Highlighted testimonies loaded:", this.highlightedTestimonies);
        this.loading = false;
        this.ref.markForCheck();
      },
      error: (err) => {
        console.error("Error loading highlighted testimonies:", err);
        this.loading = false;
        this.snackBar.open('Error al cargar los testimonios destacados', 'Cerrar', { duration: 3000 });
        this.ref.markForCheck();
      },
    });
  }
}
