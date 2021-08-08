import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatabasePictureComponent } from './database-picture/database-picture.component';
import { GuideComponent } from './guide/guide.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { PictureListComponent } from './picture-list/picture-list.component';
import { ConfiguratorComponent } from './configurator/configurator.component';
import { SendLinkComponent } from './send-link/send-link.component';

const routes: Routes = [
  { path: '', component: LoginScreenComponent },
  { path: 'picture-list', component: PictureListComponent },
  { path: 'picture-viewer', component: DatabasePictureComponent },
  { path: 'send-link', component: SendLinkComponent },
  { path: 'configurator', component: ConfiguratorComponent},
  { path: 'guide', component: GuideComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
