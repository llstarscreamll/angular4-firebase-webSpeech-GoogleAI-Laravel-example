import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SpeechRequestService {

  private node = 'speech_requests';

  public constructor(
    protected fb: AngularFireDatabase,
  ) { }

  public getById(id: string): Observable<any> {
    return this.fb.object(this.node + '/' + id);
  }

  public getLatestSpeechRequest(userId = 'a1b2'): Observable<any> {
    return this.fb.list(this.node + '/' + userId, {
      query: {
        limitToLast: 1,
        orderByKey: true
      }
    });
  }

}
