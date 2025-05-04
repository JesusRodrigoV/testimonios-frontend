import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Testimony } from "@app/models/testimonio.model";
import { TestimonioService } from "@app/services/testimonio/testimonio.service";
import { SpinnerComponent } from "../ui/spinner";
import { TestimonyComponent } from "../testimony/";

@Component({
  selector: "app-testimony-feed",
  imports: [CommonModule, FormsModule, SpinnerComponent, TestimonyComponent],
  templateUrl: "./testimony-feed.component.html",
  styleUrl: "./testimony-feed.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TestimonyFeedComponent implements OnInit, OnDestroy {
  testimonies: Testimony[] = [];
  page = 1;
  limit = 10;
  total = 0;
  loading = false;
  hasMore = true;
  searchKeyword = "";
  private observer: IntersectionObserver | null = null;

  @ViewChild("loadMoreTrigger", { static: false }) loadMoreTrigger!: ElementRef;

  constructor(private testimonioService: TestimonioService) {}

  ngOnInit() {
    this.loadTestimonies();
  }

  loadTestimonies(append = true) {
    if (this.loading || !this.hasMore) return;

    this.loading = true;

    this.testimonioService
      .searchTestimonies({
        keyword: this.searchKeyword || undefined,
        page: this.page,
        limit: this.limit,
      })
      .subscribe({
        next: (response) => {
          if (append) {
            this.testimonies = [...this.testimonies, ...response.data];
          } else {
            this.testimonies = response.data;
          }
          this.total = response.total;
          this.hasMore = this.testimonies.length < this.total;
          this.page = response.page + 1;
          this.loading = false;
          this.setupIntersectionObserver();
        },
        error: (err) => {
          console.error("Error loading testimonies:", err);
          this.loading = false;
        },
      });
  }

  onSearch() {
    this.page = 1;
    this.testimonies = [];
    this.hasMore = true;
    this.loadTestimonies(false);
  }

  private setupIntersectionObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && this.hasMore && !this.loading) {
          this.loadTestimonies();
        }
      },
      { threshold: 0.5 }, // Precargar antes
    );

    if (this.loadMoreTrigger) {
      this.observer.observe(this.loadMoreTrigger.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  trackById(index: number, testimony: Testimony): number {
    return testimony.id;
  }
}
