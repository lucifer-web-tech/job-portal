import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly root;
  constructor(private http: HttpClient) {
    this.root = 'http://localhost:5000';
  }

  // root = ${this.root}
  get(uri: string) {
    return this.http.get(`/${uri}`);
  }

  post(uri: string, data: object) {
    return this.http.post(`/${uri}`, data);
  }
}
