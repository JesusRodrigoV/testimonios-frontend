import { DatePipe, NgClass, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
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
import { TestimonioService } from "@app/features/testimony/services";
import { SuggestionDialogComponent } from "../../suggestion-dialog";
import { MatMenuModule } from "@angular/material/menu";
import { VideoPlayerComponent } from "@app/features/shared/video-player";
import { AddToCollectionComponent } from "@app/features/collections/components/add-to-collection";
import { AuthStore } from "@app/auth.store";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CollectionService } from "@app/features/collections/services";
import { Subscription } from "rxjs";

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
  showRating = false;
  currentRating = 0;
  isMetaExpanded = false;
  isTranscriptionExpanded = false;
  ratingControl = new FormControl<number | null>(null);
  favoritosMios: number[] = [];
  isFavorite = false;
  private favoritosSubscription: Subscription | undefined;

  readonly dialogRef = inject(MatDialogRef<TestimonyModalComponent>);
  readonly dialog = inject(MatDialog);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly testimony: Testimony = this.data.testimony;
  readonly testimonyService = inject(TestimonioService);
  readonly authStore = inject(AuthStore);
  readonly snackBar = inject(MatSnackBar);
  readonly collectionService = inject(CollectionService);

  ngOnInit() {
    this.favoritosSubscription = this.collectionService.getFavorites().subscribe({
      next: (favs) => {
        this.favoritosMios = favs;
        this.isFavorite = this.favoritosMios.includes(this.testimony.id);
      },
      error: (error) => {
        console.error('Error al obtener favoritos:', error);
        this.snackBar.open('Error al cargar favoritos', 'Cerrar', { duration: 3000 });
      },
    });
  }

  ngOnDestroy() {
    
    if (this.favoritosSubscription) {
      this.favoritosSubscription.unsubscribe();
    }
  }

  esFavorito(): boolean {
    return this.favoritosMios.includes(this.testimony.id);
  }

  closeModal() {
    this.dialogRef.close();
  }

  toggleMeta() {
    this.isMetaExpanded = !this.isMetaExpanded;
  }

  toggleTranscription() {
    
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
    if (!this.authStore.isAuthenticated()) {
      this.snackBar.open('Debes iniciar sesión para agregar a favoritos', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    this.collectionService.toggleFavorite(this.testimony.id).subscribe({
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
      },
      error: (error) => {
        console.error('Error al togglear favorito:', error);
        this.snackBar.open('Error al actualizar favoritos', 'Cerrar', { duration: 3000 });
      },
    });
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
      error: () => alert('Error al descargar el testimonio'),
    });
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