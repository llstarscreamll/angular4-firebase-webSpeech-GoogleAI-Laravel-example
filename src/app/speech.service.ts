import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Injectable()
export class SpeechService {

  speechRecognition: any;

  public constructor(private zone: NgZone) { }

  public init(): Observable<string> {
    return Observable.create(
      observer => {
        const { webkitSpeechRecognition }: IWindow = <IWindow>window;
        this.speechRecognition = new webkitSpeechRecognition();
        this.speechRecognition.continuous = false;
        this.speechRecognition.interimResults = false;

        this.speechRecognition.onresult = speech => {
          if (speech.results) {
            this.zone.run(() => observer.next(speech.results[0][0].transcript));
          }
        };

        this.speechRecognition.onerror = error => {
          observer.error(error);
        };

        this.speechRecognition.onend = () => {
          observer.complete();
        };

        this.speechRecognition.start();
      }
    );
  }

  public synthVoice(text: string) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.lang = 'es-419';
    synth.speak(utterance);
  }

  public destroy() {
    if (this.speechRecognition) {
      this.speechRecognition.stop();
    }
  }

}
