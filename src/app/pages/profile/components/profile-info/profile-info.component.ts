import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { User } from "@app/features/auth/models/user.model";
import { UserService } from "../../services/user.service";
import { NgClass, NgOptimizedImage } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AuthStore } from "@app/auth.store";

@Component({
  selector: "app-profile-info",
  imports: [
    NgClass,
    NgOptimizedImage,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./profile-info.component.html",
  styleUrl: "./profile-info.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileInfoComponent {
  private authStore = inject(AuthStore);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isLoading = input<boolean>();
  user = signal<User | null>(this.authStore.user());
  localIsLoading = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  imagePreview = signal<string | null>(null);
  selectedFile: File | null = null;
  profileForm = this.fb.group({
    nombre: [
      { value: this.user()?.nombre || "", disabled: true },
      [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
    ],
    biografia: [{ value: this.user()?.biografia || "", disabled: true }],
  });

  constructor() {
    this.loadUserData();
  }

  loadUserData() {
    // Simulamos que el usuario ya está cargado en authStore, pero puedes añadir una llamada al servicio si es necesario
    this.user.set(this.authStore.user());
    if (!this.user()) {
      console.warn("Usuario no autenticado o datos no disponibles.");
    }
  }

  getRoleName(roleId: number | undefined): string {
    switch (roleId) {
      case 1: return "Administrador";
      case 2: return "Curador";
      case 3: return "Investigador";
      case 4: return "Visitante";
      default: return "Desconocido";
    }
  }

  startEdit() {
    this.isEditing.set(true);
    this.profileForm.enable();
    this.imagePreview.set(null);
    this.selectedFile = null;
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.profileForm.disable();
    this.resetForm();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      this.openSnackBar("Solo se permiten imágenes JPEG o PNG", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.openSnackBar("La imagen no debe exceder 5MB", "error");
      return;
    }

    this.selectedFile = file;
    this.imagePreview.set(URL.createObjectURL(file));
  }

  async onSubmit() {
    if (!this.profileForm.valid || !this.user()?.id_usuario) return;

    this.localIsLoading.set(true);
    try {
      let profileImageUrl: string | undefined;
      if (this.selectedFile) {
        const uploadResult = await this.userService.uploadProfileImage(this.selectedFile).toPromise();
        if (uploadResult) {
          profileImageUrl = uploadResult.secure_url;
        }
      }

      const updateData = {
        nombre: this.profileForm.get("nombre")?.value || "",
        biografia: this.profileForm.get("biografia")?.value || "",
        ...(profileImageUrl && { profile_image: profileImageUrl }),
      } as Partial<User>;

      const updatedUser = await this.userService.updateUser(this.user()!.id_usuario, updateData).toPromise();
      if (updatedUser) {
        this.user.set({ ...this.user(), ...updatedUser }); // Actualiza el usuario localmente
        this.authStore.loadUserProfile(); // Sincroniza con el store
        this.isEditing.set(false);
        this.profileForm.disable();
        this.imagePreview.set(null);
        this.selectedFile = null;
        this.openSnackBar("Perfil actualizado exitosamente", "success");
      }
    } catch (error: any) {
      this.openSnackBar(error.message || "Error al actualizar el perfil", "error");
    } finally {
      this.localIsLoading.set(false);
    }
  }

  resetForm() {
    this.profileForm.reset({
      nombre: this.user()?.nombre || "",
      biografia: this.user()?.biografia || "",
    });
    this.imagePreview.set(null);
    this.selectedFile = null;
  }

  async setup2FA() {
    this.localIsLoading.set(true);
    try {
      await this.userService.setup2FA().toPromise();
      this.openSnackBar("Iniciando configuración de 2FA", "success");
    } catch (error: any) {
      this.openSnackBar(error.message || "Error al iniciar configuración de 2FA", "error");
    } finally {
      this.localIsLoading.set(false);
    }
  }

  openSnackBar(message: string, type: "success" | "error") {
    this.snackBar.open(message, "Cerrar", {
      duration: type === "success" ? 3000 : 5000,
      panelClass: type === "success" ? ["snackbar-success"] : ["snackbar-error"],
      verticalPosition: "bottom",
      horizontalPosition: "center",
    });
  }
}