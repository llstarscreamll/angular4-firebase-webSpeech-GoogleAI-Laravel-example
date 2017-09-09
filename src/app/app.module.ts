import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AngularFireModule,  } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppComponent, SpeechRequestDetailComponent } from './app.component';
import { SpeechService } from './speech.service';
import { AgentService } from './ai.service';
import { SpeechRequestService } from './speechRequest.service';

@NgModule({
  declarations: [
    AppComponent,
    SpeechRequestDetailComponent
  ],
  imports: [
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyDgo2IlUxWgzQwxXgLRymZqSrG1kugieIw',
      authDomain: 'davicompras-dev.firebaseapp.com',
      projectId: 'davicompras-dev',
      databaseURL: 'https://davicompras-dev.firebaseio.com',
      storageBucket: 'davicompras-dev.appspot.com',
      messagingSenderId: '519065851984'
    }),
    BrowserModule,
    HttpModule
  ],
  providers: [SpeechService, AgentService, SpeechRequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
