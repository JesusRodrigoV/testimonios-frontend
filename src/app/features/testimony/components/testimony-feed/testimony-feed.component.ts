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
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, Subject } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { CategoriesFiltersComponent } from '@app/features/shared/categories-filters';
import { EventsFiltersComponent } from '@app/features/shared/events-filters';
import { TagsFiltersComponent } from '@app/features/shared/tags-filters';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-testimony-feed',
  imports: [FormsModule, TestimonyComponent, SpinnerComponent, MatIconModule, NgIf, MatFormFieldModule, MatInputModule,CategoriesFiltersComponent, EventsFiltersComponent, TagsFiltersComponent, MatSelectModule],
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
  selectedCategories: number[] = [];
  selectedEvents: number[] = [];
  selectedTags: number[] = [];
  isSidebarOpen = false;

  @Input() set searchQuery(value: string) {
    this._searchQuery = value;
    this.searchSubject.next(value);
    this.cdr.detectChanges(); // Ensure input field updates immediately
  }
  private _searchQuery = '';
  private searchSubject = new Subject<string>();

  @ViewChild('loadMoreTrigger', { static: false }) loadMoreTrigger!: ElementRef;
  private testimonioService = inject(TestimonioService);
  private cdr = inject(ChangeDetectorRef);
  private observer: IntersectionObserver | null = null;

  ngOnInit() {
    this.setupSearchDebounce();
    this.loadTestimonies(false);
  }

  private setupSearchDebounce() {
    this.searchSubject.pipe(debounceTime(300)).subscribe((query) => {
      this._searchQuery = query;
      this.resetAndLoad();
      this.cdr.markForCheck(); // Mark for check after async search update
    });
  }

  onSearchQueryChange(query: string) {
    this.searchQuery = query;
    this.cdr.detectChanges(); // Ensure input field reflects the change
  }

  clearSearch() {
    this.searchQuery = '';
    this.cdr.detectChanges(); // Update input field immediately
    this.resetAndLoad();
  }

  onFilterChange() {
    this.resetAndLoad();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategories = [];
    this.selectedEvents = [];
    this.selectedTags = [];
    this.cdr.detectChanges();
    this.resetAndLoad();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.cdr.markForCheck(); 
  }

  private resetAndLoad() {
    this.page = 1;
    this.testimonies = [];
    this.hasMore = true;
    this.error = null;
    this.cdr.detectChanges(); 
    this.loadTestimonies(false);
  }

  loadTestimonies(append = true) {
    if (this.loading || !this.hasMore) return;

    this.loading = true;
    this.error = null;
    this.cdr.markForCheck(); // Existing, correct before async call

    const params = {
      keyword: this._searchQuery || undefined,
      category: this.selectedCategories.length ? this.selectedCategories.join(',') : undefined,
      eventId: this.selectedEvents.length ? this.selectedEvents[0] : undefined,
      tag: this.selectedTags.length ? this.selectedTags.join(',') : undefined,
      page: this.page,
      limit: this.limit,
    };
    console.log('Search params:', params);

    this.testimonioService.searchTestimonies(params).subscribe({
      next: (response) => {
        console.log('API response:', response);
        if (append) {
          this.testimonies = [...this.testimonies, ...response.data];
        } else {
          this.testimonies = response.data;
        }
        this.total = response.total;
        this.hasMore = this.testimonies.length < this.total;
        this.page = response.page + 1;
        this.loading = false;
        this.cdr.markForCheck(); // Existing, correct for async response
        this.setupIntersectionObserver();
      },
      error: (err) => {
        console.error('API error:', err);
        this.error = err.message || 'Error al cargar los testimonios';
        this.loading = false;
        this.cdr.markForCheck(); // Existing, correct for async error
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
    this.searchSubject.complete();
  }

  trackById(index: number, testimony: Testimony): number {
    return testimony.id;
  }
}