import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class IntermediateService {

  loadingAnimation: boolean;

  constructor(private web: WebRequestService) {
    this.loadingAnimation = false;
  }

  getApplications(pagenum) {
    return this.web.get(`applications/${pagenum}`);
  }

  uploadFile(data) {
    return this.web.post('uploadSheet', data);
  }
}
