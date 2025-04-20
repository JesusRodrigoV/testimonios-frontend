import { Routes } from "@angular/router";
import { authGuard, loginGuard } from "./guards/auth";

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () => import("./pages/login/login.component"),
    canActivate: [loginGuard],
  },
  {
    path: "2fa-verify",
    loadComponent: () =>
      import("./pages/two-factor-verify/two-factor-verify.component"),
    canActivate: [authGuard],
  },
  {
    path: "profile",
    loadComponent: () => import("./pages/profile/profile.component"),
    canActivate: [authGuard],
  },
  {
    path: "home",
    loadComponent: () => import("./pages/home/home.component"),
    canActivate: [authGuard],
  },
  {
    path: "settings",
    loadComponent: () => import("./pages/settings/settings.component"),
    canActivate: [authGuard],
  },
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full",
  },
];
