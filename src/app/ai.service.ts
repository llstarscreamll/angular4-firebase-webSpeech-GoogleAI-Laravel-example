import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AgentService {

  private headers: Headers;
  private clientToken = 'd2ebda2187834d54a6cbb52473d2ea6b';
  private developerToken = '9296e5624e2244cebf07c99e65782086';
  private endPoint = 'https://api.api.ai/v1/query?v=20150910';
  public sessionId: string;

  public constructor(private http: Http) {
    this.headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
    this.headers.set('Authorization', 'Bearer ' + this.developerToken);
    this.setSessionId();
  }

  public restart() {
    this.setSessionId();
  }

  private setSessionId() {
    this.sessionId = this.randomString();
  }

  public ask(query: string): Observable<any> {
    return this.http
      .post(
      this.endPoint,
      {
        'query': query,
        'lang': 'es',
        'sessionId': this.sessionId
      },
      { headers: this.headers }
      ).map((data: Response) => { console.log(data.json()); return data.json(); });
  }

  private randomString(length = 36) {
    return Math
      .round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)))
      .toString(36)
      .slice(1);
  }

}
