import { Component, OnInit } from '@angular/core';
import { IntermediateService } from 'src/app/intermediate.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  file: any;
  errorMsg: any;
  errors: any[] = [];
  isUploaded: boolean;
  success: number;
  isUploading: boolean;
  displayedColumns: string[] = ['S.no.', 'Row Index', 'Errors'];
  constructor(private intermediate: IntermediateService) { }

  openInput() {
    this.file = null;
    document.getElementById('input-button').click();
  }

  fileChange(file) {
    this.file = file[0];
  }

  upload() {
    const formData = new FormData();
    formData.append('applications', this.file);
    this.isUploading = true;
    this.intermediate.uploadFile(formData).subscribe((data: any) => {
      this.isUploading = false;
      if (!data.status) {
        if (data.code === -2) {
          this.errorMsg = 'Please insert a File';
        } else if (data.code === -1) {
          this.errorMsg = 'An error occurred while uploading the file, Please try after some time';
        } else if (data.code === -3) {
          this.errorMsg = 'Please provide all the required fields mentioned above';
        } else if (data.code === -4) {
          this.errorMsg = 'Error occureed while while validating the data';
        } else if (data.code === -5) {
          this.errorMsg = 'Error occureed while saving the data';
        }
      } else {
        this.isUploaded = true;
        this.errors = data.stats;
        this.success = this.errors.filter(ob => ob.errors.length === 0).length;
      }
    });
  }

  uploadAgain() {
    this.errors = [];
    this.isUploaded = false;
    this.errorMsg = null;
    this.file = null;
  }

  ngOnInit() {
    this.isUploaded = false;
    this.isUploading = false;
    this.success = 0;
  }

}
