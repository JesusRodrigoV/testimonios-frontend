
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Testimony } from '@app/features/testimony/models/testimonio.model';
import { SpinnerComponent } from '@app/features/shared/ui/spinner';
import { TestimonyComponent } from '../testimony/testimony.component';
import { TestimonioService } from '@app/features/testimony/services';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { CategoriesFiltersComponent } from '@app/features/shared/categories-filters';
import { EventsFiltersComponent } from '@app/features/shared/events-filters';
import { TagsFiltersComponent } from '@app/features/shared/tags-filters';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-testimony-feed',
  imports: [FormsModule, TestimonyComponent, SpinnerComponent, MatIconModule, MatFormFieldModule, MatInputModule, CategoriesFiltersComponent, EventsFiltersComponent, TagsFiltersComponent, MatSelectModule],
  templateUrl: './testimony-feed.component.html',
  styleUrl: './testimony-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TestimonyFeedComponent implements OnInit, OnDestroy {
  testimonies: WritableSignal<Testimony[]> = signal([]);
  page: WritableSignal<number> = signal(1);
  limit: WritableSignal<number> = signal(10);
  total: WritableSignal<number> = signal(0);
  loading: WritableSignal<boolean> = signal(false);
  hasMore: WritableSignal<boolean> = signal(true);
  error: WritableSignal<string | null> = signal(null);
  selectedCategories: WritableSignal<number[]> = signal([]);
  selectedEvents: WritableSignal<number[]> = signal([]);
  selectedTags: WritableSignal<number[]> = signal([]);
  isSidebarOpen: WritableSignal<boolean> = signal(false);
  searchQuery: string = '';

  private _searchSubject = new Subject<string>();
  private _destroy$ = new Subject<void>();

  @ViewChild('loadMoreTrigger', { static: false }) loadMoreTrigger!: ElementRef;
  private testimonioService = inject(TestimonioService);
  private cdr = inject(ChangeDetectorRef);
  private observer: IntersectionObserver | null = null;

  ngOnInit() {
    this.setupSearchDebounce();
    this.loadTestimonies(false);
  }

  private setupSearchDebounce() {
    this._searchSubject.pipe(debounceTime(300), takeUntil(this._destroy$)).subscribe((query) => {
      this.searchQuery = query;
      this.resetAndLoad();
    });
  }

  onSearchQueryChange(query: string) {
    this.searchQuery = query;
    this._searchSubject.next(query);
  }

  clearSearch() {
    this.searchQuery = '';
    this._searchSubject.next('');
  }

  onFilterChange() {
    this.resetAndLoad();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategories.set([]);
    this.selectedEvents.set([]);
    this.selectedTags.set([]);
    this._searchSubject.next('');
  }

  toggleSidebar() {
    this.isSidebarOpen.update((value) => !value);
  }

  private resetAndLoad() {
    this.page.set(1);
    this.testimonies.set([]);
    this.hasMore.set(true);
    this.error.set(null);
    this.loadTestimonies(false);
  }

  loadTestimonies(append = true) {
    if (this.loading() || !this.hasMore()) return;

    this.loading.set(true);
    this.error.set(null);

    const params = {
      keyword: this.searchQuery || undefined,
      category: this.selectedCategories().length ? this.selectedCategories().join(',') : undefined,
      eventId: this.selectedEvents().length ? this.selectedEvents()[0] : undefined,
      tag: this.selectedTags().length ? this.selectedTags().join(',') : undefined,
      page: this.page(),
      limit: this.limit(),
    };

    this.testimonioService.searchTestimonies(params).subscribe({
      next: (response) => {
        if (append) {
          this.testimonies.update((current) => [...current, ...response.data]);
        } else {
          this.testimonies.set(response.data);
        }
        this.total.set(response.total);
        this.hasMore.set(this.testimonies().length < this.total());
        this.page.set(response.page + 1);
        this.loading.set(false);
        this.cdr.markForCheck();
        this.setupIntersectionObserver();
      },
      error: (err) => {
        this.error.set(err.message || 'Error al cargar los testimonios');
        this.loading.set(false);
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
        if (entries[0].isIntersecting && this.hasMore() && !this.loading()) {
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
    this._destroy$.next();
    this._destroy$.complete();
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  trackById(index: number, testimony: Testimony): number {
    return testimony.id;
  }
}