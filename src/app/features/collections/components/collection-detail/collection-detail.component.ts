import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Collection } from '../../models/collection.model';
import { Testimony } from '@app/features/testimony/models/testimonio.model';
import { CollectionService } from '../../services';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TestimonyComponent } from '@app/features/testimony/components/testimony';
import { SpinnerComponent } from '@app/features/shared/ui/spinner';
import { DatePipe } from '@angular/common';
import { combineLatest } from 'rxjs';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-collection-detail',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    TestimonyComponent,
    SpinnerComponent,
    DatePipe,
  ],
  templateUrl: './collection-detail.component.html',
  styleUrl: './collection-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CollectionDetailComponent {
  collection = signal<Collection | null>(null);
  testimonies = signal<Testimony[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  private collectionService = inject(CollectionService);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);

  constructor() {
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    if (id) {
      this.loadData(id);
    } else {
      this.error.set('ID de colección no válido');
      this.snackBar.open('ID de colección no válido', 'Cerrar', { duration: 3000 });
    }
  }

  private loadData(id: number) {
    this.loading.set(true);
    combineLatest([
      this.collectionService.getById(id),
      this.collectionService.getTestimonies(id),
    ]).subscribe({
      next: ([collection, testimonies]) => {
        this.collection.set(collection);
        this.testimonies.set(testimonies);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar la colección o los testimonios');
        this.snackBar.open('Error al cargar la colección o los testimonios', 'Cerrar', {
          duration: 3000,
        });
        this.loading.set(false);
      },
    });
  }
  retry() {
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    if (id) {
      this.error.set(null);
      this.loadData(id);
    }
  }
}