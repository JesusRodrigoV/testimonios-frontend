import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
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
  imports: [CommonModule, FormsModule, TestimonyComponent, SpinnerComponent, MatIconModule],
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
  searchKeyword = '';
  error: string | null = null;

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
    this.cdr.markForCheck(); // Forzar detección de cambios

    this.testimonioService
      .searchTestimonies({
        keyword: this.searchKeyword || undefined,
        page: this.page,
        limit: this.limit,
      })
      .subscribe({
        next: (response) => {
          console.log('Testimonies response:', response); 
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
          console.error('Error loading testimonies:', err);
          this.error = err.message || 'Error al cargar los testimonios';
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  onSearch() {
    this.page = 1;
    this.testimonies = [];
    this.hasMore = true;
    this.error = null;
    this.loadTestimonies(false);
  }

  private setupIntersectionObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && this.hasMore && !this.loading) {
          console.log('Load more triggered'); // Depuración
          this.loadTestimonies();
        }
      },
      { threshold: 0.1 } 
    );

    if (this.loadMoreTrigger?.nativeElement) {
      this.observer.observe(this.loadMoreTrigger.nativeElement);
    } else {
      console.warn('loadMoreTrigger element not found');
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