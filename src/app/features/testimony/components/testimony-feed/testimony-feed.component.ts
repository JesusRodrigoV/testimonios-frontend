import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Testimony } from '@app/features/testimony/models/testimonio.model';
import { SpinnerComponent } from '@app/features/shared/ui/spinner';
import { TestimonyComponent } from '../testimony/testimony.component';
import { TestimonioService } from '@app/features/testimony/services';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-testimony-feed',
  imports: [FormsModule, TestimonyComponent, SpinnerComponent, MatIconModule, NgIf],
  templateUrl: './testimony-feed.component.html',
  styleUrl: './testimony-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TestimonyFeedComponent implements OnInit, OnDestroy {
  testimonies: Testimony[] = [];
  page = 1;
  limit = 10;
  total = 0;
  loading = false;
  hasMore = true;
  error: string | null = null;

  @Input() set searchQuery(value: string) {
    this._searchQuery = value;
    this.page = 1;
    this.testimonies = [];
    this.hasMore = true;
    this.error = null;
    this.loadTestimonies(false);
  }
  private _searchQuery = '';

  @ViewChild('loadMoreTrigger', { static: false }) loadMoreTrigger!: ElementRef;
  private testimonioService = inject(TestimonioService);
  private cdr = inject(ChangeDetectorRef);
  private observer: IntersectionObserver | null = null;

  ngOnInit() {
    this.loadTestimonies(false);
  }

  loadTestimonies(append = true) {
    if (this.loading || !this.hasMore) return;

    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();

    this.testimonioService
      .searchTestimonies({
        keyword: this._searchQuery || undefined,
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
          this.cdr.markForCheck();
          this.setupIntersectionObserver();
        },
        error: (err) => {
          this.error = err.message || 'Error al cargar los testimonios';
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
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
      { threshold: 0.1 }
    );

    if (this.loadMoreTrigger?.nativeElement) {
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