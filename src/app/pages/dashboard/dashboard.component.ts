import { CommonModule, NgOptimizedImage } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { User } from "@app/models/user.model";
import { AdminService } from "./services";
import { UserDialogComponent } from "./user-dialog";
import { Subject, takeUntil } from "rxjs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "app-dashboard",
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    NgOptimizedImage,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent implements OnInit, OnDestroy {
  users: User[] = [];
  displayedColumns = ["profile_image", "nombre", "email", "id_rol", "actions"];
  private destroy$ = new Subject<void>();
  isLoading = false;

  private adminService = inject(AdminService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private ref = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadUsers();
    this.ref.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getRoleName(roleId: number): string {
    const roles = {
      1: "Administrador",
      2: "Curador",
      3: "Investigador",
      4: "Visitante",
    };
    return roles[roleId as keyof typeof roles] || "Desconocido";
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users.map((u) => ({
          ...u,
          id: u.id_usuario,
        }));
        this.ref.detectChanges();
      },
    });
    this.ref.detectChanges();
  }

  openUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: "400px",
      data: user || {},
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          if (result.id_usuario) {
            // Actualizar usuario existente
            this.adminService
              .updateUser(result.id_usuario, result)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: () => {
                  this.loadUsers(); // Recargar usuarios
                  this.snackBar.open(
                    "Usuario actualizado con éxito",
                    "Cerrar",
                    { duration: 3000 },
                  );
                  this.ref.detectChanges();
                },
                error: (error) => {
                  console.error("Error updating user:", error);
                  this.snackBar.open("Error al actualizar usuario", "Cerrar", {
                    duration: 3000,
                  });
                },
              });
          } else {
            // Crear nuevo usuario
            this.adminService
              .createUser(result)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: () => {
                  this.loadUsers(); // Recargar usuarios
                  this.snackBar.open("Usuario creado con éxito", "Cerrar", {
                    duration: 3000,
                  });
                  this.ref.detectChanges();
                },
                error: (error) => {
                  console.error("Error creating user:", error);
                  this.snackBar.open("Error al crear usuario", "Cerrar", {
                    duration: 3000,
                  });
                  this.ref.detectChanges();
                },
              });
          }
        }
      });
  }

  createUser(userData: Partial<User>) {
    this.adminService.createUser(userData).subscribe({
      next: () => {
        this.loadUsers();
        this.showSuccess("Usuario creado exitosamente");
      },
      error: () => {
        this.showError("Error al crear usuario");
      },
    });
  }

  updateUser(id: number, userData: Partial<User>) {
    this.adminService.updateUser(id, userData).subscribe({
      next: () => {
        this.loadUsers();
        this.showSuccess("Usuario actualizado exitosamente");
      },
      error: () => {
        this.showError("Error al actualizar usuario");
      },
    });
  }

  deleteUser(id: number): void {
    if (!id) {
      this.snackBar.open("Error: ID de usuario inválido", "Cerrar", {
        duration: 3000,
      });
      return;
    }

    if (confirm("¿Estás seguro de que querés eliminar este usuario?")) {
      this.isLoading = true;
      this.ref.detectChanges();

      this.adminService
        .deleteUser(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadUsers();
            this.snackBar.open("Usuario eliminado con éxito", "Cerrar", {
              duration: 3000,
            });
            this.isLoading = false;
            this.ref.detectChanges();
          },
          error: (error) => {
            console.error("Error deleting user:", error);
            this.snackBar.open(
              "Error al eliminar usuario: " +
                (error.error?.message || "Error desconocido"),
              "Cerrar",
              { duration: 3000 },
            );
            this.isLoading = false;
            this.ref.detectChanges();
          },
        });
    }
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, "Cerrar", { duration: 3000 });
  }

  private showError(message: string) {
    this.snackBar.open(message, "Cerrar", {
      duration: 3000,
      panelClass: ["error-snackbar"],
    });
  }
}
