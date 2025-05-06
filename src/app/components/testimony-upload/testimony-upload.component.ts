import { NgIf } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { TestimonyInput } from "@app/models/testimonio.model";
import { TestimonioService } from "@app/services/testimonio/testimonio.service";
import { environment } from "src/environment/environment";

@Component({
  selector: "app-testimony-upload",
  imports: [FormsModule, NgIf],
  templateUrl: "./testimony-upload.component.html",
  styleUrl: "./testimony-upload.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TestimonyUploadComponent {
  testimony: TestimonyInput & { tagsInput?: string; categoriesInput?: string } =
    {
      title: "",
      description: "",
      content: "",
      tagsInput: "",
      categoriesInput: "",
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

  private http = inject(HttpClient);
  private testimonyService = inject(TestimonioService);

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
      tags: this.testimony.tagsInput
        ? this.testimony.tagsInput
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : [],
      categories: this.testimony.categoriesInput
        ? this.testimony.categoriesInput
            .split(",")
            .map((cat) => cat.trim())
            .filter((cat) => cat)
        : [],
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
            "Error con el ID del evento. Déjalo en blanco si no aplica.";
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
      tagsInput: "",
      categoriesInput: "",
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
  }

  clearError(): void {
    this.error = null;
  }
}
