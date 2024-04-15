import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private localStorage = isPlatformBrowser(inject(PLATFORM_ID))
    ? localStorage
    : null;
  public getItem(key: string) {
    return this.localStorage?.getItem(key) as any;
  }

  public setItem(key: string, value: string) {
    this.localStorage?.setItem(key, value);
  }

  public removeItem(key: string) {
    this.localStorage?.removeItem(key);
  }

  public clear() {
    this.localStorage?.clear();
  }

  public key(index: number) {
    this.localStorage?.key(index);
  }
}
