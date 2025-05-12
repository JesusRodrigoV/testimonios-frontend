import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { RouterLink } from "@angular/router";
import { Collection } from "../../models/collection.model";
import { AuthStore } from "@app/auth.store";
import { CollectionService } from "../../services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SpinnerComponent } from "@app/features/shared/ui/spinner";
import { DatePipe, NgIf } from "@angular/common";

@Component({
  selector: "app-collection-list",
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    RouterLink,
    SpinnerComponent,
    ReactiveFormsModule,
    DatePipe,
    NgIf,
  ],
  templateUrl: "./collection-list.component.html",
  styleUrl: "./collection-list.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CollectionListComponent {
  private readonly authStore = inject(AuthStore);
  private readonly collectionService = inject(CollectionService);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  collections = signal<Collection[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  saving = signal(false);
  collectionForm: FormGroup;
  dialogRef?: MatDialogRef<any>;
  isAuthenticated = this.authStore.isAuthenticated;

  @ViewChild("formTemplate") formTemplate!: TemplateRef<any>;

  constructor() {
    this.collectionForm = this.fb.group({
      titulo: ["", Validators.required],
      descripcion: [""],
    });
    this.loadCollections();
  }

  loadCollections() {
    if (!this.isAuthenticated()) {
      this.error.set("Debes iniciar sesión para ver tus colecciones");
      return;
    }
    this.loading.set(true);
    this.collectionService.getAll().subscribe({
      next: (collections) => {
        this.collections.set(collections);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Error al cargar las colecciones");
        this.loading.set(false);
      },
    });
  }

  openCollectionForm(collection?: Collection) {
    if (!this.isAuthenticated()) {
      this.snackBar.open(
        "Debes iniciar sesión para crear/editar colecciones",
        "Cerrar",
        { duration: 3000 },
      );
      return;
    }
    if (collection) {
      this.collectionForm.patchValue({
        titulo: collection.titulo,
        descripcion: collection.descripcion,
      });
    } else {
      this.collectionForm.reset();
    }

    this.dialogRef = this.dialog.open(this.formTemplate, {
      data: { collection },
      width: "500px",
    });
  }

  closeCollectionForm() {
    this.dialogRef?.close();
  }

  saveCollection(collection?: Collection) {
    if (this.collectionForm.invalid || !this.isAuthenticated()) return;

    this.saving.set(true);
    const collectionData = {
      ...this.collectionForm.value,
      id_usuario: this.authStore.user()?.id_usuario,
      fecha_creacion: collection
        ? collection.fecha_creacion
        : new Date().toISOString(),
    };

    if (collection) {
      this.collectionService
        .update(collection.id_coleccion, collectionData)
        .subscribe({
          next: () => {
            this.loadCollections();
            this.snackBar.open("Colección actualizada", "Cerrar", {
              duration: 3000,
            });
            this.closeCollectionForm();
            this.saving.set(false);
          },
          error: () => {
            this.snackBar.open("Error al actualizar la colección", "Cerrar", {
              duration: 3000,
            });
            this.saving.set(false);
          },
        });
    } else {
      this.collectionService.create(collectionData).subscribe({
        next: () => {
          this.loadCollections();
          this.snackBar.open("Colección creada", "Cerrar", { duration: 3000 });
          this.closeCollectionForm();
          this.saving.set(false);
        },
        error: () => {
          this.snackBar.open("Error al crear la colección", "Cerrar", {
            duration: 3000,
          });
          this.saving.set(false);
        },
      });
    }
  }

  deleteCollection(id: number) {
    if (!this.isAuthenticated()) {
      this.snackBar.open(
        "Debes iniciar sesión para eliminar colecciones",
        "Cerrar",
        { duration: 3000 },
      );
      return;
    }
    if (confirm("¿Estás seguro de eliminar esta colección?")) {
      this.collectionService.delete(id).subscribe({
        next: () => {
          this.loadCollections();
          this.snackBar.open("Colección eliminada", "Cerrar", {
            duration: 3000,
          });
        },
        error: () =>
          this.snackBar.open("Error al eliminar la colección", "Cerrar", {
            duration: 3000,
          }),
      });
    }
  }
}

