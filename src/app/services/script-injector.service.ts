import { Injectable, Inject, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})


export class ScriptInjectorService {

  constructor(@Inject(DOCUMENT) private document: Document, private zone: NgZone) { }

  load(id: string, src: string){
    const scriptElement: HTMLScriptElement = this.document.createElement('script');
    scriptElement.id = id;
    scriptElement.src = src; 
    scriptElement.async = true;

    const promise = new Promise<void>((resolve, reject) =>{
      scriptElement.addEventListener('load',() => {
        setTimeout(resolve, 10);
      })
    });

    scriptElement.addEventListener('error', (err) => {
      //reject(err);
    });

    this.zone.runOutsideAngular(() =>{
      // adding the script tag object to document HEAD
      this.document.head.appendChild(scriptElement);
    });
    
    return promise;
  }

}
