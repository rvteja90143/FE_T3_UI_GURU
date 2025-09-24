import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { DataHandler } from '../common/data-handler';
import { ScriptInjectorService } from '../services/script-injector.service';

declare const window: any;
declare const _satellite: any;

@Injectable({
    providedIn: 'root'
})

export class AdobeSDGService {
    constructor(private scriptInjectorService: ScriptInjectorService) { }
    async initAdobeSDGLaunchScript() {
        try {
            if(!environment.production && environment.custom_env !='stage')
            {await this.scriptInjectorService.load(
                'adobeSDGscript-launch',
                environment.ADOBE_LAUNCH_SCRIPT_URL
            ); 
        }

            try {
                if (window?.adobeDataLayer == undefined || window?.adobeDataLayer == null) {
                    window.adobeDataLayer = window.adobeDataLayer || [];
                }
                setTimeout(() => {
                    DataHandler.adobeSDGgetGlobalVisitorsIds = _satellite.getVisitorId().getMarketingCloudVisitorID();
                    //console.log(DataHandler.adobeSDGgetGlobalVisitorsIds);
                }, 1000);
            } catch (err) {
                console.log("Adobe getting issue", err);
            }

            DataHandler.adobeSDGdata = window.adobeDataLayer;

            DataHandler.AdobeSDGScriptLoader = 1;
        } catch (e) {
            console.log('Analytics Script initiator issue', e);
        }
    }

}
