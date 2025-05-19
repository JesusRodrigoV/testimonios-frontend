
import { DatePipe, NgClass, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { Testimony } from "@app/features/testimony/models/testimonio.model";
import { TestimonyCommentsComponent } from "../testimony-comments";
import { MatDialogModule } from "@angular/material/dialog";
import { CalificationService, TestimonioService, TranscriptionService } from "@app/features/testimony/services";
import { SuggestionDialogComponent } from "../../suggestion-dialog";
import { MatMenuModule } from "@angular/material/menu";
import { VideoPlayerComponent } from "@app/features/shared/video-player";
import { AddToCollectionComponent } from "@app/features/collections/components/add-to-collection";
import { AuthStore } from "@app/auth.store";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CollectionService } from "@app/features/collections/services";
import { Subscription } from "rxjs";
import { Transcripcion } from "@app/features/testimony/models/transcription.model";

@Component({
  selector: "app-testimony-modal",
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
  ],
  templateUrl: "./testimony-modal.component.html",
  styleUrl: "./testimony-modal.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonyModalComponent implements OnInit, OnDestroy {
  currentRating = 0;
  currentRatingId: number | null = null;
  isMetaExpanded = false;
  isTranscriptionExpanded = false;
  isRatingLoading = false;
  ratingControl = new FormControl<number | null>(null);
  favoritosMios: number[] = [];
  isFavorite = false;
  transcripciones: Transcripcion[] = [];
  private favoritosSubscription: Subscription | undefined;
  private transcripcionesSubscription: Subscription | undefined;

  readonly dialogRef = inject(MatDialogRef<TestimonyModalComponent>);
  readonly dialog = inject(MatDialog);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly testimony: Testimony = this.data.testimony;
  readonly testimonyService = inject(TestimonioService);
  readonly authStore = inject(AuthStore);
  readonly snackBar = inject(MatSnackBar);
  readonly collectionService = inject(CollectionService);
  readonly transcriptionService = inject(TranscriptionService);
  readonly calificationService = inject(CalificationService);
  readonly cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadFavorites();
    this.loadTranscriptions();
    this.loadUserRating();
  }

  ngOnDestroy() {
    if (this.favoritosSubscription) {
      this.favoritosSubscription.unsubscribe();
    }
    if (this.transcripcionesSubscription) {
      this.transcripcionesSubscription.unsubscribe();
    }
  }

  getFavoriteCount(id: number) {
    this.collectionService.getFavoriteCount(id).subscribe({
      next: (count) => {
        this.testimony.favoriteCount = count;
        this.cdr.markForCheck();
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
        this.isFavorite = this.favoritosMios.includes(this.testimony.id);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al obtener favoritos:', error);
        this.snackBar.open('Error al cargar favoritos', 'Cerrar', { duration: 3000 });
      },
    });
  }

  private loadTranscriptions() {
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
    if (!this.authStore.isAuthenticated()) {
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
      }
    });
  }

  esFavorito(): boolean {
    return this.favoritosMios.includes(this.testimony.id);
  }

  closeModal() {
    this.dialogRef.close();
  }

  toggleMeta() {
    this.isMetaExpanded = !this.isMetaExpanded;
    this.cdr.markForCheck();
  }

  toggleTranscription() {
    this.isTranscriptionExpanded = !this.isTranscriptionExpanded;
    this.cdr.markForCheck();
  }

  get canRequestTranscription(): boolean {
    return (
      this.authStore.isAuthenticated() &&
      this.transcripciones.length === 0
    );
  }

  requestTranscription() {
    if (!this.canRequestTranscription) return;

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

    if (this.isRatingLoading) return;

    // Si intenta calificar con el mismo valor, eliminar la calificación
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
        }
      });
      return;
    }

    this.isRatingLoading = true;
    this.cdr.markForCheck();

    if (this.currentRatingId) {
      // Actualizar calificación existente
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
        }
      });
    } else {
      // Crear nueva calificación
      this.calificationService.create({ puntuacion: rating, id_testimonio: this.testimony.id }).subscribe({
        next: (calificacion) => {
          this.currentRating = calificacion.puntuacion;
          this.currentRatingId = calificacion.id_calificacion;
          this.ratingControl.setValue(calificacion.puntuacion, { emitEvent: false });
          this.snackBar.open('Calificación enviada', 'Cerrar', { duration: 3000 });
        },
        error: (error) => {
          if (error.message.includes('El usuario ya ha calificado este testimonio')) {
            // Reintentar cargar la calificación existente
            this.loadUserRating();
            this.snackBar.open('Ya has calificado este testimonio', 'Cerrar', { duration: 3000 });
          } else {
            this.snackBar.open(error.message || 'Error al enviar la calificación', 'Cerrar', { duration: 3000 });
          }
        },
        complete: () => {
          this.isRatingLoading = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  shareTestimony() {
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
    this.dialog.open(AddToCollectionComponent, {
      data: { testimonyId: this.testimony.id },
      width: '500px',
    });
  }

  addToFavorites() {
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
          this.favoritosMios = this.favoritosMios.filter((id) => id !== this.testimony.id);
          this.snackBar.open('Testimonio eliminado de favoritos', 'Cerrar', {
            duration: 3000,
          });
        } else {
          this.favoritosMios = [...this.favoritosMios, this.testimony.id];
          this.snackBar.open('Testimonio agregado a favoritos', 'Cerrar', {
            duration: 3000,
          });
        }
        this.isFavorite = !this.isFavorite;
        this.getFavoriteCount(id);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al togglear favorito:', error);
        this.snackBar.open('Error al actualizar favoritos', 'Cerrar', { duration: 3000 });
      },
    });
  }

  downloadTestimony() {
    this.testimonyService.downloadTestimony(this.testimony).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const extension = this.getFileExtension();
        a.download = `${this.testimony.title || 'testimonio'}.${extension}`;
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
    const dialogRef = this.dialog.open(SuggestionDialogComponent, {
      data: { testimonyId: this.testimony.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.testimonyService
          .suggestImprovement(this.testimony.id, result.field, result.value)
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

    if (diffSec < 60) {
      return 'hace un instante';
    } else if (diffMin < 60) {
      return `hace ${diffMin} minuto${diffMin === 1 ? '' : 's'}`;
    } else if (diffHr < 24) {
      return `hace ${diffHr} hora${diffHr === 1 ? '' : 's'}`;
    } else if (diffDay < 30) {
      return `hace ${diffDay} día${diffDay === 1 ? '' : 's'}`;
    } else if (diffMonth < 12) {
      return `hace ${diffMonth} mes${diffMonth === 1 ? '' : 'es'}`;
    } else {
      return `hace ${diffYear} año${diffYear === 1 ? '' : 's'}`;
    }
  }

  get canDownload() {
    return true;
  }
}
