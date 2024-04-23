import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { authGuard } from '../gurad/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'createuser',
    loadComponent() {
      return import('./register.component').then((m) => m.RegisterComponent);
    },
    canActivate: [authGuard],
  },

  {
    path: 'documents',
    loadComponent() {
      return import('./documents.component').then((m) => m.DocumentsComponent);
    },
  },
  {
    path: 'documents/:docId',
    loadComponent() {
      return import('./document-edit.component').then(
        (m) => m.DocumentEditComponent
      );
    },
  },
  {
    path: 'documents/:docId/versions/:versionId',
    loadComponent() {
      return import('./document-edit.component').then(
        (m) => m.DocumentEditComponent
      );
    },
  },
  { path: '', redirectTo: 'documents', pathMatch: 'full' },
];
