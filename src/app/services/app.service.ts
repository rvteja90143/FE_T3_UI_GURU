import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  url: any = '';
  allCtaDealerConfig: any;
  returnCtaData: any;
  constructor(private httpClient: HttpClient) { 
    this.url = environment.BackendApi_Url;
  }

  get_cta_config(dealercode: string,vin:string,vehicle_type :string) {
    if(vehicle_type == undefined || vehicle_type == '')
      vehicle_type ='';
    return this.httpClient.get(this.url + '/api/get_cta_config/' + dealercode+"?vin="+vin+"&vehtype="+vehicle_type);
  }
}