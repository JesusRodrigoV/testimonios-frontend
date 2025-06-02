import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { NgClass, NgIf, NgOptimizedImage } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { AuthStore } from "@app/auth.store";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { UserService } from "./services/user.service";
import { User } from "@app/features/auth/models/user.model";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-profile",
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
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfileComponent {
  private authStore = inject(AuthStore);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  user = this.authStore.user;
  profileForm: FormGroup;
  isLoading = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  imagePreview = signal<string | null>(null);
  selectedFile: File | null = null;

  constructor() {
    this.profileForm = this.fb.group({
      nombre: [
        { value: this.user()?.nombre || '', disabled: true },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      biografia: [{ value: this.user()?.biografia || '', disabled: true }],
    });
  }

  getRoleName(roleId: number | undefined): string {
    switch (roleId) {
      case 1: return 'Administrador';
      case 2: return 'Curador';
      case 3: return 'Investigador';
      case 4: return 'Visitante';
      default: return 'Desconocido';
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

  async onLogout() {
    this.isLoading.set(true);
    try {
      await this.authStore.logout();
      this.openSnackBar('Sesión cerrada exitosamente', 'success');
    } catch (error) {
      this.openSnackBar('Error al cerrar sesión', 'error');
    } finally {
      this.isLoading.set(false);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      this.openSnackBar('Solo se permiten imágenes JPEG o PNG', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.openSnackBar('La imagen no debe exceder 5MB', 'error');
      return;
    }

    this.selectedFile = file;
    this.imagePreview.set(URL.createObjectURL(file));
  }

  async onSubmit() {
    if (!this.profileForm.valid) return;

    this.isLoading.set(true);
    try {
      const userId = this.user()?.id_usuario;
      if (!userId) throw new Error('Usuario no autenticado');

      let profileImageUrl: string | undefined;
      if (this.selectedFile) {
        const uploadResult = await firstValueFrom(this.userService.uploadProfileImage(this.selectedFile));
        profileImageUrl = uploadResult.secure_url;
      }

      const updateData: Partial<User> = {
        nombre: this.profileForm.get('nombre')?.value,
        biografia: this.profileForm.get('biografia')?.value || '',
        ...(profileImageUrl && { profile_image: profileImageUrl }),
      };

      const updatedUser = await firstValueFrom(this.userService.updateUser(userId, updateData));
      if (updatedUser) {
        this.authStore.loadUserProfile();
        this.isEditing.set(false);
        this.profileForm.disable();
        this.imagePreview.set(null);
        this.selectedFile = null;
        this.openSnackBar('Perfil actualizado exitosamente', 'success');
      } else {
        throw new Error('No se recibió respuesta del servidor');
      }
    } catch (error: any) {
      this.openSnackBar(error.message || 'Error al actualizar el perfil', 'error');
    } finally {
      this.isLoading.set(false);
    }
  }

  resetForm() {
    this.profileForm.reset({
      nombre: this.user()?.nombre || '',
      biografia: this.user()?.biografia || '',
    });
    this.imagePreview.set(null);
    this.selectedFile = null;
  }

  openSnackBar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Cerrar', {
      duration: type === 'success' ? 3000 : 5000,
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error'],
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }
}
