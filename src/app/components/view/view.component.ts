import { Component, OnInit } from '@angular/core';
import { IntermediateService } from 'src/app/intermediate.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  applications = [];
  currentPage: number;
  totalAplications: number;
  erroMsg: string;
  displayedColumns: string[] = ['username', 'email', 'address', 'city', 'state', 'country', 'experience', 'salary'];

  constructor(public intermediate: IntermediateService) { }

  getApplications(page) {
    this.intermediate.loadingAnimation = true;
    this.intermediate.getApplications(page + 1).subscribe((data: any) => {
      if (!data.status) {
        this.erroMsg = 'Something went wrong, Please try again after some time';
      } else {
        if (data.applications.length > 0) {
          this.applications = data.applications;
        } else {
          this.applications = [];
          this.erroMsg = 'No aplications Found';
        }
        if (data.total.length > 0) {
          this.totalAplications = data.total[0].count;
        } else {
          this.totalAplications = 0;
          this.erroMsg = 'No aplications Found';
        }
      }
      this.intermediate.loadingAnimation = false;
    });
  }

  pageChanged(event) {
    if ((event.pageIndex) * 10 > this.totalAplications) {
      return;
    } else {
      this.currentPage = event.pageIndex;
      this.getApplications(event.pageIndex);
    }
  }

  ngOnInit() {
    this.currentPage = 0;
    this.totalAplications = 0;
    this.intermediate.loadingAnimation = false;
    this.getApplications(this.currentPage);
  }

}
