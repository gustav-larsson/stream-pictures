import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { PictureListComponent } from './picture-list/picture-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PictureViewerComponent } from './picture-viewer/picture-viewer.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { TwitchLoginSdkModule } from 'twitch-login-sdk';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { SendLinkComponent } from './send-link/send-link.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfiguratorComponent } from './configurator/configurator.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireStorageModule } from '@angular/fire/storage'
import { environment } from 'src/environments/environment';
import { DatabasePictureComponent } from './database-picture/database-picture.component';
import { GuideComponent } from './guide/guide.component';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    PictureListComponent,
    PictureViewerComponent,
    LoginScreenComponent,
    ToolbarComponent,
    HomeScreenComponent,
    SendLinkComponent,
    ConfiguratorComponent,
    DatabasePictureComponent,
    GuideComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    StorageServiceModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    NgxMatColorPickerModule,
    HttpClientModule,
    TwitchLoginSdkModule.forRoot({
      twitchId:  "gfe65599d679im8wfulwz8zq9hyjlm", //<******* YOUR TWITCH_ID 👈
      //redirect: "http://localhost:4200/"
      redirect:  "https://stream-pictures.web.app/" //<***** YOUR CALLBACK REDIRECT 👈
    })
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
