import { Injectable, signal } from '@angular/core';
import { ApplicationUser } from '../Models/models';

@Injectable({
  providedIn: 'root',
})
export class CommonSignalsService {
  user = signal<ApplicationUser>({} as ApplicationUser);
  token = signal<string>('');
  isloggedIn = signal(false);
  selectedRows = signal<any[]>([]);
  loaderLoading = signal(false);
}
