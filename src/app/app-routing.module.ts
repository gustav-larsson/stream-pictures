import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatabasePictureComponent } from './database-picture/database-picture.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { PictureListComponent } from './picture-list/picture-list.component';
import { PricingComponent } from './pricing/pricing.component';
import { SendLinkComponent } from './send-link/send-link.component';

const routes: Routes = [
  { path: '', component: LoginScreenComponent },
  { path: 'picture-list', component: PictureListComponent },
  { path: 'picture-viewer', component: DatabasePictureComponent },
  { path: 'send-link', component: SendLinkComponent },
  { path: 'pricing', component: PricingComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
