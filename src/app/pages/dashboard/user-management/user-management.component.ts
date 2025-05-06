import { NgClass, NgOptimizedImage } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { User } from "@app/models/user.model";
import { Subject, takeUntil } from "rxjs";
import { AdminService } from "../services";
import { UserDialogComponent } from "./user-dialog";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-user-management",
  imports: [NgOptimizedImage, NgClass, MatButtonModule],
  templateUrl: "./user-management.component.html",
  styleUrl: "./user-management.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent implements OnInit, OnDestroy {
  users: User[] = [];
  private destroy$ = new Subject<void>();
  isLoading = false;

  private adminService = inject(AdminService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private ref = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadUsers();
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
    this.isLoading = true;
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users.map((u) => ({
          ...u,
          id: u.id_usuario,
        }));
        this.isLoading = false;
        this.ref.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open("Error al cargar usuarios", "Cerrar", {
          duration: 3000,
        });
        this.ref.detectChanges();
      },
    });
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
            this.adminService
              .updateUser(result.id_usuario, result)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: () => {
                  this.loadUsers();
                  this.snackBar.open(
                    "Usuario actualizado con éxito",
                    "Cerrar",
                    { duration: 3000 },
                  );
                },
                error: () => {
                  this.snackBar.open("Error al actualizar usuario", "Cerrar", {
                    duration: 3000,
                  });
                },
              });
          } else {
            this.adminService
              .createUser(result)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: () => {
                  this.loadUsers();
                  this.snackBar.open("Usuario creado con éxito", "Cerrar", {
                    duration: 3000,
                  });
                },
                error: () => {
                  this.snackBar.open("Error al crear usuario", "Cerrar", {
                    duration: 3000,
                  });
                },
              });
          }
        }
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
          error: () => {
            this.snackBar.open("Error al eliminar usuario", "Cerrar", {
              duration: 3000,
            });
            this.isLoading = false;
            this.ref.detectChanges();
          },
        });
    }
  }
}
