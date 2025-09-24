import { DataHandler } from '../common/data-handler';
import { environment } from '../../environments/environment';

export class GA4Handler {
     config = DataHandler.ga4_measurement_id
    public static generateUUID() { 
         // Public Domain/MIT
        var d = new Date().getTime();//Timestamp
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if (d > 0) {//Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
   
    public static gtag(config:any,pagepath:any,prdata:any){
        DataHandler.dataLayer.push(arguments);
    }
   
    public static ga4VirtualPageView( prdata:any) {
        var GASource; 
        if(DataHandler.extraParameter == 'eprice'){
            GASource = 'E-price';
            } else{
             GASource = DataHandler.GASource;
            }
        var model = DataHandler.model;
        var year = DataHandler.year;
        var make = DataHandler.make;
        var source = GASource;
         var medium = "InWidget";
        var vin  = DataHandler.vin;
        var dealer = DataHandler.dealer;
        var config = 'G-XLTD7K0RDV';
        var pagename= '/'+prdata+'?DealerID='+dealer+'&Type='+'New'+'&Make='+make+'&Model='+model+'&Year='+year+'&VIN='+vin+'&Source='+source+'&Medium='+medium;
        this.gtag('config', config, {
     
        'page_path': '/'+pagename+'?DealerID='+dealer+'&Type='+'NEW'+'&Make='+make+'&Model='+model+'&Year='+year+'&VIN='+vin+'&Source='+source+'&Medium='+medium
     
      });
}


}