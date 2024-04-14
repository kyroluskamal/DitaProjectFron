import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GenericServiceService<T> {
  constructor(private httpClient: HttpClient) {}
  getAllRes = signal<T[]>([]);
  updateRes = signal<T>({} as T);
  deleteRes = signal<T>({} as T);
  postRes = signal<T>({} as T);
  public getAllSubsciption(url: string, headers?: HttpHeaders) {
    this.httpClient
      .get<T[]>(`${url}`, { headers: headers })
      .subscribe((data) => {
        this.getAllRes.set(data);
      });
  }
  public getAllObservable(url: string, headers?: HttpHeaders) {
    return this.httpClient.get<T[]>(`${url}`, { headers: headers });
  }
  public postSubsciption(url: string, body: T, headers?: HttpHeaders) {
    this.httpClient
      .post<T>(`${url}`, body, { headers: headers })
      .subscribe((data) => {
        this.postRes.set(data);
        this.getAllRes.update((d) => [...d, data]);
      });
  }

  public postObservable(url: string, body: T, headers?: HttpHeaders) {
    return this.httpClient.post<T>(`${url}`, body, { headers: headers });
  }

  public putSubsciption(url: string, body: T, headers?: HttpHeaders) {
    this.httpClient
      .put<T>(`${url}`, body, { headers: headers })
      .subscribe((data) => {
        this.updateRes.set(data);
      });
  }

  public putObservable(url: string, body: T, headers?: HttpHeaders) {
    return this.httpClient.put<T>(`${url}`, body, { headers: headers });
  }

  public Delete(url: string, headers?: HttpHeaders) {
    this.httpClient.delete(`${url}`, { headers: headers }).subscribe({
      next: (res) => {
        this.getAllRes.update((d) =>
          d.filter(
            (item) => item['id' as keyof T] !== res['data' as keyof Object]
          )
        );
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }
}
