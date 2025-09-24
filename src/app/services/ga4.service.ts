import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DataHandler } from '../common/data-handler';

@Injectable({
  providedIn: 'root',
})
export class GA4Service {
  url: any = '';
  allCtaDealerConfig: any;
  returnCtaData: any;
  callsession:any = 0;
  sessionId:any;
 
  constructor(private httpClient: HttpClient) { 
    this.url = environment.BackendApi_Url;
    if(this.callsession == 0){
      this.sessionId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      this.callsession = 1;
    }
  }

  leftpad(val: any, resultLength = 2, leftpadChar = '0'): string {
    return (String(leftpadChar).repeat(resultLength)
      + String(val)).slice(String(val).length);
  }


 
  submit_to_api(eventname: any, leadid: any, planname: any, termduration: any, paymentmode: any, accessoryname: any,pagename:any) {
    let variableWithSpace = DataHandler.trim;
    let variableWithoutSpace = variableWithSpace?.replace(/\s/g, '');
    var currentDate = new Date();
    var dt = currentDate.getFullYear() + '-' + this.leftpad(currentDate.getMonth() + 1, 2) + '-' + this.leftpad(currentDate.getDate(), 2) + '-T' + this.leftpad(currentDate.getHours(), 2) + ':' + this.leftpad(currentDate.getMinutes(), 2) + ':' + this.leftpad(currentDate.getSeconds(), 2);
    var GASource;
    if(DataHandler.extraParameter == 'eprice'){
    GASource = 'E-price';
    } else{
     GASource = DataHandler.GASource;
    }
    let ftids: any = DataHandler.getGlobalVisitorsIds;

    var mainlead = ftids + ":" + dt;
    leadid = mainlead;

    if(eventname == 'InitialLeadFormStart'|| eventname == 'TradeInBB' || eventname == 'TradeInKBB' || eventname == 'ApplyForCreditR1' || eventname == 'ApplyForCreditDT' || eventname == 'ApplyForCreditAF' || eventname == 'InitialLeadFormEnd' || eventname == 'VehicleInformation' || eventname == 'DeliveryReview' || eventname == 'TestDriveFormStart' || eventname == 'TestDriveFormEnd' || eventname == 'GetBetterEstimateFormEnd' || eventname == 'GetBetterEstimateFormStart' || eventname == 'ScheduleDelivery' || eventname == 'PhotoGallery' || eventname == 'ReserveNow'  || eventname == 'ScheduleTestDrive'|| eventname == 'LeasePayment'|| eventname == 'FinancePayment'|| eventname == 'CashPayment'
    || eventname == 'ApplyForCreditFormStartDT'|| eventname == 'ApplyForCreditFormStartR1'|| eventname == 'ApplyForCreditFormStartAF'|| eventname == 'SubmitToDealerFormStart' || eventname == 'Reviewsubmit'){  
      return this.httpClient.post(this.url + '/api/trackGA', {
        'name' : eventname,
        'params' : { 
          'DealerID' : DataHandler.dealer,
          'Type' : 'New',
          'Make' : DataHandler.make,
          'Model' : DataHandler.model,
          'Year' :DataHandler.year,
          'VIN' : DataHandler.vin,
          'Trim' : variableWithoutSpace,
          'session_id':this.sessionId,
          "Source":GASource ,
          "Medium": "InWidget",

        }
      });
    }
    else if(eventname == 'SubmitToDealerFormEnd' || eventname == 'Idlelead' || eventname == 'ApplyForCreditFormEndDT'|| eventname == 'ApplyForCreditFormEndR1'|| eventname == 'ApplyForCreditFormEndAF') {
      return this.httpClient.post(this.url + '/api/trackGA', {
        'name' : eventname,
        'params' : {
          'DealerID' : DataHandler.dealer,
          'Type' : 'New',
          'Make' : DataHandler.make,
          'Model' : DataHandler.model,
          'Year' :DataHandler.year,
          'VIN' : DataHandler.vin,
          'Trim' : variableWithoutSpace,
          'session_id':this.sessionId,
          "Source":GASource ,
          "Medium": "InWidget",
          'LeadId' : leadid
        }
      });
    }
    else if(eventname == 'ServiceProtection'){
      return this.httpClient.post(this.url + '/api/trackGA', {
        'name' : eventname,
        'params' : {
          'items' : [{
            'Plan_Name':planname,
            'Term_Duration':termduration,
            'Payment_Mode' : paymentmode
          }],
          'DealerID' : DataHandler.dealer,
          'Type' : 'New',
          'Make' : DataHandler.make,
          'Model' : DataHandler.model,
          'Year' :DataHandler.year,
          'VIN' : DataHandler.vin,
          'Trim' : variableWithoutSpace,
          'session_id':this.sessionId,
          "Source":GASource ,
          "Medium": "InWidget",
        } 
      });
    }
    else if(eventname == 'Accessories'){
      return this.httpClient.post(this.url + '/api/trackGA', {
        'name' : eventname,
        'params' : {
          'items' : [{
            'Accessory_Name':accessoryname
          }],
          'DealerID' : DataHandler.dealer,
          'Type' : 'New',
          'Make' : DataHandler.make,
          'Model' : DataHandler.model,
          'Year' :DataHandler.year,
          'VIN' : DataHandler.vin,
          'Trim' :variableWithoutSpace,
          'session_id':this.sessionId,
          "Source":GASource ,
          "Medium": "InWidget",
        } 
      });
    }  else if(eventname == 'DeliveryReviewnew' || eventname == 'Accessoriesnew' || eventname == 'service-protection' || eventname == 'TradeInBBnew' || eventname == 'TradeInKBBnew'|| eventname == 'serviceprotection & accessories'){
      return this.httpClient.post(this.url + '/api/trackGA', { 
          'name' : 'page_view',
          'params' : {
          'DealerID' : DataHandler.dealer,
          'Type' : 'New',
          'Make' : DataHandler.make,
          'Model' : DataHandler.model,
          'Year' :DataHandler.year,
          'VIN' : DataHandler.vin,
          'Trim' : variableWithoutSpace,
          'session_id':this.sessionId,
          "Source":GASource ,
          "Medium": "InWidget",
          "page_title": pagename,
          "page_path": '/DealerID='+DataHandler.dealer+'&Type=New&Make='+DataHandler.make+'&Model='+DataHandler.model+'&Year='+DataHandler.year+'&VIN='+DataHandler.vin+'&Trim='+variableWithoutSpace+'&Source='+GASource+'&Medium=InWidget',
          }
        });
  }else {
      return this.httpClient.post(this.url + '/api/trackGA', {});
    }

  }

 
}