import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { DocumentsComponent } from './documents.component';
import { RegisterComponent } from './register.component';
import { authGuard } from '../gurad/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'createuser',
    component: RegisterComponent,
    canActivate: [authGuard],
  },

  {
    path: 'documents',
    component: DocumentsComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
