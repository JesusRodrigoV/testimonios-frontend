import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Collection } from "../../models/collection.model";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from "@angular/material/dialog";
import { AuthStore } from "@app/auth.store";
import { CollectionService } from "../../services";
import { MatIconModule } from "@angular/material/icon";
import { SpinnerComponent } from "@app/features/shared/ui/spinner";
import { MatSnackBar } from "@angular/material/snack-bar";

import { forkJoin } from "rxjs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "app-add-to-collection",
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule
],
  templateUrl: "./add-to-collection.component.html",
  styleUrl: "./add-to-collection.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToCollectionComponent {
  private readonly authStore = inject(AuthStore);
  private readonly collectionService = inject(CollectionService);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  collections = signal<Collection[]>([]);
  selectedCollectionIds = signal<number[]>([]);
  showCreateForm = signal(false);
  collectionForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    public dialogRef: MatDialogRef<AddToCollectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { testimonyId: number }
  ) {
    this.collectionForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
    });
    this.loadCollections();
  }

  loadCollections() {
    if (!this.authStore.isAuthenticated()) {
      this.error.set('Debes iniciar sesión para ver tus colecciones');
      return;
    }
    this.loading.set(true);
    this.collectionService.getAll().subscribe({
      next: (collections) => {
        const filteredCollections = collections.filter(collection =>
          !collection.titulo.toLowerCase().includes('favoritos')
        );
        this.collections.set(filteredCollections);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar las colecciones');
        this.loading.set(false);
      },
    });
  }

  toggleCollection(id: number) {
    const currentIds = this.selectedCollectionIds();
    if (currentIds.includes(id)) {
      this.selectedCollectionIds.set(currentIds.filter((cid) => cid !== id));
    } else {
      this.selectedCollectionIds.set([...currentIds, id]);
    }
  }

  toggleCreateForm() {
    this.showCreateForm.set(!this.showCreateForm());
  }

  addToCollection() {
    if (!this.authStore.isAuthenticated()) {
      this.snackBar.open('Debes iniciar sesión para agregar a una colección', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    this.loading.set(true);

    if (this.showCreateForm() && this.collectionForm.valid) {
      const collectionData = {
        ...this.collectionForm.value,
        id_usuario: this.authStore.user()?.id_usuario,
        fecha_creacion: new Date().toISOString(),
      };
      this.collectionService.create(collectionData).subscribe({
        next: (newCollection) => {
          this.addTestimonyToCollection(newCollection.id_coleccion);
        },
        error: () => {
          this.snackBar.open('Error al crear la colección', 'Cerrar', { duration: 3000 });
          this.loading.set(false);
        },
      });
    } else if (this.selectedCollectionIds().length > 0) {
      this.addTestimonyToSelectedCollections();
    } else {
      this.snackBar.open('Selecciona al menos una colección o crea una nueva', 'Cerrar', {
        duration: 3000,
      });
      this.loading.set(false);
    }
  }

  private addTestimonyToCollection(collectionId: number) {
    this.collectionService.addTestimony(collectionId, this.data.testimonyId).subscribe({
      next: () => {
        this.snackBar.open('Testimonio agregado a la colección', 'Cerrar', {
          duration: 3000,
        });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Error al agregar el testimonio', 'Cerrar', { duration: 3000 });
        this.loading.set(false);
      },
    });
  }

  private addTestimonyToSelectedCollections() {
    const requests = this.selectedCollectionIds().map((id) =>
      this.collectionService.addTestimony(id, this.data.testimonyId)
    );
    forkJoin(requests).subscribe({
      next: () => {
        this.snackBar.open('Testimonio agregado a las colecciones seleccionadas', 'Cerrar', {
          duration: 3000,
        });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Error al agregar el testimonio a algunas colecciones', 'Cerrar', {
          duration: 3000,
        });
        this.loading.set(false);
      },
    });
  }
}