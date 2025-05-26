import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { provideNativeDateAdapter } from "@angular/material/core";
import { HeroSectionComponent } from "./components/hero-section";
import { Testimony } from "@app/features/testimony/models/testimonio.model";
import { TestimonyComponent } from "@app/features/testimony/components/testimony";
import { SpinnerComponent } from "@app/features/shared/ui/spinner";
import { CalificationService } from "@app/features/testimony/services";
import { CacheService } from "@app/core/services";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Subscription } from "rxjs";

@Component({
  selector: "app-home",
  imports: [
    CommonModule,
    HeroSectionComponent,
    SpinnerComponent,
    TestimonyComponent,
    MatSnackBarModule
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export default class HomeComponent implements OnInit, OnDestroy {
  highlightedTestimonies = signal<Testimony[]>([]);
  loading = signal<boolean>(false);

  private subscriptions = new Subscription();
  private calificationService = inject(CalificationService);
  private cacheService = inject(CacheService);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.loadHighlightedTestimonies();
    console.log(
      "Mira Mira aqui estan los elegidos: " + this.highlightedTestimonies()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadHighlightedTestimonies() {
    const cached = this.cacheService.getHighlightedTestimonies();
    if (cached) {
      this.highlightedTestimonies.set(cached);
      return;
    }
    this.loading.set(true);
    const sub = this.calificationService.getTopRatedTestimonies(5).subscribe({
      next: (testimonies) => {
        this.highlightedTestimonies.set([...testimonies]);
        console.log("Estos son los testimonios"+testimonies);
        this.cacheService.setHighlightedTestimonies(testimonies);
        this.loading.set(false);
      },
      error: (err) => {
        console.error("Error loading top rated testimonies:", err);
        this.snackBar.open("Error al cargar testimonios destacados", "Cerrar", {
          duration: 3000,
        });
        this.loading.set(false);
      },
    });

    this.subscriptions.add(sub);
  }
}
