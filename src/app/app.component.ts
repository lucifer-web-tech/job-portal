import { Component } from '@angular/core';
import { IntermediateService } from './intermediate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public intermediate: IntermediateService) {}
  title = 'jobs';
}
