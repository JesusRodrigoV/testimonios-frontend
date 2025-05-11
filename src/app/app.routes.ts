import { Routes } from "@angular/router";
import { authGuard, loginGuard } from "./guards/auth";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./pages/layout/layout.component"),
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
        path: "explore",
        loadComponent: () =>
          import("./features/testimony/components/testimony-feed/testimony-feed.component"),
      },
      {
        path: "submit-testimony",
        loadComponent: () =>
          import("./features/testimony/components/testimony-upload/testimony-upload.component"),
        canActivate: [authGuard],
      },
      {
        path: "maps",
        loadComponent: () => import("./pages/maps/maps.component"),
      },
      {
        path: 'collections',
        loadComponent: () => import("./features/collections/components/collection-list/collection-list.component")
      },
      {
        path: 'collections/:id',
        loadComponent: () => import("./features/collections/components/collection-detail/collection-detail.component")
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
    loadComponent: () => import("./features/auth/components/login/login.component"),
    canActivate: [loginGuard],
  },
  {
    path: "register",
    loadComponent: () => import("./features/auth/components/register/register.component"),
    canActivate: [loginGuard],
  },
  {
    path: "forgot-password",
    loadComponent: () =>
      import("./features/auth/components/forgot-password/forgot-password.component"),
    canActivate: [loginGuard],
  },
  {
    path: "reset-password",
    loadComponent: () =>
      import("./features/auth/components/reset-password/reset-password.component"),
    canActivate: [loginGuard],
  },
  {
    path: "2fa-verify",
    loadComponent: () =>
      import("./features/auth/components/two-factor-verify/two-factor-verify.component"),
    canActivate: [authGuard],
  },
  {
    path: "2fa-setup",
    loadComponent: () =>
      import("./features/auth/components/two-factor-setup/two-factor-setup.component"),
  },

];
