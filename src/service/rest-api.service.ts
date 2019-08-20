import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(private http: HttpClient) { }

  request(method: string, url: string, options: any): Promise<any> {
    if (options) {
      if (!options.observe) {
        options.observe = 'response';
      }
      if (!options.responseType) {
        options.responseType = 'json';
      }
    }
    const request = this.http.request(method, url, options) as Observable<any>;
    if (options && options.observe === 'response') {
      return request.pipe(
        map(({ body }) => body)
      ).toPromise();
    } else {
      return request.toPromise();
    }
  }
}
