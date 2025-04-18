import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./features/auth/login/login.component").then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./features/admin/admin.routes").then((m) => m.adminRoutes),
    canActivate: [authGuard],
    data: { requiredRole: Rol.ADMIN },
  },
  {
    path: "curator",
    loadChildren: () =>
      import("./features/curator/curator.routes").then((m) => m.curatorRoutes),
    canActivate: [authGuard],
    data: { requiredRole: Rol.CURATOR },
  },
];
