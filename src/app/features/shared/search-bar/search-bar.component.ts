import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, output, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GoldenDirective } from '@app/core/directives/golden.directive';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  imports: [MatMenuModule, FormsModule, NgIf, GoldenDirective, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBarComponent {
  @Input() isMobile = false;
  @Input() isActive = false;
  @Output() search = new EventEmitter<{ query: string; filter?: string }>();
  @Output() toggleMobile = new EventEmitter<boolean>();
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  searchQuery = '';
  filterType: 'recent' | 'popular' | 'category' | null = null;

  private querySubject = new Subject<string>();

  constructor(private cdr: ChangeDetectorRef) {
    this.querySubject.pipe(debounceTime(300)).subscribe((query) => {
      if (query.trim()) {
        this.search.emit({ query: query.trim(), filter: this.filterType || undefined });
        this.cdr.detectChanges();
      }
    });
  }

  onInput(): void {
    console.log('Input changed:', this.searchQuery); // Debug
  }

  onQueryChange(): void {
    this.querySubject.next(this.searchQuery);
    this.cdr.markForCheck();
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.search.emit({ query: this.searchQuery.trim(), filter: this.filterType || undefined });
      this.cdr.markForCheck();
    }
    if (this.isMobile && this.isActive) {
      this.toggleMobileSearch();
    }
  }

  setFilter(type: 'recent' | 'popular' | 'category'): void {
    this.filterType = type;
    this.onSearch();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.search.emit({ query: '', filter: this.filterType || undefined });
    this.cdr.markForCheck();
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  toggleMobileSearch(): void {
    this.toggleMobile.emit(!this.isActive);
    if (!this.isActive && this.searchInput) {
      setTimeout(() => {
        this.searchInput?.nativeElement.focus();
        this.cdr.markForCheck();
      }, 300);
    }
  }
}