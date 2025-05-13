import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from "@angular/core";
import { provideNativeDateAdapter } from "@angular/material/core";
import { HeroSectionComponent } from "./components/hero-section";
import { Testimony } from "@app/features/testimony/models/testimonio.model";
import { TestimonyComponent } from "@app/features/testimony/components/testimony";
import { SpinnerComponent } from "@app/features/shared/ui/spinner";
import { TestimonioService } from "@app/features/testimony/services";
import { CacheService } from "@app/core/services/cache";

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
  private testimonioService = inject(TestimonioService);
  private cacheService = inject(CacheService);


  ngOnInit() {
    this.loadHighlightedTestimonies();
  }

  loadHighlightedTestimonies() {
    const cached = this.cacheService.getHighlightedTestimonies();
    if (cached) {
      this.highlightedTestimonies = cached;
      return;
    }

    this.loading = true;
    this.testimonioService.searchTestimonies({ highlighted: true }).subscribe({
      next: (response) => {
        this.highlightedTestimonies = response.data;
        this.cacheService.setHighlightedTestimonies(response.data);
        this.loading = false;
        this.ref.detectChanges();
      },
      error: (err) => {
        console.error("Error loading highlighted testimonies:", err);
        this.loading = false;
      },
    });
  }
}
