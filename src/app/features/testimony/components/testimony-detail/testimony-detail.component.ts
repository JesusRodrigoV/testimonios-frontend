import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStore } from '@app/auth.store';
import { AddToCollectionComponent } from '@app/features/collections/components/add-to-collection';
import { CollectionService } from '@app/features/collections/services';
import { Subscription } from 'rxjs';
import { Testimony } from '../../models/testimonio.model';
import { Transcripcion } from '../../models/transcription.model';
import { TestimonioService, TranscriptionService, CalificationService } from '../../services';
import { SuggestionDialogComponent } from '../suggestion-dialog';
import { DatePipe, NgIf, NgClass, Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { VideoPlayerComponent } from '@app/features/shared/video-player';
import { TestimonyCommentsComponent } from '../testimony/testimony-comments';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-testimony-detail',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    DatePipe,
    TestimonyCommentsComponent,
    NgIf,
    NgClass,
    ReactiveFormsModule,
    MatMenuModule,
    FormsModule,
    VideoPlayerComponent,
    MatTooltipModule
  ],
  templateUrl: './testimony-detail.component.html',
  styleUrl: './testimony-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class TestimonyDetailComponent implements OnInit, OnDestroy {
  testimony: Testimony | null = null;
  currentRating = 0;
  currentRatingId: number | null = null;
  isMetaExpanded = false;
  isTranscriptionExpanded = false;
  isRatingLoading = false;
  ratingControl = new FormControl<number | null>(null);
  favoritosMios: number[] = [];
  isFavorite = false;
  transcripciones: Transcripcion[] = [];
  isLoading = true;
  isDescriptionExpanded = false; 
  private favoritosSubscription: Subscription | undefined;
  private transcripcionesSubscription: Subscription | undefined;
  private routeSubscription: Subscription | undefined;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly dialog = inject(MatDialog);
  private readonly testimonyService = inject(TestimonioService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly collectionService = inject(CollectionService);
  private readonly transcriptionService = inject(TranscriptionService);
  private readonly calificationService = inject(CalificationService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly authStore = inject(AuthStore);

  user = this.authStore.user;

  ngOnInit() {
    console.log(this.user());
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id && !isNaN(+id)) {
        this.loadTestimony(+id);
      } else {
        this.snackBar.open('ID de testimonio inválido', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
        this.goBack();
        this.cdr.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    this.favoritosSubscription?.unsubscribe();
    this.transcripcionesSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }

  private loadTestimony(id: number) {
    this.isLoading = true;
    this.testimonyService.getTestimony(id).subscribe({
      next: (testimony) => {
        console.log('Testimonio cargado:', testimony); // Log para depuración
        this.testimony = { ...testimony, favoriteCount: testimony.favoriteCount ?? 0 };
        this.loadFavorites();
        this.loadTranscriptions();
        this.loadUserRating();
        this.loadFavoriteCount();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('Error al cargar el testimonio:', error);
        this.snackBar.open('Error al cargar el testimonio', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
        this.goBack();
        this.cdr.markForCheck();
      },
    });
  }

  private loadFavoriteCount() {
    if (!this.testimony) return;
    this.collectionService.getFavoriteCount(this.testimony.id).subscribe({
      next: (count) => {
        if (this.testimony) {
          this.testimony.favoriteCount = count;
          this.cdr.markForCheck();
        }
      },
      error: (error) => {
        console.error('Error al obtener el conteo de favoritos:', error);
        this.snackBar.open('Error al cargar el conteo de favoritos', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private loadFavorites() {
    this.favoritosSubscription = this.collectionService.getFavorites().subscribe({
      next: (favs) => {
        this.favoritosMios = favs;
        this.isFavorite = this.testimony ? this.favoritosMios.includes(this.testimony.id) : false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al obtener favoritos:', error);
        this.snackBar.open('Error al cargar favoritos', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private loadTranscriptions() {
    if (!this.testimony) return;
    this.transcripcionesSubscription = this.transcriptionService
      .obtenerTranscripcionesPorTestimonio(this.testimony.id)
      .subscribe({
        next: (transcripciones) => {
          this.transcripciones = transcripciones;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error al obtener transcripciones:', error);
          this.snackBar.open('Error al cargar transcripciones', 'Cerrar', { duration: 3000 });
        },
      });
  }

  private loadUserRating() {
    if (!this.authStore.isAuthenticated() || !this.testimony) {
      this.currentRating = 0;
      this.currentRatingId = null;
      this.ratingControl.setValue(null, { emitEvent: false });
      this.cdr.markForCheck();
      return;
    }

    this.isRatingLoading = true;
    this.cdr.markForCheck();

    this.calificationService.getUserRatingForTestimony(this.testimony.id).subscribe({
      next: (calificacion) => {
        if (calificacion) {
          this.currentRating = calificacion.puntuacion;
          this.currentRatingId = calificacion.id_calificacion;
          this.ratingControl.setValue(calificacion.puntuacion, { emitEvent: false });
        } else {
          this.currentRating = 0;
          this.currentRatingId = null;
          this.ratingControl.setValue(null, { emitEvent: false });
        }
        this.isRatingLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar la calificación:', error);
        this.snackBar.open('Error al cargar la calificación', 'Cerrar', { duration: 3000 });
        this.currentRating = 0;
        this.currentRatingId = null;
        this.ratingControl.setValue(null, { emitEvent: false });
        this.isRatingLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  esFavorito(): boolean {
    return this.testimony ? this.favoritosMios.includes(this.testimony.id) : false;
  }

  goBack() {
    this.location.back();
  }

  toggleMeta() {
    this.isMetaExpanded = !this.isMetaExpanded;
  }

  toggleTranscription() {
    this.isTranscriptionExpanded = !this.isTranscriptionExpanded;
  }

  toggleDescription() {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }

  get canRequestTranscription(): boolean {
    return this.authStore.isAuthenticated() && this.transcripciones.length === 0 && !!this.testimony;
  }

  requestTranscription() {
    if (!this.canRequestTranscription || !this.testimony) return;

    this.transcriptionService.transcribirArchivo(this.testimony.id).subscribe({
      next: (transcripcion) => {
        this.transcripciones = [transcripcion];
        this.isTranscriptionExpanded = true;
        this.snackBar.open('Transcripción solicitada con éxito', 'Cerrar', { duration: 3000 });
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al solicitar transcripción:', error);
        this.snackBar.open('Error al solicitar transcripción', 'Cerrar', { duration: 3000 });
      },
    });
  }

  rateTestimony(rating: number) {
    if (!this.authStore.isAuthenticated()) {
      this.snackBar.open('Debes iniciar sesión para calificar', 'Cerrar', { duration: 3000 });
      return;
    }

    if (rating < 1 || rating > 5) {
      this.snackBar.open('La puntuación debe estar entre 1 y 5', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.isRatingLoading || !this.testimony) return;

    if (this.currentRating === rating && this.currentRatingId) {
      this.isRatingLoading = true;
      this.cdr.markForCheck();
      this.calificationService.delete(this.currentRatingId).subscribe({
        next: () => {
          this.currentRating = 0;
          this.currentRatingId = null;
          this.ratingControl.setValue(null, { emitEvent: false });
          this.snackBar.open('Calificación eliminada', 'Cerrar', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open(error.message || 'Error al eliminar la calificación', 'Cerrar', { duration: 3000 });
        },
        complete: () => {
          this.isRatingLoading = false;
          this.cdr.markForCheck();
        },
      });
      return;
    }

    this.isRatingLoading = true;
    this.cdr.markForCheck();

    if (this.currentRatingId) {
      this.calificationService.update(this.currentRatingId, { puntuacion: rating }).subscribe({
        next: (calificacion) => {
          this.currentRating = calificacion.puntuacion;
          this.ratingControl.setValue(calificacion.puntuacion, { emitEvent: false });
          this.snackBar.open('Calificación actualizada', 'Cerrar', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open(error.message || 'Error al actualizar la calificación', 'Cerrar', { duration: 3000 });
        },
        complete: () => {
          this.isRatingLoading = false;
          this.cdr.markForCheck();
        },
      });
    } else {
      this.calificationService
        .create({ puntuacion: rating, id_testimonio: this.testimony.id })
        .subscribe({
          next: (calificacion) => {
            this.currentRating = calificacion.puntuacion;
            this.currentRatingId = calificacion.id_calificacion;
            this.ratingControl.setValue(calificacion.puntuacion, { emitEvent: false });
            this.snackBar.open('Calificación enviada', 'Cerrar', { duration: 3000 });
          },
          error: (error) => {
            if (error.message.includes('El usuario ya ha calificado este testimonio')) {
              this.loadUserRating();
              this.snackBar.open('Ya has calificado este testimonio', 'Cerrar', { duration: 3000 });
            } else {
              this.snackBar.open(error.message || 'Error al enviar la calificación', 'Cerrar', { duration: 3000 });
            }
          },
          complete: () => {
            this.isRatingLoading = false;
            this.cdr.markForCheck();
          },
        });
    }
  }

  shareTestimony() {
    if (!this.testimony) return;
    const url = `${window.location.origin}/testimonies/${this.testimony.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: this.testimony.title,
          text: this.testimony.description,
          url,
        })
        .catch(() => this.copyLink(url));
    } else {
      this.copyLink(url);
    }
  }

  addToCollection() {
    if (!this.authStore.isAuthenticated()) {
      this.snackBar.open('Debes iniciar sesión para agregar a una colección', 'Cerrar', {
        duration: 3000,
      });
      return;
    }
    if (!this.testimony) return;
    this.dialog.open(AddToCollectionComponent, {
      data: { testimonyId: this.testimony.id },
      width: '500px',
    });
  }

  addToFavorites() {
    if (!this.testimony) return;
    const id = this.testimony.id;
    if (!this.authStore.isAuthenticated()) {
      this.snackBar.open('Debes iniciar sesión para agregar a favoritos', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    this.collectionService.toggleFavorite(id).subscribe({
      next: (response) => {
        if (this.isFavorite) {
          this.favoritosMios = this.favoritosMios.filter((favId) => favId !== id);
          this.snackBar.open('Testimonio eliminado de favoritos', 'Cerrar', {
            duration: 3000,
          });
        } else {
          this.favoritosMios = [...this.favoritosMios, id];
          this.snackBar.open('Testimonio agregado a favoritos', 'Cerrar', {
            duration: 3000,
          });
        }
        this.isFavorite = !this.isFavorite;
        this.loadFavoriteCount();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al togglear favorito:', error);
        this.snackBar.open('Error al actualizar favoritos', 'Cerrar', { duration: 3000 });
      },
    });
  }

  downloadTestimony() {
    if (!this.testimony) return;
    this.testimonyService.downloadTestimony(this.testimony).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const extension = this.getFileExtension();
        a.download = `${this.testimony!.title || 'testimonio'}.${extension}`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Error al descargar el testimonio', 'Cerrar', {
          duration: 5000,
        });
      },
    });
  }

  private getFileExtension(): string {
    if (!this.testimony) return 'mp4';
    const format = this.testimony.format?.toLowerCase();
    if (format && ['mp4', 'mov', 'mp3', 'wav'].includes(format)) {
      return format;
    }
    const urlParts = this.testimony.url?.split('.');
    const urlExtension = urlParts?.[urlParts.length - 1]?.toLowerCase();
    if (urlExtension && ['mp4', 'mov', 'mp3', 'wav'].includes(urlExtension)) {
      return urlExtension;
    }
    return this.testimony.url?.includes('video') ? 'mp4' : 'mp3';
  }

  suggestImprovement() {
    if (!this.testimony) return;
    const dialogRef = this.dialog.open(SuggestionDialogComponent, {
      data: { testimonyId: this.testimony.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.testimonyService
          .suggestImprovement(this.testimony!.id, result.field, result.value)
          .subscribe({
            next: () => alert('Sugerencia enviada con éxito'),
            error: () => alert('Error al enviar la sugerencia'),
          });
      }
    });
  }

  private copyLink(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      alert('Enlace copiado al portapapeles');
    });
  }

  getRelativeTime(createdAt: string | Date): string {
    if (!createdAt) return 'Desconocido';
    const now = new Date();
    const date = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
    if (isNaN(date.getTime())) return 'Fecha inválida';
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffMonth / 12);
    if (diffSec < 60) return 'hace un instante';
    else if (diffMin < 60) return `hace ${diffMin} minuto${diffMin === 1 ? '' : 's'}`;
    else if (diffHr < 24) return `hace ${diffHr} hora${diffHr === 1 ? '' : 's'}`;
    else if (diffDay < 30) return `hace ${diffDay} día${diffDay === 1 ? '' : 's'}`;
    else if (diffMonth < 12) return `hace ${diffMonth} mes${diffMonth === 1 ? '' : 'es'}`;
    else return `hace ${diffYear} año${diffYear === 1 ? '' : 's'}`;
  }

  get canDownload() {
    return !!this.testimony;
  }
}