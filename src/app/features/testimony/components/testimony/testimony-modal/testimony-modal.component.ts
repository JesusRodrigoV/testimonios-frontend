import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Testimony } from '@app/features/testimony/models/testimonio.model';
import { TestimonyCommentsComponent } from '../testimony-comments';
import { MatDialogModule } from '@angular/material/dialog';
import { TestimonioService } from '@app/features/testimony/services';
import { AuthService } from '@app/features/auth/services/auth';
import { SuggestionDialogComponent } from '../../suggestion-dialog';
import { MatMenuModule } from '@angular/material/menu';
import { VideoPlayerComponent } from '@app/features/shared/video-player';
import { AudioPlayerComponent } from '@app/features/shared/audio-player';

@Component({
  selector: 'app-testimony-modal',
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
    AudioPlayerComponent
  ],
  templateUrl: './testimony-modal.component.html',
  styleUrl: './testimony-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestimonyModalComponent {
  isFavorite = false;
  showRating = false;
  currentRating = 0;
  isMetaExpanded = false;
  isTranscriptionExpanded = false;
  ratingControl = new FormControl<number | null>(null);

  readonly dialogRef = inject(MatDialogRef<TestimonyModalComponent>);
  readonly dialog = inject(MatDialog);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly testimony: Testimony = this.data.testimony;
  readonly testimonyService = inject(TestimonioService);
  readonly authService = inject(AuthService);

  closeModal() {
    this.dialogRef.close();
  }

  toggleMeta() {
    this.isMetaExpanded = !this.isMetaExpanded;
  }

  toggleTranscription() {
    if (!this.testimony) {
      this.testimonyService.getTranscription(this.testimony).subscribe({
        next: (transcription) => {

          this.isTranscriptionExpanded = true;
        },
        error: () => alert('Error al cargar la transcripción')
      });
    } else {
      this.isTranscriptionExpanded = !this.isTranscriptionExpanded;
    }
  }

  toggleFavorite() {

  }

  toggleRating() {
    this.showRating = !this.showRating;
  }

  rateTestimony(rating: number) {
    this.currentRating = rating;
    console.log('Calificación:', rating);
    this.showRating = false;

    setTimeout(() => {
      this.showRating = false;
    }, 1000);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.rating-container')) {
      this.showRating = false;
    }
  }

  shareTestimony() {
    const url = `${window.location.origin}/testimonies/${this.testimony.id}`;
    if (navigator.share) {
      navigator.share({
        title: this.testimony.title,
        text: this.testimony.description,
        url
      }).catch(() => this.copyLink(url));
    } else {
      this.copyLink(url);
    }
  }

  downloadTestimony() {
    this.testimonyService.downloadTestimony(this.testimony.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.testimony.title}.${this.testimony.format.toLowerCase()}`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => alert('Error al descargar el testimonio')
    });
  }

  suggestImprovement() {
    const dialogRef = this.dialog.open(SuggestionDialogComponent, {
      data: { testimonyId: this.testimony.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.testimonyService.suggestImprovement(this.testimony.id, result.field, result.value)
          .subscribe({
            next: () => alert('Sugerencia enviada con éxito'),
            error: () => alert('Error al enviar la sugerencia')
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