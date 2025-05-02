import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MediaService } from "@app/services/media";

@Component({
  selector: "app-testimonio-form",
  imports: [],
  templateUrl: "./testimonio-form.component.html",
  styleUrl: "./testimonio-form.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonioFormComponent {
  testimonioForm: FormGroup;
  mediaTypes = ["texto", "audio", "video", "imagen"];
  selectedFile?: File;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private testimonioService: TestimonioService,
    private mediaService: MediaService,
    public dialogRef: MatDialogRef<TestimonioFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.testimonioForm = this.fb.group({
      titulo: ["", [Validators.required, Validators.maxLength(255)]],
      descripcion: ["", Validators.required],
      tipoContenido: ["texto", Validators.required],
      archivo: [null],
      contenidoTexto: [""],
      latitud: [""],
      longitud: [""],
      categorias: [[]],
      etiquetas: [[]],
      eventos: [[]],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.previewFile(this.selectedFile);
    }
  }

  previewFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result);
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.testimonioForm.invalid) return;

    const formData = new FormData();
    Object.keys(this.testimonioForm.value).forEach((key) => {
      formData.append(key, this.testimonioForm.get(key)?.value);
    });

    if (this.selectedFile) {
      formData.append("media", this.selectedFile);
    }

    this.mediaService
      .uploadMedia(formData)
      .pipe(
        switchMap((mediaResult: any) =>
          this.testimonioService.createTestimonio({
            ...this.testimonioForm.value,
            url_medio: mediaResult.url,
            duracion: mediaResult.duration,
          }),
        ),
      )
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error("Error:", err),
      });
  }
}
