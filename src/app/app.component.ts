import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { SpeechService } from './speech.service';
import { AgentService } from './ai.service';
import { SpeechRequestService } from './speechRequest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  currentRequestId: any;

  public serviceSubscription$: Subscription;
  public conversation: { sender: string, text: string | any }[] = [];
  public speechRequest$: Observable<any>;
  public status = 'idle';
  private speechRequest: any;

  public constructor(
    private speechService: SpeechService,
    private agentService: AgentService,
    private speechRequestService: SpeechRequestService,
  ) { }

  public ngOnInit() {
    this.speechRequest$ = this.speechRequestService.getLatestSpeechRequest();
  }

  public start() {
    this.serviceSubscription$ = this.speechService
      .init()
      .subscribe(msg => {
        this.conversation.push({ sender: 'user', text: msg });
        this.sendToAgent(msg);
      },
      error => console.error('algo salió mal escuchando al usuario - ', error),
      () => console.warn('escucha completada'),
    );
  }

  public sendToAgent(query: string) {
    query = this.interceptUserResponse(query);

    this.agentService
      .ask(query)
      .subscribe(data => {
        const msg = this.interceptAiResponse(data);
        // add agent msg to conversation array
        this.conversation
          .push({
            sender: 'agent',
            text: msg // intercept agents response and get clean msg text
          });

        this.speechService.synthVoice(msg);
      });
  }

  private interceptUserResponse(query): string {
    switch (this.status) {

      // when current state (intent) is nombre-solicitud, that means
      // that next step is add items to current speech request, so
      // to be able to show items sugestions and added items, the
      // API needs to know the speech request id ($key on firebase),
      // so we will add the key to the user input
      case 'nombre-solicitud': {
        query = query + ':' + this.speechRequest.$key;
        console.log('append speech request id to query: ', query);
        return query;
      }

      default: {
        return query;
      }
    }
  }

  private interceptAiResponse(response: any): string {
    this.status = response.result.metadata.intentName;
    const incomplete: boolean = response.result.actionIncomplete;

    switch (response.result.action) {
      case 'action.create-request': {
        const responseSpeech = response.result.fulfillment.speech;

        if (incomplete !== true) {
          const speechRequestId = response.result.fulfillment.data.request_id;
          this.currentRequestId = speechRequestId;
          this.speechRequest$ = this.speechRequestService.getById(this.currentRequestId);
          this.speechRequest$.subscribe(speechReq => this.speechRequest = speechReq);
        }

        console.log(responseSpeech);
        console.log('create request id = ', this.currentRequestId);

        return responseSpeech;
      }

      default: {
        return response.result.fulfillment.speech;
      }
    }
  }

  public get speechEnabled(): boolean {
    return !('webkitSpeechRecognition' in window) ? false : true;
  }

  public ngOnDestroy() {
    this.serviceSubscription$.unsubscribe();
  }

}

const foo = {
  'items': {
    '-KtbeEFY8f5Jc9rALrvX': {
      'item': {
        '1345': {
          'name': 'manzana'
        }
      },
      'quantity': 4
    }
  },
  'name': 'de ejemplo',
  'suggestions': {
    '12312': {
      'name': 'computador'
    },
    '23sdf': {
      'name': 'computador toshiba'
    }
  }
};

@Component({
  selector: 'app-speech-request-detail',
  template: `
  <div *ngIf="speechRequest" class="text-left">
    <h3 *ngIf="speechRequest.name" class="text-center">{{ speechRequest.name }}</h3>

    <div *ngIf="speechRequest.items">
      <ul class="list-group">
        <li class="list-group-item"><strong>Artículos</strong></li>
        <li class="list-group-item" *ngFor="let item of getItemsArray(speechRequest.items)">
          <span class="badge">{{ item.quantity }}</span> {{ getItemName(item.item) }}
        </li>
      </ul>
    </div>

    <div *ngIf="speechRequest.suggestions">
      <ul class="list-group">
        <li class="list-group-item"><strong>Segerencias</strong></li>
        <li class="list-group-item" *ngFor="let suggestion of getSuggestionsArray(speechRequest.suggestions); let i = index">
          <strong>{{ i + 1 }}</strong> {{ suggestion.name }}
        </li>
      </ul>
    </div>
<!--
<strong>Object</strong>
<pre>{{ speechRequest | json }}</pre>
</div>
-->
  `
})
export class SpeechRequestDetailComponent {

  @Input()
  public speechRequest: any;

  public getItemsArray(itemsObj: Object): any[] {
    const items = [];

    Object.keys(itemsObj).forEach(key => {
      items.push(itemsObj[key]);
    });

    return items;
  }

  public getItemName(item) {
    let name = '';

    Object.keys(item).forEach(key => {
      name = item[key]['name'];
    });

    return name;
  }

  public getSuggestionsArray(suggestionsObj: Object): any[] {
    const suggestions = [];

    Object.keys(suggestionsObj).forEach(key => {
      suggestions.push(suggestionsObj[key]);
    });

    return suggestions;
  }

}
