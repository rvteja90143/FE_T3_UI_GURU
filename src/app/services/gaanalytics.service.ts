import { Injectable } from '@angular/core';

import { ScriptInjectorService } from './script-injector.service';
import { environment } from '../../environments/environment';
import { DataHandler } from '../common/data-handler';

declare const window : any;
declare const _satellite : any;

@Injectable({
  providedIn: 'root'
})
export class GAAnalyticsService {
  static gtag(arg0: string, navbottom: number) {
    throw new Error('Method not implemented.');
  }
  constructor(private scriptInjectorService: ScriptInjectorService){}
  async initGALaunchScript() {
    try {
        await this.scriptInjectorService.load(
            'launch2',
            environment.GA4 + '?id=' + DataHandler.GA4_measurement_id
        );
        window.dataLayer = window.dataLayer || [];
        DataHandler.dataLayer = window.dataLayer;
      } catch(e) {
         console.log(e);
      }
  }
}
