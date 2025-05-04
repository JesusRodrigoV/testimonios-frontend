import { Routes } from "@angular/router";
import { authGuard, loginGuard } from "./guards/auth";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./layout/layout.component"),
    children: [
      {
        path: "profile",
        loadComponent: () => import("./pages/profile/profile.component"),
        canActivate: [authGuard],
      },
      {
        path: "dashboard",
        loadComponent: () => import("./pages/dashboard/dashboard.component"),
        canActivate: [authGuard],
      },
      {
        path: "settings",
        loadComponent: () => import("./pages/settings/settings.component"),
        canActivate: [authGuard],
      },
      {
        path: "home",
        loadComponent: () => import("./pages/home/home.component"),
      },
      {
        path: "",
        redirectTo: "/home",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "login",
    loadComponent: () => import("./pages/login/login.component"),
    canActivate: [loginGuard],
  },
  {
    path: "register",
    loadComponent: () => import("./pages/register/register.component"),
    canActivate: [loginGuard],
  },
  {
    path: "forgot-password",
    loadComponent: () =>
      import("./pages/forgot-password/forgot-password.component"),
    canActivate: [loginGuard],
  },
  {
    path: "reset-password",
    loadComponent: () =>
      import("./pages/reset-password/reset-password.component"),
    canActivate: [loginGuard],
  },
  {
    path: "2fa-verify",
    loadComponent: () =>
      import("./pages/two-factor-verify/two-factor-verify.component"),
    canActivate: [authGuard],
  },
  {
    path: "2fa-setup",
    loadComponent: () =>
      import("./pages/two-factor-setup/two-factor-setup.component"),
  },
  {
    path: "explore",
    loadComponent: () =>
      import("./components/testimony-feed/testimony-feed.component"),
  },
  {
    path: "submit-testimony",
    loadComponent: () =>
      import("./components/testimony-upload/testimony-upload.component"),
  },
];
