import { InjectionToken } from '@angular/core';
import {
  DitaTopic,
  DitaTopicModelView,
  DitaTopicVersionViewModel,
  DitatopicVersion,
  DocFamily,
  DocFamilyViewModel,
  Documento,
  LoginRequest,
} from '../Models/models';
import { GenericService } from './generic.service';
import { LoginComponent } from '../app/login.component';

export const DOCUMENTS_SERVICE = new InjectionToken<
  GenericService<Documento, Documento>
>('DOCUMENTS_SERVICE', {
  providedIn: 'root',
  factory: () => new GenericService<Documento, Documento>(),
});
export const FAMILY_SERVICE = new InjectionToken<
  GenericService<DocFamily | DocFamilyViewModel, DocFamily>
>('FAMILY_SERVICE', {
  providedIn: 'root',
  factory: () =>
    new GenericService<DocFamily | DocFamilyViewModel, DocFamily>(),
});
export const DITATOPIC_SERVICE = new InjectionToken<
  GenericService<
    DitaTopic | DitaTopicVersionViewModel | DitaTopicModelView,
    DitaTopic | DitatopicVersion
  >
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

export const ROLE_SERVICE = new InjectionToken<GenericService<any, any>>(
  'ROLE_SERVICE',
  {
    providedIn: 'root',
    factory: () => new GenericService<any, any>(),
  }
);
