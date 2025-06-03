import { AsyncPipe, DatePipe, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SpinnerComponent } from '@app/features/shared/ui/spinner';
import { MatListModule } from '@angular/material/list';
import { Testimony } from '@app/features/testimony/models/testimonio.model';
import { Router } from '@angular/router';
import { TestimonioService } from '@app/features/testimony/services';
import { Subject, debounceTime } from 'rxjs';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-dialog',
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatListModule,
    SpinnerComponent,
    DatePipe,
    SlicePipe,
    AsyncPipe
],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchDialogComponent {
  private searchSubject = new Subject<string>();
  private testimonioService = inject(TestimonioService);
  private searchService = inject(SearchService);
  private router = inject(Router);

  showResults$ = this.searchService.showResults$;
  searchQuery = '';
  testimonies: Testimony[] = [];
  loading = false;
  error: string | null = null;
  total = 0;
  page = 1;
  limit = 10;
  hasMore = true;



  ngOnInit() {
    this.setupSearchDebounce();
    this.searchService.searchQuery$.subscribe((query) => {
      this.searchQuery = query;
      this.searchSubject.next(query);
    });
  }

  private setupSearchDebounce() {
    this.searchSubject.pipe(debounceTime(300)).subscribe((query) => {
      this.resetAndSearch(query);
    });
  }

  private resetAndSearch(query: string) {
    this.page = 1;
    this.testimonies = [];
    this.hasMore = true;
    this.error = null;
    this.searchTestimonies(query, false);
  }

  searchTestimonies(query: string, append = true) {
    if (this.loading || !this.hasMore || !query.trim()) return;

    this.loading = true;
    this.error = null;

    const params = {
      keyword: query,
      page: this.page,
      limit: this.limit,
    };

    this.testimonioService.searchTestimonies(params).subscribe({
      next: (response) => {
        this.testimonies = append
          ? [...this.testimonies, ...response.data]
          : response.data;
        this.total = response.total;
        this.hasMore = this.testimonies.length < this.total;
        this.page = response.page + 1;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al buscar testimonios';
        this.loading = false;
      },
    });
  }

  onTestimonySelect(testimony: Testimony) {
    this.router.navigate(['/testimonies', testimony.id]);
    this.searchService.clearSearchQuery(); // Cierra los resultados al seleccionar
  }

  loadMore() {
    if (this.hasMore && !this.loading) {
      this.searchTestimonies(this.searchQuery, true);
    }
  }

  closeResults() {
    this.searchService.clearSearchQuery(); // Cierra los resultados y limpia la consulta
  }
}
