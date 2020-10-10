import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ViewComponent } from './components/view/view.component';
import { UploadComponent } from './components/upload/upload.component';

const routes: Routes = [
  {path: 'view', component: ViewComponent},
  {path: 'upload', component: UploadComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'view'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy }]
})
export class AppRoutingModule { }
