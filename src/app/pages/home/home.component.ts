import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { provideNativeDateAdapter } from "@angular/material/core";
import { HeroSectionComponent } from "./components/hero-section";
import { TestimonioService } from "@app/services/testimonio/testimonio.service";
import { Testimony } from "@app/models/testimonio.model";
import { CacheService } from "@app/services/cache";
import { TestimonyComponent } from "@app/features/testimony/testimony";
import { SpinnerComponent } from "@app/features/shared/ui/spinner";

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

  constructor(
    private testimonioService: TestimonioService,
    private cacheService: CacheService,
  ) {}

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
      },
      error: (err) => {
        console.error("Error loading highlighted testimonies:", err);
        this.loading = false;
      },
    });
  }
}
