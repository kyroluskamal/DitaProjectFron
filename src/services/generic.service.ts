import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, forkJoin, tap } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { SuccessResponse } from '../Models/models';

@Injectable({
  providedIn: 'root',
})
export class GenericService<BodyType, ResponseType> {
  private httpClient = inject(HttpClient);
  constructor() {}
  getAllRes = signal<ResponseType[]>([]);
  updateRes = signal<ResponseType>({} as ResponseType);
  deleteRes = signal<ResponseType>({} as ResponseType);
  postRes = signal<ResponseType>({} as ResponseType);
  getBy = signal<ResponseType>({} as ResponseType);
  private notifications = inject(NotificationsService);

  public getAllSubsciption(url: string, headers?: HttpHeaders) {
    this.httpClient
      .get<ResponseType[]>(`${url}`, { headers: headers })
      .subscribe((data) => {
        this.getAllRes.set(data);
      });
  }
  public getAllObservable(url: string, headers?: HttpHeaders) {
    return this.httpClient.get<ResponseType[]>(`${url}`, { headers: headers });
  }
  //getBy
  public getBySubsciption(url: string, headers?: HttpHeaders) {
    this.httpClient
      .get<ResponseType>(`${url}`, { headers: headers })
      .subscribe((data) => {
        this.getBy.set(data);
      });
  }

  public getByObservable(url: string, headers?: HttpHeaders): Observable<any> {
    return this.httpClient.get<ResponseType>(`${url}`, { headers: headers });
  }

  public postSubsciption(url: string, body: BodyType, headers?: HttpHeaders) {
    this.httpClient
      .post<SuccessResponse>(`${url}`, body, { headers: headers })
      .subscribe((res) => {
        this.notifications.sucess(res.message, 'Close');
        console.log(res.data);
        this.postRes.set(res.data as ResponseType);
        this.getAllRes.update((d) => [...d, res.data as ResponseType]);
      });
  }

  public postObservable(url: string, body: BodyType, headers?: HttpHeaders) {
    return this.httpClient
      .post<SuccessResponse>(`${url}`, body, {
        headers: headers,
      })
      .pipe(
        tap((res) => {
          this.notifications.sucess(res.message, 'Close');
          this.postRes.set(res.data as ResponseType);
          this.getAllRes.update((d) => [...d, res.data as ResponseType]);
        })
      );
  }

  public putSubsciption(url: string, body: BodyType, headers?: HttpHeaders) {
    this.httpClient
      .put<SuccessResponse>(`${url}`, body, { headers: headers })
      .subscribe((res) => {
        this.notifications.sucess(res.message, 'Close');
        this.updateRes.set(res.data as ResponseType);
      });
  }

  public putObservable(url: string, body: BodyType, headers?: HttpHeaders) {
    return this.httpClient.put<ResponseType>(`${url}`, body, {
      headers: headers,
    });
  }

  public Delete(url: string, headers?: HttpHeaders) {
    this.httpClient
      .delete<SuccessResponse>(`${url}`, { headers: headers })
      .subscribe({
        next: (res) => {
          this.getAllRes.update((d) =>
            d.filter(
              (item) =>
                item['id' as keyof ResponseType] !== res['data' as keyof Object]
            )
          );
          this.notifications.sucess(res.message, 'Close');
          this.deleteRes.set(res as ResponseType);
        },
        error: (error) => {
          console.error('There was an error!', error);
        },
      });
  }

  public DeleteObservable(url: string, headers?: HttpHeaders) {
    return this.httpClient
      .delete<SuccessResponse>(`${url}`, { headers: headers })
      .pipe(
        tap((res) => {
          this.getAllRes.update((d) =>
            d.filter(
              (item) =>
                item['id' as keyof ResponseType] !== res['data' as keyof Object]
            )
          );
          this.notifications.sucess(res.message, 'Close');
          this.deleteRes.set(res as ResponseType);
        })
      );
  }

  public multiRequest(
    urls: {
      url: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      body?: any;
    }[],
    headers?: HttpHeaders
  ) {
    const requests = urls.map((url) => {
      switch (url.method) {
        case 'GET':
          return this.httpClient.get(url.url, { headers: headers });
        case 'POST':
          return this.httpClient.post(url.url, url.body, { headers: headers });
        case 'PUT':
          return this.httpClient.put(url.url, url.body, { headers: headers });
        case 'DELETE':
          return this.httpClient.delete(url.url, { headers: headers });
      }
    });
    return forkJoin(requests);
  }
}
