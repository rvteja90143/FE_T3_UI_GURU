import { HttpClient, HttpHeaders, provideHttpClient, withFetch } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataHandler } from '../common/data-handler';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { HttpParams } from '@angular/common/http';
import { applyCreditInfo, leaseDatails, leaseDatailsUsed, prequalify_data, UsedFinanceDatails, UsedCashDatails } from '../common/data-models';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, catchError, map, Observable, switchMap, timeout } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RestService {

    dms_url: any;
    url: any = '';
    keyphrase: any = 'd41d8cd98f00b204e9810998ecf85373';
    public vehicle_type!: string;
    private formData: { [key: string]: any } = {};
    private _visiblePopUp = new BehaviorSubject<boolean>(false);
    visiblePopUp$ = this._visiblePopUp.asObservable();
    private _accessoriesClicked = new BehaviorSubject<boolean>(false);
    accessoriesClicked$ = this._accessoriesClicked.asObservable();
    private _initialFormFilled = new BehaviorSubject<boolean>(false);
    initialFormFilled$ = this._initialFormFilled.asObservable();

    constructor(private httpClient: HttpClient) {
        if (DataHandler.make_url.toLowerCase() == 'alfa') {
            this.url = environment.BackendApi_Url_Alfa;
        } else {
            this.url = environment.BackendApi_Url
        }
    }

    getIpAddress(): Observable<any> {
    return this.httpClient.get('https://api.ipify.org?format=json');
    }

    set_vehicle_type(vehicle_type: string): void {
        this.vehicle_type = vehicle_type.toLowerCase();
        if (this.vehicle_type !== undefined &&
            this.vehicle_type.toLowerCase() === 'cpo' ||
            this.vehicle_type.toLowerCase() === 'cpov'
        ) {
            this.vehicle_type = 'cpo';
        }
        else if (this.vehicle_type !== undefined && this.vehicle_type.toLowerCase() === 'used') {
            this.vehicle_type = 'used';
        } else {
            this.vehicle_type = 'new';
        }
        this.make_api_url();
    }

    make_api_url() {
        if (environment.production) {
            this.url = 'https://e-shop.|MAKE|.com';

        } else {
            if (DataHandler.make_url == 'ALFA') {
                //this.url = 'https://dev-alfaromeousa.eshopdemo.net';
                this.url = 'https://uat.drivealfaromeo.com';
            } else {
                //this.url = 'https://dev-jeep.eshopdemo.net';
                this.url = 'https://uat.e-shop.|MAKE|.com';
            }
        }
        //this.url = 'https://dev-|MAKE|.eshopdemo.net';
        //this.url = 'https://uat.e-shop.|MAKE|.com';

        // if (environment.production) {
        // this.url = 'https://e-shop.|MAKE|.com';
        //  }
        if (DataHandler.make === undefined) {
            this.url = this.url.replace('|MAKE|', 'jeep');
        }
        else {
            switch (DataHandler.make?.toLowerCase()) {

                case 'jeep':
                case 'wagoneer':
                    this.url = this.url.replace('|MAKE|', 'jeep');
                    break;

                case 'ram':
                case 'ramtrucks':
                    this.url = this.url.replace('|MAKE|', 'ramtrucks');
                    break;

                case 'fiat':
                case 'fiatusa':
                    this.url = this.url.replace('|MAKE|', 'fiatusa');
                    break;

                case 'alfa':
                case 'alfaromeousa':
                case 'alfa romeo':
                    this.url = this.url.replace('|MAKE|', 'alfaromeousa');
                    break;

                case 'dodge':
                    this.url = this.url.replace('|MAKE|', 'dodge');
                    break;

                case 'chrysler':
                    this.url = this.url.replace('|MAKE|', 'chrysler');
                    break;
            }
        }

        DataHandler.api_url = this.url;
    }

    encrypt(input: any): any {
        var keyObj = CryptoJS.enc.Utf8.parse(this.keyphrase);
        var encryptedtext = encodeURIComponent(CryptoJS.AES.encrypt(input, keyObj, { iv: CryptoJS.enc.Hex.parse(this.keyphrase) }).toString());
        return encryptedtext;
    }

    parseJwt(token: any) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    // get_type(vin: string) {
    //   this.make_api_url();

    //   return this.httpClient.post(this.url + '/api/fetchMakeName', {
    //     vin: vin
    //   });
    // }

    get_countycity(zipcode: string) {
        return this.httpClient.post(this.url + '/api/getCustomerZipcodeDetails', {
            zipcode: zipcode
        });
    }

    get_vehicle_images(vin: string, dealercode: string) {
        return this.httpClient.post(this.url + '/api/photos_gallary', {
            vin: vin,
            dealercode: dealercode
        });
    }

    get_lease_detailsUsed(payload: leaseDatailsUsed) {
        let data = DataHandler.serviceleaseIds;
        return this.httpClient.post(this.url + '/lender-desk/api', payload, {
            responseType: 'text',
        });
    }

    get_lease_details(payload: leaseDatails) {// vin: string, dealrcode: string, zipcode: string, tier: string, downpayment: string, tradein: string, terms: string, mileage: string, ids: string, step: string, state: string, county: string, iscuszip: string,lender_value :string) {
        var data: any;
        data = DataHandler.serviceleaseIds;
        return this.httpClient.post(this.url + '/lender-desk/api', {
            vin: payload.vin,
            dealercode: payload.dealercode,
            zipcode: payload.zipcode,
            msrp: payload.msrp,
            transactionType: 'lease',
            tiers: payload.tier,
            loading: payload.loading,
            tradein: payload.tradein,
            prevtradein: payload.prevtradein,
            term: payload.term,
            mileage: payload.mileage,
            down: payload.down,
            prevdown: DataHandler.prevdownlease,
            selectedIds: payload.selectedIds,
            is_widget: 'Y',
            dealer_discount_available: payload.dealer_discount_available,
            user_service_a_protection: payload.user_service_a_protection,
            customer_state: payload.customer_state,
            customer_county_city: payload.customer_county_city,
            is_customer_zipcode: payload.is_customer_zipcode,
            lender_code: payload.lender_code,
            current_session: DataHandler.currentSession_PrivateOffer,
            get_down_pay_from_ui: DataHandler.get_down_pay_from_ui,
            email: DataHandler.private_offer_email,
            sltMoparAcc: payload.sltMoparAcc,
            program_type: DataHandler.programtype
        }, { responseType: 'text' });
    }
    get_finance_details(payload: any) {
        var data: any;
        data = DataHandler.servicefinanceIds;
        //console.log("finance_rate_interest_used:",DataHandler.finance_rate_interest_used);
        //console.log("DataHandler.financeapr:111:",DataHandler.financeapr);
        // console.log("this.vehicle_type",DataHandler.vehicle_type)
        // if (DataHandler.vehicle_type == 'used') {
        //     this.url = environment.UsedBackendApi_Url
        // } else {
        //     //console.log("else p")
        // }

        // if (payload.tier == undefined) { payload.tier = '1'; }
        let lowestTypeValue= DataHandler.lowestType.split('_')
        let lowestType = lowestTypeValue[0]
        let lowestAprRate  = lowestTypeValue[1]
        if(lowestType.toLowerCase() == 'subvented retail finance'){
            lowestType ='lowest_apr'
        }else if(lowestType.toLowerCase() == 'non-subvented finance'){
            lowestType = 'lowest_price'
        }else if(lowestType.toLowerCase() == 'estimated apr'){
            lowestType='dealer_price'
        }

        let paymenturl;
        if (DataHandler.vehicle_type == 'used') {

            paymenturl = environment.UsedBackendApi_Url + '/api/cpov/estpayment'
            return this.httpClient.post(paymenturl, {
                vin: payload.vin,

                dealer_code: payload.dealercode,
                zipcode: payload.zipcode,
                msrp: payload.msrp,

                transactionType: 'F',
                tiers: payload.tier,
                loading: payload.initial_load,
                tradein: payload.tradein,
                prevtradein: DataHandler.prevtradeinfinance,
                terms: payload.terms,
                internetprice: Number(DataHandler.dealerprice),
                apr_rate: DataHandler.financeapr,
                finance_rate_interest: DataHandler.finance_rate_interest_used,
                apr_rate_type: DataHandler.aprRateType,
                down: payload.down,
                prevdown: DataHandler.prevdownfinance,
                selectedIds: payload.selectedIds,
                is_widget: 'Y',
                dealer_discount_available: payload.dealer_discount_available,
                user_service_a_protection: payload.user_service_a_protection,
                customer_state: payload.customer_state,
                customer_county_city: payload.customer_county_city,
                is_customer_zipcode: payload.is_customer_zipcode,
                lender_code: payload.lender_code,
                lowest_type: payload.lowest_type,
                current_session: DataHandler.currentSession_PrivateOffer,
                get_down_pay_from_ui: DataHandler.fin_get_down_pay_from_ui,
                email: DataHandler.private_offer_email,
                sltMoparAcc: payload.sltMoparAcc
            }, { responseType: 'text' });
        }
        else {
            if(DataHandler.lowestType =='Non-subvented Finance'){
                DataHandler.lowestType ='lowest_price'
            }
            paymenturl = this.url + '/lender-desk/api'
            return this.httpClient.post(paymenturl, {
                vin: payload.vin,
                dealercode: payload.dealercode,
                zipcode: payload.zipcode,
                msrp: payload?.msrp,
                transactionType: 'finance',
                tiers: payload.tier,
                loading: payload.initial_load,
                tradein: payload.tradein,
                prevtradein: DataHandler.prevtradeinfinance,
                term: payload.terms,
                apr_rate: lowestAprRate,
                down: payload.down?.toString(),
                prevdown: DataHandler.prevdownfinance,
                selectedIds: payload.selectedIds,
                is_widget: 'Y',
                dealer_discount_available: payload.dealer_discount_available,
                user_service_a_protection: payload.user_service_a_protection,
                customer_state: payload.customer_state,
                customer_county_city: payload.customer_county_city,
                is_customer_zipcode: payload.is_customer_zipcode,
                lender_code: payload.lender_code,
                lowest_type: lowestType,
                current_session: DataHandler.currentSession_PrivateOffer,
                get_down_pay_from_ui: DataHandler.fin_get_down_pay_from_ui,
                email: DataHandler.private_offer_email,
                sltMoparAcc: payload.sltMoparAcc
            }, { responseType: 'text' });
        }
    }
    get_cash_details(payload: any) {
        var data: any;
        data = DataHandler.servicecashIds;
        // if (DataHandler.vehicle_type == 'used') {
        //     this.url = environment.UsedBackendApi_Url
        // } else {
        //     //console.log("else p cash")
        // }
        let paymenturl;
        if (DataHandler.vehicle_type == 'used') {

            paymenturl = environment.UsedBackendApi_Url + '/api/cpov/estpayment'

            return this.httpClient.post(paymenturl, {

                vin: payload.vin,

                dealer_code: payload.dealercode,
                zipcode: payload.zipcode,
                msrp: '0',
                transactionType: 'C',
                tiers: '1',
                loading: payload.initial_load,
                tradein: payload.tradein,
                internetprice: Number(DataHandler.dealerprice),
                // mileage: '0',
                // down: 0,
                selectedIds: payload.selectedIds,
                dealer_discount_available: payload.dealer_discount_available,
                user_service_a_protection: payload.user_service_a_protection,
                is_widget: 'Y',
                customer_state: payload.customer_state,
                customer_county_city: payload.customer_county_city,
                is_customer_zipcode: payload.is_customer_zipcode,
                lender_code: payload.lender_value,
                current_session: DataHandler.currentSession_PrivateOffer,
                email: DataHandler.private_offer_email,
                sltMoparAcc: payload.sltMoparAcc
            }, { responseType: 'text' });
        }

        else {
            paymenturl = this.url + '/lender-desk/api'

            return this.httpClient.post(paymenturl, {

                vin: payload.vin,
                dealercode: payload.dealercode,
                zipcode: payload.zipcode,
                msrp: '0',
                transactionType: 'cash',
                tiers: '1',
                loading: payload.initial_load,
                tradein: payload.tradein,
                mileage: '0',
                down: 0,
                selectedIds: payload.selectedIds,
                dealer_discount_available: payload.dealer_discount_available,
                user_service_a_protection: payload.user_service_a_protection,
                is_widget: 'Y',
                customer_state: payload.customer_state,
                customer_county_city: payload.customer_county_city,
                is_customer_zipcode: payload.is_customer_zipcode,
                lender_code: payload.lender_value,
                current_session: DataHandler.currentSession_PrivateOffer,
                email: DataHandler.private_offer_email,
                sltMoparAcc: payload.sltMoparAcc,
                source:'t3'
            }, { responseType: 'text' });
        }
    }

    get_dms_encryptedData(endpoint: string, payload: any): Observable<any> {
        if(environment.production){
            this.dms_url = 'https://dms-api.apicarzato.com';
        }else{
           //this.dms_url = 'https://dms-api.eshopdemoapp.com';
           this.dms_url = 'https://uat-dms-api.apicarzato.com';
        }
        const headers = new HttpHeaders({
            'x-access-token':'f41c0bb9-a4c2-40b4-b252-0b356d5ef180',
            'Content-Type': 'application/json',
        });
        const options = { headers: headers };
        return this.httpClient.post<any>(`${this.dms_url}/${endpoint}`, payload, options)
            .pipe(
                timeout(30000), // Set the timeout to 30 seconds
                catchError(error => {
                    console.error('Request timeout or network error:', error);
                    throw error;
                })
            );
    }

    getToken() {
        return this.httpClient.get(this.url + '/api/get-csrf-token', { observe: 'response', withCredentials: false });
    }

    getCreditscore() {
        return this.httpClient.get(this.url + '/api/credit_score', { observe: 'response', withCredentials: false });
    }

    getAddress(par: string) {

        return this.httpClient.post(this.url + '/api/fetchAutoAddress', { input: par });
    }

    get_vehicle_accessories(vin: string) {
        const httpOptions = {
            headers: new HttpHeaders({})
        }

        const body = {};
        return this.httpClient.post(this.url + '/api/list_accessories?vin=' + vin, body, httpOptions);
    }

    get_vehicle_specification(vin: string) {
        const httpOptions = {
            headers: new HttpHeaders({})
        }

        const body = {};
        return this.httpClient.post(this.url + '/api/vdp_details_spec?vin=' + vin, body, httpOptions);
    }

    get_service_protection(vin: string) {
        const httpOptions = {
            headers: new HttpHeaders({})
        }

        const body = {};
        if (DataHandler.vehicle_type == 'new') {
            return this.httpClient.post(this.url + '/api/list_service_protection?vin=' + vin, body, httpOptions);
        }
        else {
            return this.httpClient.post(environment.UsedBackendApi_Url + '/api/cpov/list_service_protection?vin=' + vin, body, httpOptions);
        }
    }

    get_deliver_data(vin: string, dealercode: string) {
        const httpOptions = {
            headers: new HttpHeaders({})
        }
        const body = {};
        return this.httpClient.post(this.url + '/api/getDealerInfoDetails?dealer_code=' + dealercode + '&vin=' + vin, body, httpOptions);
    }

    get_ca_details(vin: string, dealercode: string, firstname: string, lastname: string, phone: string, zipcode: string, email: string, retailtype: string) {
        return this.httpClient.post(this.url + '/api/credit_application', {
            vin: vin,
            dealer_code: dealercode,
            first_name: this.encrypt(firstname),
            last_name: this.encrypt(lastname),
            phone: this.encrypt(phone),
            zip: zipcode,
            email: this.encrypt(email),
            retailtype: retailtype,
            tier: 'ore',
        });

    }
    set_redis_cache_initial_form() {
        var ftids: any = DataHandler.adobeSDGgetGlobalVisitorsIds;
        var currentDate = new Date();
        var dt = currentDate.getUTCFullYear() + '-' + this.leftpad(currentDate.getUTCMonth() + 1, 2) + '-' + this.leftpad(currentDate.getUTCDate(), 2) + 'T' + this.leftpad(currentDate.getUTCHours(), 2) + ':' + this.leftpad(currentDate.getUTCMinutes(), 2) + ':' + this.leftpad(currentDate.getUTCSeconds (), 2);
        ftids = ftids + ":" + dt;
        if(DataHandler.ft_id != undefined && DataHandler.ft_id != null && DataHandler.ft_id !=''){
            ftids = DataHandler.ft_id
        }
    
   
        
    const httpOptions = {
      headers: new HttpHeaders({})
    }
    console.log('check set_cache',DataHandler.prequalComment);
        return this.httpClient.post(this.url + '/api/set_cache', {
        cache_type: 'initial_form',
        session_id: DataHandler.current_session,
        first_name: this.encrypt(DataHandler.firstname),
        last_name: this.encrypt(DataHandler.lastname),
        zipcode: DataHandler.zipcode,
        contact_phone: this.encrypt(DataHandler.phone),
        contact_email: this.encrypt(DataHandler.email),
        current_FTID: ftids,
        comments:DataHandler.prequalComment
        }, httpOptions);
    }

    leftpad(val: any, resultLength = 2, leftpadChar = '0'): string {
        return (String(leftpadChar).repeat(resultLength)
            + String(val)).slice(String(val).length);
    }

    submit_lead_details() {
        var api = '/api/createlead'



        if (DataHandler.vehicle_type == 'new') {

            api = this.url + '/api/createlead'
        } else if (DataHandler.vehicle_type == 'used') {

            api = environment.UsedBackendApi_Url + '/api/cpov/createlead'
        }
        //prevent multiple lead
        if (DataHandler.leadSubmission[DataHandler.vin] == 2) {
            var returnT: any;
            return returnT;
        }
        if (DataHandler.closeReserve) {
            DataHandler.leadSubmission[DataHandler.vin] = 2;
        }
        
        var submission_type = DataHandler.sourceType?.toLowerCase() + '-' + DataHandler.currentSubmitType?.toLowerCase()
        if(DataHandler.sourceType?.toLowerCase() == 'alst' || DataHandler.sourceType?.toLowerCase() == 'fullpath'){           
            if(DataHandler.currentSubmitType != ''  &&  DataHandler.currentSubmitType != null){
                    DataHandler.currentSubmitType = submission_type
            }else{
                    DataHandler.currentSubmitType = submission_type +'uexp'
            }
        }
        
        var currentDate = new Date();
        var creditflag = '';
        var tradein_make = '';
        var tradein_model = '';
        var tradein_series = '';
        var tradein_year = '';
        var tradein_style = '';
        var tradein_mileage = '';
        var tradein_zip = '';
        var tradein_condition = {};
        var tradein_options = '';
        var tradein_tradeinvalue = 0;
        var tradein_tradeinadjvalue: any = 0;
        var delivdate = "";
        var delivtime = "";
        var delivlocation = "";
        var delivlocationhome = "false";
        var delivaddress = "";
        var delivcity = "";
        var delivstate = "";
        var delivzip = "";
        var delivermsg = "";
        var deliverstr = {};
        var testdate = "";
        var testtime = "";
        var testlocation = "";
        var testaddress = "";
        var testcity = "";
        var teststate = "";
        var testzip = "";
        var testmsg = "";
        var selectedpayement = {};
        var payment_lease = {};
        var payment_finance = {};
        var payment_cash = {};
        var deliverystring: any = {};
        var tradeinstring = {};
        var leaseselectedconditionaloffer = DataHandler.leaseselectedconditionaloffer;
        var financeselectedconditionaloffer = DataHandler.financeselectedconditionaloffer;
        var cashselectedconditionaloffer = DataHandler.cashselectedconditionaloffer;

        var dt = currentDate.getUTCFullYear() + '-' + this.leftpad(currentDate.getUTCMonth() + 1, 2) + '-' + this.leftpad(currentDate.getUTCDate(), 2) + 'T' + this.leftpad(currentDate.getUTCHours(), 2) + ':' + this.leftpad(currentDate.getUTCMinutes(), 2) + ':' + this.leftpad(currentDate.getUTCSeconds(), 2);
        if (DataHandler.testdrive?.location == 'dealership') {
            testlocation = "Dealership";
            testdate = DataHandler.testdrive?.date;
            testtime = DataHandler.testdrive?.time;
            testmsg = "User interested in Test Drive at the store on " + testdate + " at " + testtime + DataHandler.is_dms_document_submited;
        } else if (DataHandler.testdrive?.location == 'myhome') {
            testlocation = "Home";
            testdate = DataHandler.testdrive?.date;
            testtime = DataHandler.testdrive?.time;
            testaddress = DataHandler.testdrive?.hlhomeAddress;
            testcity = DataHandler.testdrive?.hlcity;
            teststate = DataHandler.testdrive?.hlstate;
            testzip = DataHandler.testdrive?.hlzipcode;
            testmsg = "Customer would like to take a test drive at home on " + testdate + " at " + testtime + DataHandler.is_dms_document_submited;
        } else if (DataHandler.testdrive?.location == 'otherlocation') {
            testlocation = "Other Location";
            testdate = DataHandler.testdrive?.date;
            testtime = DataHandler.testdrive?.time;
            testaddress = DataHandler.testdrive?.olhomeAddress;
            testcity = DataHandler.testdrive?.olcity;
            teststate = DataHandler.testdrive?.olstate;
            testzip = DataHandler.testdrive?.olzipcode;
            testmsg = "Customer would like to take a test drive at other location on " + testdate + " at " + testtime + DataHandler.is_dms_document_submited;
        }

        if (DataHandler.scheduledelivery != null) {
            deliverystring = {
                "vin": DataHandler.vin,
                "dealer_code": DataHandler.dealer,
                "make": DataHandler.make,
                "tier": DataHandler.tier,
                "year": DataHandler.year,
                "model": DataHandler.model,
                "payment_type": DataHandler.reviewflag
            }
        }

        if (DataHandler.scheduledelivery?.location == 'drs_dealership') {
            delivlocation = "Dealership";
            delivdate = DataHandler.scheduledelivery?.date;
            delivtime = DataHandler.scheduledelivery?.time;
            delivermsg = "Customer would like to get delivery at dealership on " + delivdate + " at " + delivtime;

            deliverystring.pickup_location = delivlocation;
            deliverystring.delivery_date = delivdate;
            deliverystring.delivery_time = delivtime;

        } else if (DataHandler.scheduledelivery?.location == 'drs_myhome') {
            delivlocation = "My Home";
            DataHandler.homedeliverycheck_submitform = true;
            delivlocationhome = "true";
            delivdate = DataHandler.scheduledelivery?.date;
            delivtime = DataHandler.scheduledelivery?.time;
            delivaddress = DataHandler.scheduledelivery?.hlhomeAddress;
            delivcity = DataHandler.scheduledelivery?.hlcity;
            delivstate = DataHandler.scheduledelivery?.hlstate;
            delivzip = DataHandler.scheduledelivery?.hlzipcode;
            delivermsg = "Customer would like to get delivery at home on " + delivdate + " at " + delivtime;
            deliverstr = {
                "address": delivaddress,
                "city": delivcity,
                "state": delivstate,
                "zipcode": delivzip
            };
            deliverystring.delivery_address = deliverstr;
            deliverystring.pickup_location = delivlocation;
            deliverystring.delivery_date = delivdate;
            deliverystring.delivery_time = delivtime;
        } else if (DataHandler.scheduledelivery?.location == 'drs_otherlocation') {
            delivlocation = "Other Location";
            delivdate = DataHandler.scheduledelivery?.date;
            delivtime = DataHandler.scheduledelivery?.time;
            delivaddress = DataHandler.scheduledelivery?.olhomeAddress;
            delivcity = DataHandler.scheduledelivery?.olcity;
            delivstate = DataHandler.scheduledelivery?.olstate;
            delivzip = DataHandler.scheduledelivery?.olzipcode;
            delivermsg = "Customer would like to get delivery at other location on " + delivdate + " at " + delivtime;
            deliverstr = {
                "address": delivaddress,
                "city": delivcity,
                "state": delivstate,
                "zipcode": delivzip
            };

            deliverystring.delivery_address = deliverstr;
            deliverystring.pickup_location = delivlocation;
            deliverystring.delivery_date = delivdate;
            deliverystring.delivery_time = delivtime;
        }

        if (DataHandler.tradeinmake != null) {
            tradein_make = DataHandler.tradeinmake;
            tradein_model = DataHandler.tradeinmodel;
            tradein_series = DataHandler.tradeinseries;
            tradein_year = DataHandler.tradeinyear;
            tradein_style = DataHandler.tradeinstyle;
            tradein_mileage = DataHandler.tradeinmileage;
            tradein_zip = DataHandler.tradeinzip;
            tradein_condition = DataHandler.tradeincondition;
            tradein_options = DataHandler.tradeinoptions;
            tradein_tradeinvalue = DataHandler.tradeinvalue;
            tradein_tradeinadjvalue = DataHandler.tradeinadjvalue;
            tradeinstring = {
                "year": tradein_year,
                "make": tradein_make,
                "model": tradein_model,
                "series": tradein_series,
                "style": tradein_style,
                "mileage": tradein_mileage,
                "zip": tradein_zip,
                "condition": tradein_condition,
                "options": tradein_options,
                "price": tradein_tradeinvalue,
                "remainingvalue": tradein_tradeinadjvalue
            };
        }

        if (DataHandler.currentSubmitType == 'explore-finance-options') {
            if (leaseselectedconditionaloffer == undefined || leaseselectedconditionaloffer.length == 0) {
                leaseselectedconditionaloffer = {};
            }
            if (financeselectedconditionaloffer == undefined || financeselectedconditionaloffer.length == 0) {
                financeselectedconditionaloffer = {};
            }
            if (cashselectedconditionaloffer == undefined || cashselectedconditionaloffer.length == 0) {
                cashselectedconditionaloffer = {};
            }
            var conditionalOffer: any = this.checkBCincentiveAvailable();
            if (conditionalOffer.length > 0) {
                for (let i in conditionalOffer) {
                    if (DataHandler.objActivePaymentData.activeTab?.toLowerCase() == "lease") {
                        leaseselectedconditionaloffer[conditionalOffer[i].programId] = conditionalOffer[i];
                    } else if (DataHandler.objActivePaymentData.activeTab?.toLowerCase() == "finance") {
                        financeselectedconditionaloffer[conditionalOffer[i].programId] = conditionalOffer[i];
                    } else if (DataHandler.objActivePaymentData.activeTab?.toLowerCase() == "cash") {
                        cashselectedconditionaloffer[conditionalOffer[i].programId] = conditionalOffer[i];
                    }

                }
            }
        }

        // if (DataHandler.currentSubmitType == 'reserve-now') {
            // DataHandler.zipcode = DataHandler.dealer;
        // }

        payment_lease = {
            "type": "Lease",
            "xmlvariables": {
                "taxes": DataHandler.leasetaxes,
                "fees": DataHandler.leasefees,
                "dueatsigning": DataHandler.leasedueatsigning,
                "monthly_taxes": DataHandler.leasemonthlytaxes,
                "monthly_payment_with_taxes": DataHandler.leasemonthlypaymentwithtaxes,
                "msrp_results": DataHandler.msrp,
                "tradeInValue": DataHandler.leasetradein,
                "developer": {
                    "arraybuilder": {
                        "tradeInValue": DataHandler.leasetradein,
                        "milesPerYear": DataHandler.leasemileage
                    }
                },
                "incentiveAmount": DataHandler.leaseincentive,
                "original_downpayment": DataHandler.leasedownpayment,
                "dealer_discount_available": DataHandler.dealerdiscount,
                "dealer_discount": "0",
                "additional_discount": "0",
                "incentivesBonusCashList": DataHandler.leaseselectinventory,
                "selected_conditional_offer": leaseselectedconditionaloffer,
                "selected_allmanmoney": DataHandler.leaseselectedallmanmoney,
                "rebateDetailsfinalamount": DataHandler.totallease
            },
            "downpayment": DataHandler.leasedownpayment,
            "total": DataHandler.leasecapitalcost,
            "comments": "Terms:" + DataHandler.leasedafaultterm,
            "monthly": DataHandler.leasemonthly
        };

        payment_finance = {
            "type": "Finance",
            "xmlvariables": {
                "taxes": DataHandler.financetaxes,
                "fees": DataHandler.financefees,
                "dueatsigning": DataHandler.financedueatsigning,
                "monthly_taxes": DataHandler.financemonthlytaxes,
                "monthly_payment_with_taxes": DataHandler.financemonthlypaymentwithtaxes,
                "msrp_results": DataHandler.msrp,
                "tradeInValue": DataHandler.financetradein,
                "developer": {
                    "arraybuilder": {
                        "tradeInValue": DataHandler.financetradein,
                    }
                },
                "incentiveAmount": DataHandler.financeincentive,
                "original_downpayment": DataHandler.financedownpayment,
                "dealer_discount_available": DataHandler.dealerdiscount,
                "dealer_discount": "0",
                "additional_discount": "0",
                "incentivesBonusCashList": DataHandler.financeselectinventory,
                "selected_conditional_offer": financeselectedconditionaloffer,
                "selected_allmanmoney": DataHandler.financeselectedallmanmoney,
                "rebateDetailsfinalamount": DataHandler.totalfinance,
            },
            "downpayment": DataHandler.financedownpayment,
            "roi": DataHandler.financeapr,
            "total": DataHandler.financecapitalcost,
            "comments": "Terms:" + DataHandler.financedafaultterm,
            "monthly": DataHandler.financemonthly
        };

        var adjustedamount = 0;
        if (DataHandler.msrp > tradein_tradeinadjvalue) {
            adjustedamount = tradein_tradeinadjvalue;
        }

        payment_cash = {
            "type": "Cash",
            "xmlvariables": {
                "taxes": DataHandler.cashtaxes,
                "fees": DataHandler.cashfees,
                "dueatsigning": DataHandler.cashdueatsigning,
                "monthly_taxes": DataHandler.cashmonthlytaxes,
                "monthly_payment_with_taxes": DataHandler.cashmonthlypaymentwithtaxes,
                "msrp_results": DataHandler.msrp,
                "tradeInValue": DataHandler.cashtradein,
                "developer": {
                    "arraybuilder": {
                        "tradeInValue": DataHandler.cashtradein,
                    }
                },
                "incentiveAmount": DataHandler.cashincentive,
                "dealer_discount_available": DataHandler.dealerdiscount,
                "dealer_discount": "0",
                "additional_discount": "0",
                "incentivesBonusCashList": DataHandler.cashselectinventory,
                "selected_conditional_offer": cashselectedconditionaloffer,
                "selected_allmanmoney": DataHandler.cashselectedallmanmoney,
                "rebateDetailsfinalamount": DataHandler.totalcash
            },
            "total": DataHandler.cashmonthlycost,
            "monthly": DataHandler.cashmonthlycost
        };

        if (DataHandler.objActivePaymentData?.activeTab?.toLowerCase() == "lease")
            selectedpayement = payment_lease;
        else if (DataHandler.objActivePaymentData?.activeTab?.toLowerCase() == "finance")
            selectedpayement = payment_finance;
        else if (DataHandler.objActivePaymentData?.activeTab?.toLowerCase() == "cash")
            selectedpayement = payment_cash;

        if (DataHandler.creditflag_set == 1)
            creditflag = DataHandler.creditflag;
        else
            creditflag = '';


        if (DataHandler.objActivePaymentData.activeTab?.toLowerCase() == "lease" && DataHandler.leasedownpayment == 0) {
            selectedpayement = payment_finance;
            if (DataHandler.financedownpayment == 0) {
                selectedpayement = payment_cash;
            }
        }
        if (DataHandler.objActivePaymentData.activeTab?.toLowerCase() == "finance" && DataHandler.financedownpayment == 0) {
            selectedpayement = payment_cash;
        }

        var ftids: any = DataHandler.adobeSDGgetGlobalVisitorsIds;
        var currentDate = new Date();
        var dt = currentDate.getUTCFullYear() + '-' + this.leftpad(currentDate.getUTCMonth() + 1, 2) + '-' + this.leftpad(currentDate.getUTCDate(), 2) + 'T' + this.leftpad(currentDate.getUTCHours(), 2) + ':' + this.leftpad(currentDate.getUTCMinutes(), 2) + ':' + this.leftpad(currentDate.getUTCSeconds (), 2);
        ftids = ftids + ":" + dt;
        if(DataHandler.ft_id != undefined && DataHandler.ft_id != null && DataHandler.ft_id !=''){
            ftids = DataHandler.ft_id
        }

        var httpParams = new HttpParams({ fromString: window.location.href.split('?')[1] });
        var so_pop = httpParams.get("so_pop");

        //credit_app_status = Completed
        if(DataHandler.vin == '' || DataHandler.vin == undefined || DataHandler.vin == null){
            this.chk_submit_leads().then(response => {});
            //alert("have some issue due to vin value is:"+DataHandler.vin+" and dealer code is "+DataHandler.dealer)
            return
        }
        if(DataHandler.dealer == '' || DataHandler.dealer == undefined || DataHandler.dealer == null){
            this.chk_submit_leads().then(response => {});
           // alert("have some issue due to dealercode value is:"+DataHandler.dealer+"vin is: "+DataHandler.vin)
            return
        }     
        var page = '';
        if(DataHandler.page !='' && DataHandler.page != null){
            switch(DataHandler.page?.toLowerCase()){
                case "testdrive": page = 'DL-TestDrive'
                     break;
                case "tradein": page = 'DL-TradeIn'
                     break;
                case "applycredit": page = 'DL-CreditApp'
                     break;
                case "reservenow": page = 'DL-RESERVE'
                     break;
            }
        }
        console.log('check lead==>',DataHandler.prequalComment);
        var payload = {
            "vin": DataHandler.vin,
            "dealer_code": DataHandler.dealer,
            "sis_dealercode": DataHandler.dealer,
            "dealerZip": DataHandler.dealerzip,
            "make": DataHandler.make,
            "year": DataHandler.year,
            "model": DataHandler.model,
            "first": this.encrypt(DataHandler.firstname),
            "last": this.encrypt(DataHandler.lastname),
            "postalcode": DataHandler.zipcode,
            "contact_email": this.encrypt(DataHandler.email),
            "contact_phone": this.encrypt(DataHandler.phone),
            "chk_box_home_delivery": DataHandler.homedeliverycheck_submitform,
            "tier": DataHandler.tier,
            "current_FTID": ftids,
            "adobe_session": DataHandler.merklevistor,
            "init_pop_btntraffic": "",
            "comments": testmsg,
            "prequal_comments_used":DataHandler.prequalComment,
            "testdrive_streetline1": testaddress,
            "testdrive_city": testcity,
            "testdrive_state": teststate,
            "testdrive_zipcode": testzip,
            "accessories": DataHandler.accessories,
            "lease": DataHandler.servicelease,
            "finance": DataHandler.servicefinance,
            "cash": DataHandler.servicecash,
            "tradein": tradeinstring,
            "scheduledeliver": deliverystring,
            "payment_payload": selectedpayement,
            "credit_app_type": creditflag,
            "current_submit_type": (DataHandler.currentSubmitType !='' && DataHandler.currentSubmitType != null) ? 't3-'+DataHandler.currentSubmitType : 't3-uexp',
            "current_session": DataHandler.current_session,
            "so_pop": so_pop,
            "is_widget": 'Y',
            "reserve_purchase_unit": DataHandler.payPalPurchaseUnit,
            "credit_current_form": DataHandler.autofiPage,
            "credit_app_status": DataHandler.autofiStatus,
            "vehicle_type": DataHandler.actualVehicleType,
            "credit_autofi_type":DataHandler.enableautofi,
            "deep_link_page":page,
	         "txn_anchor":    this.encrypt(DataHandler.ip_address),
            "trace_code":    DataHandler.fj_visitor_id
        }
        // const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        // navigator.sendBeacon(api, blob);
        /////return this.httpClient.post(api, payload);

        ///return navigator.sendBeacon(api, JSON.stringify(payload));

//Following is the Working Code for Tab/Browser Close
 fetch(api, {
    method: 'POST',
    keepalive: true,
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });

 //alert("lead submited with vin: "+DataHandler.vin+" and dealercode: "+DataHandler.dealer+" email encryption: "+DataHandler.email)

    }

    checkBCincentiveAvailable() {
        var returnOffer = [];
        if (DataHandler.objActivePaymentData.activeTab?.toLowerCase() == "lease") {
            if (DataHandler.eshopLeaseConditionalOffer.length > 0) {
                returnOffer = DataHandler.eshopLeaseConditionalOffer;
            } else if (DataHandler.eshopFinanceConditionalOffer.length > 0) {
                returnOffer = DataHandler.eshopFinanceConditionalOffer;
            } else if (DataHandler.eshopCashConditionalOffer.length > 0) {
                returnOffer = DataHandler.eshopCashConditionalOffer;
            }
        } else if (DataHandler.objActivePaymentData.activeTab.toLowerCase() == "finance") {
            if (DataHandler.eshopFinanceConditionalOffer.length > 0) {
                returnOffer = DataHandler.eshopFinanceConditionalOffer;
            } else if (DataHandler.eshopLeaseConditionalOffer.length > 0) {
                returnOffer = DataHandler.eshopLeaseConditionalOffer;
            } else if (DataHandler.eshopCashConditionalOffer.length > 0) {
                returnOffer = DataHandler.eshopCashConditionalOffer;
            }
        } else if (DataHandler.objActivePaymentData.activeTab.toLowerCase() == "cash") {
            if (DataHandler.eshopCashConditionalOffer.length > 0) {
                returnOffer = DataHandler.eshopCashConditionalOffer;
            } else if (DataHandler.eshopLeaseConditionalOffer.length > 0) {
                returnOffer = DataHandler.eshopLeaseConditionalOffer;
            } else if (DataHandler.eshopFinanceConditionalOffer.length > 0) {
                returnOffer = DataHandler.eshopFinanceConditionalOffer;
            }
        }
        return returnOffer;
    }

    GATrackingData() {
        var data: any = {};
        Object.keys(DataHandler.googleAnalyticsData).forEach(function (key) {
            var val = DataHandler.googleAnalyticsData[key];
            key = key.replace(/:/g, "-");
            data[key] = val;
        });
        let payload = {
            data: data,
            dealer_code: DataHandler.dealer
        };
        return this.httpClient.post(this.url + '/api/google_analytics_tracking_data', payload);
    }

    get_vin_lock_status() {
        const httpOptions = {
            headers: new HttpHeaders({})
        }
        const body = { current_session: DataHandler.current_session };
        return this.httpClient.post(this.url + '/api/check-locked-vins?vin=' + DataHandler.vin, body, httpOptions);
    }

    save_vin_lock_status() {
        const httpOptions = {
            headers: new HttpHeaders({})
        }
        const body = { current_session: DataHandler.current_session };
        return this.httpClient.post(this.url + '/api/save-locked-vins?vin=' + DataHandler.vin, body, httpOptions);
    }

    release_vin_lock() {
        const httpOptions = {
            headers: new HttpHeaders({})
        }
        const body = { current_session: DataHandler.current_session };
        return this.httpClient.post(this.url + '/api/release-locked-vin?vin=' + DataHandler.vin, body, httpOptions);
    }

    reservation_order_capture() {
        var trim = DataHandler.trim.replace(new RegExp("%20", 'g'), " ");
        trim = trim.toUpperCase().replace(DataHandler.model.toUpperCase(), "").trim();
        return this.httpClient.post(this.url + '/api/reservationlead/reserve-order-capture', {
            pagename: 'inwidget',
            dealercode: DataHandler.dealer,
            vin: DataHandler.vin,
            make: DataHandler.make?.toLowerCase(),
            model: DataHandler.model,
            year: DataHandler.year,
            trim: trim,
            order_id: DataHandler.orderIdForReservation,
            mmyid: DataHandler.oreIdForReservation,
            email_cache: DataHandler.email,
            msrp: DataHandler.reserveAmount,
            full_name: DataHandler.firstname + ' ' + DataHandler.lastname,
            params_vechType: '',
            EnteredZipCode: DataHandler.zipcode,
            current_session: DataHandler.current_session
        }, { responseType: 'text' });
    }

    reservenow_faq() {
        const httpOptions = {
            headers: new HttpHeaders({})
        }
        const body = {};
        return this.httpClient.post(this.url + '/api/reservenow-faq', body, httpOptions);
    }

    prequal_estimation(data: prequalify_data) {
        const httpOptions = {
            headers: new HttpHeaders({})
        }
        return this.httpClient.post(this.url + '/api/prequalification', data, httpOptions);
    }

    get_applycreditconfig(payload: applyCreditInfo) {
        const httpOptions = {
            headers: new HttpHeaders({}),
        };
        return this.httpClient.post(
            this.url + '/getApplyCreditConfig',
            payload,
            httpOptions
        );
    }

    saveFormState(formName: string, formGroup: FormGroup) {
        this.formData[formName] = formGroup.value;
    }

    getFormState(formName: string): any {
        return this.formData[formName];
    }

    saveResidenceFormState(formName: string, formGroup: FormGroup) {
        this.formData[formName] = formGroup.value;
    }

    getResidenceFormState(formName: string): any {
        return this.formData[formName];
    }

    private_offers() {
        var ftids: any = DataHandler.adobeSDGgetGlobalVisitorsIds;
         var currentDate = new Date();
        var dt = currentDate.getUTCFullYear() + '-' + this.leftpad(currentDate.getUTCMonth() + 1, 2) + '-' + this.leftpad(currentDate.getUTCDate(), 2) + 'T' + this.leftpad(currentDate.getUTCHours(), 2) + ':' + this.leftpad(currentDate.getUTCMinutes(), 2) + ':' + this.leftpad(currentDate.getUTCSeconds (), 2);
        ftids = ftids + ":" + dt;
        if(DataHandler.ft_id != undefined && DataHandler.ft_id != null && DataHandler.ft_id !=''){
            ftids = DataHandler.ft_id
        }
       
        const httpOptions = {
            headers: new HttpHeaders({})
        }
        if (DataHandler.vehicle_type == 'new') {
            //this.url = "https://dev-jeep.eshopdemo.net/"
            return this.httpClient.post(this.url + '/api/privateoffer', {
                'brand': DataHandler.make,
                'firstName': this.encrypt(DataHandler.firstname),
                'lastName': this.encrypt(DataHandler.lastname),
                'emailAddress': this.encrypt(DataHandler.email),
                'zipCode': DataHandler.zipcode,
                "programID": "",
                current_FTID: ftids,
                current_session: DataHandler.currentSession_PrivateOffer,
                "txn_anchor":    this.encrypt(DataHandler.ip_address),
                "trace_code":    DataHandler.fj_visitor_id
            }, httpOptions);
        } else {
            //this.url = "https://dev-jeep.eshopdemo.net/"
            return this.httpClient.post(environment.UsedBackendApi_Url + '/api/cpov/privateoffer', {
            }, httpOptions);
        }

    }

    accessories_details(group_name: any, search: any) {
        const httpOptions = {
            headers: new HttpHeaders({})
        }
        return this.httpClient.post(this.url + '/api/accessories', {
            'dlr_code': DataHandler.dealer,
            'group_name': group_name,
            'vin': DataHandler.vin,
            'make': DataHandler.make,
            'model': DataHandler.model,
            "year": DataHandler.year,
            'home': 'N',
            'search': search
        }, httpOptions);
    }

    add_accessories(title: any, id: any, info: any, msrp: any, part_no: any,instalation_cost: any, actionType: any) {

    const httpOptions = {
      headers: new HttpHeaders({})
    }

    return this.httpClient.post(this.url + '/api/accessories/addAccessory', {
      accessSlted: {
        title: title,
        id: id,
        info: info,
        msrp: msrp,
        part_no: part_no,
        instalation_cost : instalation_cost,
        selected_id : DataHandler.selected_id
      },
      actionType: actionType,
      dealerCode: DataHandler.dealer,
      vin: DataHandler.vin,
      make: DataHandler.make,
      model: DataHandler.model,
      year: DataHandler.year,
      source: 'eshop',
      current_session: DataHandler.current_session,
      journey_id: DataHandler.journey_id
    }, httpOptions);
  }

    autofinew(data: any) {
        const httpOptions = {
            headers: new HttpHeaders({})
        }
        return this.httpClient.post(this.url + '/api/autoFi', {
            data
        }, httpOptions);
    }

    autofi(data: any) {
        const httpOptions = {
            headers: new HttpHeaders({})
        }
        return this.httpClient.post(this.url + '/api/autoFi/iw', {
            data
        }, httpOptions);
    }

    autoficallback(data: any) {
        const httpOptions = {
            headers: new HttpHeaders({})
        }
        return this.httpClient.post(this.url + '/api/autoFi-callBackCheck', {
            'loan_application_id': data
        }, httpOptions);
    }

    service_contract_lease(payload: any) {
        var currentDate = new Date();
        var dt = this.leftpad(currentDate.getUTCMonth() + 1, 2) + '/' + this.leftpad(currentDate.getUTCDate(), 2) + '/' + currentDate.getUTCFullYear();
        const httpOptions = {
            headers: new HttpHeaders({})
        }
        var zip = DataHandler.zipcode;
        if (zip == '' || 'null') {
            zip = DataHandler.dealerzip;
        }
        // this.url= 'https://stage.jeep.eshopdemoapp.com'
        return this.httpClient.post(this.url + '/api/service-contract', {
            'vin': DataHandler.vin,
            'termsInMonths': DataHandler.leasedafaultterm,
            'currentOdometer': '0', //its always zero 
            'milesperyear': '10000',//always 10,000
            'isLease': 'Y',
            'leaseOrLoanTerm': DataHandler.leasedafaultterm, //DataHandler.leasedafaultterm
            'isCommercial': 'N', // default
            'modelYear': DataHandler.year,
            'make': DataHandler.make,
            'model': DataHandler.model,
            'engineType': '', //blank
            'deductible': '100', // always 100 
            'dealerState': DataHandler.dealerstate,
            'source': 'ESHOP', // always eshop 
            'dealerCode': DataHandler.dealer,
            'customerLastName': 'test', // ask eshop team
            'paymentMode': 'LE',
            'customerAddressLine1': '',
            'customerAddressLine2': '',
            'customerCity': '',
            'customerState': 'TX',
            'customerZipCode': zip, //dealer zipcode 
            'optionSaleDate': dt, // always current date 
            'vehicleInServiceDate': dt, // always same as cureent date 
            'productLine': 'DLR', //default 
            'eppFlag': '' //blank alwyas    
        }, httpOptions);
    }

    service_contract_finance(payload: any) {
        var currentDate = new Date();
        var dt = this.leftpad(currentDate.getUTCMonth() + 1, 2) + '/' + this.leftpad(currentDate.getUTCDate(), 2) + '/' + currentDate.getUTCFullYear();
        const httpOptions = {
            headers: new HttpHeaders({})
        }
        var zip = DataHandler.zipcode;
        if (zip == '' || 'null') {
            zip = payload.customerZipCode;
        }
        //this.url= 'https://stage.jeep.eshopdemoapp.com'
        return this.httpClient.post(this.url + '/api/service-contract', {
            'vin': payload.vin,
            'termsInMonths': payload.termsInMonths, //
            'currentOdometer': '0',
            'milesperyear': '10000',
            'isLease': 'N',
            'leaseOrLoanTerm': payload.leaseOrLoanTerm,
            'isCommercial': 'N',
            'modelYear': payload.modelYear,
            'make': payload.make,
            'model': payload.model,
            'engineType': '',
            'deductible': '100',
            'dealerState': payload.dealerState,
            'source': 'ESHOP',
            'dealerCode': payload.dealerCode,
            'customerLastName': 'test',
            'paymentMode': 'FV',
            'customerAddressLine1': '',
            'customerAddressLine2': '',
            'customerCity': '',
            'customerState': 'TX',
            'customerZipCode': zip,
            'optionSaleDate': dt,
            'vehicleInServiceDate': dt,
            'productLine': 'DLR',
            'eppFlag': 'Y'
        }, httpOptions);
    }

    service_contract_cash(payload: any) {
        var currentDate = new Date();
        var dt = this.leftpad(currentDate.getUTCMonth() + 1, 2) + '/' + this.leftpad(currentDate.getUTCDate(), 2) + '/' + currentDate.getUTCFullYear();
        const httpOptions = {
            headers: new HttpHeaders({})
        }
        var zip = DataHandler.zipcode;
        if (zip == '' || 'null') {
            zip = DataHandler.dealerzip;
        }

        return this.httpClient.post(this.url + '/api/service-contract', {
            'vin': DataHandler.vin,
            'termsInMonths': '84', //default 
            'currentOdometer': '0',
            'milesperyear': '0',
            'isLease': 'N',
            'leaseOrLoanTerm': '', // default 
            'isCommercial': 'N',
            'modelYear': DataHandler.year,
            'make': DataHandler.make,
            'model': DataHandler.model,
            'engineType': '',
            'deductible': '100',
            'dealerState': DataHandler.dealerstate,
            'source': 'ESHOP',
            'dealerCode': DataHandler.dealer,
            'customerLastName': 'test',
            'paymentMode': 'CA',
            'customerAddressLine1': '',
            'customerAddressLine2': '',
            'customerCity': '',
            'customerState': 'TX',
            'customerZipCode': zip,
            'optionSaleDate': dt,
            'vehicleInServiceDate': dt,
            'productLine': 'DLR',
            'eppFlag': 'Y'
        }, httpOptions);
    }


    track_lead() {
        var ftids: any = DataHandler.adobeSDGgetGlobalVisitorsIds;
        var currentDate = new Date();
        var dt = currentDate.getUTCFullYear() + '-' + this.leftpad(currentDate.getUTCMonth() + 1, 2) + '-' + this.leftpad(currentDate.getUTCDate(), 2) + 'T' + this.leftpad(currentDate.getUTCHours(), 2) + ':' + this.leftpad(currentDate.getUTCMinutes(), 2) + ':' + this.leftpad(currentDate.getUTCSeconds (), 2);
        ftids = ftids + ":" + dt;
         if(DataHandler.ft_id != undefined && DataHandler.ft_id != null && DataHandler.ft_id !=''){
            ftids = DataHandler.ft_id
        }
    
        const httpOptions = {
            headers: new HttpHeaders({})
        }
        return this.httpClient.post(this.url + '/api/leads_track', {
            vin: DataHandler.vin,
            session_id: DataHandler.current_session,
            dealer_code: DataHandler.dealer,
            dealer_zip: DataHandler.dealerzip,
            first_name: this.encrypt(DataHandler.firstname),
            last_name: this.encrypt(DataHandler.lastname),
            email: this.encrypt(DataHandler.email),
            phone: this.encrypt(DataHandler.phone),
            zip_code: DataHandler.zipcode,
            lead_form: 'inwidget',
            sd_sessionId: DataHandler.sdSessionId,
            make: DataHandler.make,
            model: DataHandler.model,
            year: DataHandler.year,
            current_FTID: ftids,
            txn_anchor:    this.encrypt(DataHandler.ip_address),
            trace_code:    DataHandler.fj_visitor_id
        }, httpOptions);
    }


    VinStatusCheck(dealer: string, vin: string, vehicle_type: string) {
        // if(vehicle_type == 'new'){
        if (DataHandler.make_url.toLowerCase() == 'alfa') {
            this.url = environment.BackendApi_Url_Alfa;
        } else {
            this.url = environment.BackendApi_Url
        }
        // return this.httpClient.get(this.url + "/api/vin_status/" + dealer + "/" + vin)
        return this.httpClient.get(this.url + "/api/vin_status/" + dealer + "/" + vin).pipe(
            switchMap((vinStatusResponse: any) => {
                const payload = {
                    dealer_code: dealer,
                    vin: vin,
                    vehicle_type: vehicle_type
                };

                if(environment.production){
                    // var check_dlr_url = 'https://ihub.eshopdemo.net/api/check_dlr_vin_status'
                    var check_dlr_url = 'https://www.apicarzato.com/api/check_dlr_vin_status'
                }else{
                    check_dlr_url = 'https://uat-ihub.eshopdemo.net/api/check_dlr_vin_status'
                }
                

                return this.httpClient.post(check_dlr_url, payload).pipe(
                    map((checkDlrVinStatusResponse: any) => {
                        return {
                            vinStatus: vinStatusResponse,
                            checkDlrVinStatus: checkDlrVinStatusResponse
                        };
                    })
                );
            })
        );
        //  } else{   
        //     this.url =environment.UsedBackendApi_Url;   
        //   return this.httpClient.get( this.url + "/api/cpov/vin_status/"+dealer+"/"+vin)
        // } 

    }




    //Used vehicles api


    get_used_photogallary_images(vin: string, dealercode: string) {

        return this.httpClient.post(environment.UsedBackendApi_Url + '/api/cpov/photos_gallary', {
            vin: DataHandler.vin,
            dealercode: DataHandler.dealer,

            vehicle_type: 'used'
        });
    }



    get_Used_DealerInfo(vin: string, dealercode: string) {

        return this.httpClient.post(environment.UsedBackendApi_Url + '/api/cpov/getDealerInfoDetails', {

            vin: DataHandler.vin,
            dealercode: DataHandler.dealer

        });

    }


    get_Used_Vehicle_Details_Spec(vin: string) {
        const httpOptions = {
            headers: new HttpHeaders({})
        }

        const body = {};
        return this.httpClient.post(environment.UsedBackendApi_Url + '/api/vdp_details_spec?vin=' + vin, body, httpOptions);
    }

    //  get_Used_List_accessories(vin: string) {

    //   this.url = 'https://qa-jeep.eshopdemo.net';
    //   const httpOptions = {
    //     headers: new HttpHeaders({})
    //   }
    //  const body = {};
    //   return this.httpClient.post(this.url + '/api/cpov/list_accessories?vin=' + vin, body, httpOptions);
    // }


    // get_Used_Service_Protections(vin: string) {

    //   this.url = 'https://qa-jeep.eshopdemo.net';
    //   const httpOptions = {
    //     headers: new HttpHeaders({})
    //   }
    //  const body = {};
    //   return this.httpClient.post(this.url + '/api/cpov/list_service_protection?vin=' + vin, body, httpOptions);
    // }




    get_Used_finance_details(payload: UsedFinanceDatails) {

        var data: any;

        data = DataHandler.servicefinanceIds;

        return this.httpClient.post(environment.UsedBackendApi_Url +'/api/cpov/estpayment', {
            vin: payload.vin,
            dealercode: payload.dealercode,
            zipcode: payload.zipcode,
            transactionType: 'finance',
            tradein: payload.tradein,
            msrp: DataHandler.base_msrp,
            additional_discount: payload.additional_discount,
            term: payload.term,
            down: payload.down?.toString(),
            internetprice: payload.internetprice,
            selectedIds: payload.selectedIds,
            is_widget: 'Y',
            dealer_discount_available: DataHandler.dealerdiscount,
            user_service_a_protection: data,
            customer_state: payload.customer_state,
            customer_county_city: payload.customer_county_city,
            is_customer_zipcode: payload.is_customer_zipcode,
            apr_rate: 0,
            initial_load: 1,
            apr_rate_type: payload.apr_rate_type,
            thirdpartyapr: payload.thirdpartyapr


        }, { responseType: 'text' });
    }



    get_Used_cash_details(payload: UsedCashDatails) {


        var data: any;
        data = DataHandler.servicecashIds;
        return this.httpClient.post(environment.UsedBackendApi_Url + '/api/cpov/estpayment', {
            vin: payload.vin,
            dealercode: payload.dealercode,
            zipcode: payload.zipcode,
            transactionType: 'cash',
            tradein: payload.tradein,
            additional_discount: payload.additional_discount,

            internetprice: payload.internetprice,
            selectedIds: payload.selectedIds,
            is_widget: 'Y',
            dealer_discount_available: DataHandler.dealerdiscount,

            customer_state: payload.customer_state,
            customer_county_city: payload.customer_county_city,
            is_customer_zipcode: payload.is_customer_zipcode,

            initial_load: 1,



        }, { responseType: 'text' });
    }

    setVisiblePopUp(value: boolean): void {
        this._visiblePopUp.next(value);
    }

    setClickAccessories(value: boolean): void {
        this._accessoriesClicked.next(value);
    }

    setInitialFormFilled(value: boolean): void {
        this._initialFormFilled.next(value);
    }

    chk_submit_leads(){
        // const httpOptions = {
        //     headers: new HttpHeaders({})
        // }
    
        // return this.httpClient.post(environment.BackendApi_Url + '/api/chk_submit_leads', {
        // })
       
       var api = environment.BackendApi_Url + '/api/chk_submit_leads'

        const payload = {    vin: DataHandler.vin,
            dealer_code: DataHandler.dealer,
            sis_dealercode: DataHandler.dealer,
            dealerZip: DataHandler.zipcode,
            comments: DataHandler.hint_comments,
            vehicle_type: DataHandler.vehicle_type,
            dealer_weburl: window.location.hostname
        }
        const response =  fetch(api, {
            method: 'POST',
            keepalive: true,
            body: JSON.stringify(payload),
            headers: {
              'Content-Type': 'application/json',
            },
          });
        
          return response; // if expecting JSON

          
    }

}