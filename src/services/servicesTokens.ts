import { InjectionToken } from '@angular/core';
import { DitaTopic, Documento, LoginRequest } from '../Models/models';
import { GenericService } from './generic.service';
import { LoginComponent } from '../app/login.component';

export const DOCUMENTS_SERVICE = new InjectionToken<
  GenericService<Documento, Documento>
>('DOCUMENTS_SERVICE', {
  providedIn: 'root',
  factory: () => new GenericService<Documento, Documento>(),
});
export const DITATOPIC_SERVICE = new InjectionToken<
  GenericService<DitaTopic, DitaTopic>
>('DOCUMENTS_SERVICE', {
  providedIn: 'root',
  factory: () => new GenericService<DitaTopic, DitaTopic>(),
});

export const LOGIN_SERVICE = new InjectionToken<
  GenericService<LoginRequest, any>
>('LOGIN_SERVICE', {
  providedIn: LoginComponent,
  factory: () => new GenericService<LoginRequest, any>(),
});
