import { NgIf, NgFor, AsyncPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { FormsModule, NgForm, ReactiveFormsModule } from "@angular/forms";
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import {
  MatChipInputEvent,
  MatChipsModule,
  MatChipInputEvent,
  MatChipRow,
  MatChipRemove,
} from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { TestimonyInput } from "@app/models/testimonio.model";
import { TestimonioService } from "@app/services/testimonio/testimonio.service";
import { environment } from "src/environment/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-testimony-upload",
  standalone: true,
  imports: [
    FormsModule,
    MatChipGrid,
    MatChipRow,
    MatChipRemove,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    AsyncPipe,
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
  ],
  templateUrl: "./testimony-upload.component.html",
  styleUrl: "./testimony-upload.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TestimonyUploadComponent implements OnInit {
  testimony: TestimonyInput & {
selectedTags = new FormControl([]);
    selectedCategories: string[];
  } = {
    title: "",
    description: "",
    content: "",
    selectedTags: [],
    selectedCategories: [],
    eventId: undefined,
    latitude: undefined,
    longitude: undefined,
    url: "",
    duration: undefined,
    format: "",
  };
  cloudinaryResult: {
    secure_url: string;
    duration?: number;
    format: string;
  } | null = null;
  mediaPreview: string | null = null;
  mediaType: "video" | "audio" | null = null;
  error: string | null = null;
  success: string | null = null;
  submitting = false;

  // Listas cargadas desde el backend
  categories: { id: number; name: string; description: string }[] = [];
  tags: { id: number; name: string }[] = [];
  events: { id: number; name: string; description: string; date: string }[] =
    [];

  // Para el autocompletado de etiquetas
  tagCtrl = new FormControl<string>("");
  filteredTags: Observable<string[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  private tagsSubject = new BehaviorSubject<string[]>([]);

  private http = inject(HttpClient);
  private testimonyService = inject(TestimonioService);

  constructor() {
    // Configuramos el autocompletado de etiquetas
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(""),
      map((value) => this._filterTags(value || "")),
    );
  }

  ngOnInit(): void {
    this.loadMetadata();
  }

  loadMetadata(): void {
    // Cargar categorías
    this.testimonyService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        this.error = "Error al cargar categorías: " + err.message;
      },
    });

    // Cargar etiquetas
    this.testimonyService.getAllTags().subscribe({
      next: (data) => {
        this.tags = data;
        this.tagsSubject.next(data.map((tag) => tag.name));
      },
      error: (err) => {
        this.error = "Error al cargar etiquetas: " + err.message;
      },
    });

    // Cargar eventos
    this.testimonyService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
      },
      error: (err) => {
        this.error = "Error al cargar eventos: " + err.message;
      },
    });
  }

  private _filterTags(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.tags
      .map((tag) => tag.name)
      .filter((tag) => tag.toLowerCase().includes(filterValue));
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.mediaType = file.type.startsWith("video") ? "video" : "audio";
    this.mediaPreview = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", environment.cloudinary.uploadPreset);
    formData.append("folder", "legado_bolivia/testimonies");
    formData.append("resource_type", "auto");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const result = await response.json();
      if (!response.ok) {
        console.error("Cloudinary upload error:", result);
        throw new Error(
          result.error?.message || "Error al subir archivo a Cloudinary",
        );
      }
      this.cloudinaryResult = {
        secure_url: result.secure_url,
        duration: result.duration,
        format: result.format,
      };
      this.testimony.url = result.secure_url;
      this.testimony.duration = result.duration
        ? Math.round(result.duration)
        : undefined;
      this.testimony.format = this.mediaType || "audio";
      this.error = null;
    } catch (error) {
      console.error("Upload error details:", error);
      this.error =
        error instanceof Error ? error.message : "Error al subir archivo";
      this.cloudinaryResult = null;
      this.mediaPreview = null;
      this.mediaType = null;
    }
  }

  submitTestimony(form: NgForm): void {
    if (!this.cloudinaryResult) {
      this.error = "Por favor, sube un archivo antes de enviar";
      return;
    }

    if (form.invalid) {
      this.error = "Por favor, completa todos los campos requeridos";
      return;
    }

    // Validación personalizada para longitud mínima
    if (this.testimony.description.length < 5) {
      this.error = "La descripción debe tener al menos 5 caracteres";
      return;
    }
    if (this.testimony.content && this.testimony.content.length < 5) {
      this.error = "El contenido debe tener al menos 5 caracteres";
      return;
    }

    this.submitting = true;
    this.error = null;
    this.success = null;

    const payload: TestimonyInput = {
      title: this.testimony.title,
      description: this.testimony.description,
      content: this.testimony.content,
      url: this.testimony.url,
      duration: this.testimony.duration,
      format: this.testimony.format,
      tags: this.testimony.selectedTags,
      categories: this.testimony.selectedCategories,
      eventId:
        this.testimony.eventId === null ? undefined : this.testimony.eventId,
      latitude:
        this.testimony.latitude === null ? undefined : this.testimony.latitude,
      longitude:
        this.testimony.longitude === null
          ? undefined
          : this.testimony.longitude,
    };

    console.log("Submitting testimony payload:", payload);

    this.testimonyService.createTestimony(payload).subscribe({
      next: () => {
        this.success = "Testimonio subido exitosamente";
        this.submitting = false;
        this.resetForm();
        form.resetForm();
      },
      error: (err) => {
        console.error("Backend submission error:", err);
        let errorMessage =
          err.message || "Error al enviar testimonio al servidor";
        if (err.message.includes("url")) {
          errorMessage =
            "Error con el archivo multimedia. Por favor, intenta subir el archivo nuevamente.";
        } else if (err.message.includes("eventId")) {
          errorMessage =
            "Error con el evento seleccionado. Por favor, verifica la selección.";
        } else if (err.message.includes("Invalid type")) {
          errorMessage =
            "Error en los datos numéricos (evento, latitud o longitud). Déjalos en blanco si no aplican.";
        }
        this.error = errorMessage;
        this.submitting = false;
      },
    });
  }

  resetForm(): void {
    this.testimony = {
      title: "",
      description: "",
      content: "",
      selectedTags: [],
      selectedCategories: [],
      eventId: undefined,
      latitude: undefined,
      longitude: undefined,
      url: "",
      duration: undefined,
      format: "",
    };
    this.cloudinaryResult = null;
    this.mediaPreview = null;
    this.mediaType = null;
    this.tagCtrl.setValue("");
  }

  clearError(): void {
    this.error = null;
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();
    if (value) {
      this.selectedTags.setValue([...this.selectedTags.value, value]);
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    const tags = this.selectedTags.value.filter((t: string) => t !== tag);
    this.selectedTags.setValue(tags);
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    const value: string = event.option.value;
    if (!this.testimony.selectedTags.includes(value)) {
      this.testimony.selectedTags.push(value);
    }
    this.tagCtrl.setValue("");
  }
}
