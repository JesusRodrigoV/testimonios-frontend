import { AsyncPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule, NgForm, ReactiveFormsModule } from "@angular/forms";
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatChipInputEvent, MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { TestimonyInput } from "@app/features/testimony/models/testimonio.model";
import { environment } from "src/environment/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { TestimonioService } from "@app/features/testimony/services";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { SpinnerComponent } from "@app/features/shared/ui/spinner";
import { Router } from "@angular/router";
import { FileUploadComponent } from "./file-upload";
import { MatStepperModule } from "@angular/material/stepper";

const MEDIA_TYPES = ["Video", "Audio"] as const;
type MediaType = (typeof MEDIA_TYPES)[number];

@Component({
  selector: "app-testimony-upload",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatStepperModule,
    SpinnerComponent,
    FileUploadComponent,
    AsyncPipe,
    DatePipe,
  ],
  templateUrl: "./testimony-upload.component.html",
  styleUrl: "./testimony-upload.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TestimonyUploadComponent implements OnInit {
  private testimonyService = inject(TestimonioService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  // Estado del testimonio
  testimony = signal<TestimonyInput & { selectedTags: string[]; selectedCategories: string[] }>({
    title: '',
    description: '',
    content: '',
    selectedTags: [],
    selectedCategories: [],
    eventId: undefined,
    latitude: undefined,
    longitude: undefined,
    url: '',
    duration: undefined,
    format: '',
  });

  // Estado de la subida
  cloudinaryResult = signal<{ secure_url: string; duration?: number; format: string } | null>(null);
  mediaPreview = signal<string | null>(null);
  mediaType = signal<MediaType | null>(null);
  private _shareLocation = signal<boolean>(false);
  get shareLocation(): boolean { return this._shareLocation(); }
  set shareLocation(value: boolean) { this._shareLocation.set(value); }
  submitting = signal<boolean>(false);
  cargandoTestimonio = signal<boolean>(false);
  eventName = signal<string>('Ninguno');

  // Metadatos
  categories = signal<{ id_categoria: number; nombre: string; descripcion: string }[]>([]);
  tags = signal<{ id: number; name: string }[]>([]);
  events = signal<{ id: number; name: string; description: string; date: string }[]>([]);

  // Control de etiquetas
  tagCtrl = new FormControl<string>('');
  filteredTags: Observable<string[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  private tagsSubject = new BehaviorSubject<string[]>([]);

  constructor() {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterTags(value || '')),
    );
  }

  ngOnInit(): void {
    this.loadMetadata();
  }

  // Carga de metadatos
  private loadMetadata(): void {
    this.testimonyService.getAllCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => this.showError('cargar categorías', err),
    });

    this.testimonyService.getAllTags().subscribe({
      next: (data) => {
        this.tags.set(data);
        this.tagsSubject.next(data.map(tag => tag.name));
      },
      error: (err) => this.showError('cargar etiquetas', err),
    });

    this.testimonyService.getAllEvents().subscribe({
      next: (data) => {
        this.events.set(data);
        this.updateEventName();
      },
      error: (err) => this.showError('cargar eventos', err),
    });
  }

  // Filtrado de etiquetas
  private filterTags(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.tags().map(tag => tag.name).filter(tag => tag.toLowerCase().includes(filterValue));
  }

  // Gestión de archivos
  async onFileSelected(file: File | null): Promise<void> {
    if (!file) {
      this.resetMedia();
      return;
    }

    this.cargandoTestimonio.set(true);
    const mediaType = file.type.startsWith('video') ? 'Video' : 'Audio';
    this.mediaType.set(mediaType);
    this.mediaPreview.set(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinary.uploadPreset);
    formData.append('folder', 'legado_bolivia/testimonies');
    formData.append('resource_type', 'auto');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/upload`,
        { method: 'POST', body: formData },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || 'Error al subir archivo');

      this.cloudinaryResult.set({
        secure_url: result.secure_url,
        duration: result.duration ? Math.round(result.duration) : undefined,
        format: mediaType,
      });
      this.testimony.update(t => ({
        ...t,
        url: result.secure_url,
        duration: result.duration ? Math.round(result.duration) : undefined,
        format: mediaType,
      }));
      this.showSuccess('Archivo subido exitosamente');
    } catch (error) {
      console.error('Upload error:', error);
      this.showError('subir archivo', error instanceof Error ? error : new Error('Error desconocido'));
      this.resetMedia();
    } finally {
      this.cargandoTestimonio.set(false);
    }
  }

  // Gestión de ubicación
  onShareLocationChange(): void {
    if (this.shareLocation) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = Number(position.coords.latitude.toFixed(2));
            const lon = Number(position.coords.longitude.toFixed(2));
            this.testimony.update(t => ({ ...t, latitude: lat, longitude: lon }));
            this.showSuccess('Ubicación obtenida');
          },
          (error) => {
            console.error('Geolocation error:', error);
            this.shareLocation = false;
            this.testimony.update(t => ({ ...t, latitude: undefined, longitude: undefined }));
            this.showError('obtener ubicación', new Error(error.message));
          },
          { enableHighAccuracy: false, timeout: 5000 },
        );
      } else {
        this.shareLocation = false;
        this.showError('obtener ubicación', new Error('Geolocalización no soportada'));
      }
    } else {
      this.testimony.update(t => ({ ...t, latitude: undefined, longitude: undefined }));
    }
  }

  // Envío del testimonio
  submitTestimony(form: NgForm): void {
    if (!this.isFileUploaded() || !form.valid) {
      this.showError('enviar testimonio', new Error('Archivo o formulario inválido'));
      return;
    }

    this.submitting.set(true);
    const payload: TestimonyInput = {
      ...this.testimony(),
      eventId: this.testimony().eventId ?? undefined,
      latitude: this.testimony().latitude ?? undefined,
      longitude: this.testimony().longitude ?? undefined,
    };

    this.testimonyService.createTestimony(payload).subscribe({
      next: () => {
        this.showSuccess('Testimonio subido. Esperando aprobación');
        this.resetForm();
        this.router.navigate(['/explore']);
      },
      error: (err) => {
        console.error('Submission error:', err);
        const message = this.getErrorMessage(err);
        this.showError('enviar testimonio', new Error(message));
      },
    }).add(() => this.submitting.set(false));
  }

  // Reset del formulario
  resetForm(): void {
    this.testimony.set({
      title: '',
      description: '',
      content: '',
      selectedTags: [],
      selectedCategories: [],
      eventId: undefined,
      latitude: undefined,
      longitude: undefined,
      url: '',
      duration: undefined,
      format: '',
    });
    this.cloudinaryResult.set(null);
    this.mediaPreview.set(null);
    this.mediaType.set(null);
    this.shareLocation = false;
    this.tagCtrl.setValue('');
    this.eventName.set('Ninguno');
  }

  // Gestión de etiquetas
  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.testimony().selectedTags.includes(value)) {
      this.testimony.update(t => ({ ...t, selectedTags: [...t.selectedTags, value] }));
    }
    event.chipInput?.clear();
    this.tagCtrl.setValue('');
  }

  removeTag(tag: string): void {
    this.testimony.update(t => ({
      ...t,
      selectedTags: t.selectedTags.filter(t => t !== tag),
    }));
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    if (!this.testimony().selectedTags.includes(value)) {
      this.testimony.update(t => ({ ...t, selectedTags: [...t.selectedTags, value] }));
    }
    this.tagCtrl.setValue('');
  }

  // Método para actualizar selectedTags
  updateSelectedTags(newTags: string[]): void {
    this.testimony.update(t => ({ ...t, selectedTags: newTags }));
  }

  // Actualización de nombre del evento
  updateEventName(): void {
    const event = this.events().find(e => e.id === this.testimony().eventId);
    this.eventName.set(event?.name ?? 'Ninguno');
  }

  // Validaciones
  isInfoFormValid(form: NgForm): boolean {
    return form.valid ?? false;
  }

  isMetaFormValid(form: NgForm): boolean {
    return true; // Puedes añadir lógica específica si es necesario
  }

  // Utilidades
  isFileUploaded(): boolean {
    return !!this.cloudinaryResult();
  }

  // Resetea el estado relacionado al archivo multimedia
  private resetMedia(): void {
    this.cloudinaryResult.set(null);
    this.mediaPreview.set(null);
    this.mediaType.set(null);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000, panelClass: ['snackbar-success'], verticalPosition: 'bottom', horizontalPosition: 'center' });
  }

  private showError(action: string, error: Error): void {
    this.snackBar.open(`Error al ${action}: ${error.message}`, 'Reintentar', { duration: 5000, panelClass: ['snackbar-error'], verticalPosition: 'bottom', horizontalPosition: 'center' });
  }

  private getErrorMessage(err: any): string {
    const message = err.message || 'Error desconocido';
    if (message.includes('url')) return 'Error con el archivo multimedia. Reintenta subirlo.';
    if (message.includes('eventId')) return 'Error con el evento seleccionado. Verifica la selección.';
    if (message.includes('Invalid type')) return 'Error en datos numéricos. Déjalos en blanco si no aplican.';
    return message;
  }
}
