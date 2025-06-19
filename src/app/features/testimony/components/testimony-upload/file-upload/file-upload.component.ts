import {
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
  output,
} from "@angular/core";
import { VideoPlayerComponent } from "@app/features/shared/video-player";

@Component({
  selector: "app-file-upload",
  imports: [VideoPlayerComponent],
  templateUrl: "./file-upload.component.html",
  styleUrl: "./file-upload.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent {
  accept = input<string>("*");
  dragMessage = input<string>("Arrastra y suelta un archivo aquí");
  mediaPreview = input<string | null>(null);
  mediaType = input<"Video" | "Audio" | null>(null);

  fileSelected = output<File | null>();

  selectedFileName: string | null = null;
  isDragging = false;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.selectedFileName = file ? file.name : null;
    this.fileSelected.emit(file);
    input.value = "";
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0] || null;
    if (file && this.isValidFile(file)) {
      this.selectedFileName = file.name;
      this.fileSelected.emit(file);
    }
  }

  clearFile(event: Event): void {
    event.stopPropagation();
    this.selectedFileName = null;
    this.fileSelected.emit(null);
  }

  onContainerClick(event: MouseEvent): void {
    if (!this.selectedFileName && !this.isClickOnClearButton(event)) {
      const fileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;
      fileInput.click();
    }
  }

  onFooterClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.selectedFileName && this.isClickOnClearButton(event)) {
      this.clearFile(event);
    } else if (!this.selectedFileName) {
      const fileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;
      fileInput.click();
    }
  }

  private isClickOnClearButton(event: MouseEvent): boolean {
    const clearSvg = (event.target as HTMLElement).closest(
      'svg[xmlns="http://www.w3.org/2000/svg"]'
    );
    return (
      !!clearSvg &&
      clearSvg.querySelector('path[stroke="var(--error-color)"]') !== null
    );
  }

  private isValidFile(file: File): boolean {
    const acceptedTypes = this.accept()
      .split(",")
      .map((type) => type.trim());
    return (
      acceptedTypes.includes("*") ||
      acceptedTypes.some((type) => file.type.includes(type.replace(".", "")))
    );
  }
}
