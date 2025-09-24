import { Injectable } from '@angular/core';

;
import { DataHandler } from '../common/data-handler';
import { environment } from '../../environments/environment';
import { ScriptInjectorService } from './script-injector.service';

declare const window : any;
declare const _satellite : any;

@Injectable({
  providedIn: 'root'
})
export class GADealerAnalyticsService {
  static gtag(arg0: string, navbottom: number) {
    throw new Error('Method not implemented.');
  }
  constructor(private scriptInjectorService: ScriptInjectorService){}
  async initGADealerLaunchScript() {
    try {
        await this.scriptInjectorService.load(
            'launch3',
            environment.GA4 + '?id=' + DataHandler.GA4_measurement_id
        );
        window.dataLayer = window.dataLayer || [];
        DataHandler.dataLayer = window.dataLayer;
      } catch(e) {
         console.log(e);
      }
  }
}
