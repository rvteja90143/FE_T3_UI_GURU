import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DataHandler } from '../common/data-handler';
import platform from 'platform';


@Injectable({
  providedIn: 'root',
})
export class GA4DealerService {
  url: any = '';
  allCtaDealerConfig: any;
  returnCtaData: any;
  pagepath:any;
  aMetaData :any
  visitorData:any
  

 
  constructor(private httpClient: HttpClient) { 
    this.url =environment.BackendApi_Url  
    this.init()
    console.log("key",localStorage.getItem('aVisitorId'))
  }

  fire_asc_events(event_name: any)
  {
    var eventname : any;
    var asc_template: any;
    var template: any = {
       // event:'asc_cta_interaction',
        event_owner:'eshop',
        page_type:'widget',
        //element_text:'payment options',
        element_color:'',
        element_order:'',
        event_action:'',
        link_url:'',
        item_id:'',
        item_number:'',
        item_price:'',
        item_condition:'New',
        item_year:'',
        item_make:'',
        item_model:'',
        item_variant:'',
        item_color:'',
        item_type:'',
        item_category:'',
        item_fuel_type:'',
        item_inventory_date:''
    };
    asc_template = template;
 
       asc_template.item_year = DataHandler.year;
       asc_template.item_make = DataHandler.make;
       asc_template.item_model = DataHandler.model;
       asc_template.item_id = DataHandler.vin;
     
        switch (event_name) {
        case "WidgetStartone":
            eventname = "asc_retail_process";
            asc_template.element_text="Payment option";
            asc_template.flow_name ="start";
            break;
        case "WidgetStart":
            eventname = "asc_cta_interaction";
            asc_template.element_text = "payment options",
            asc_template.element_type="popup";
            asc_template.event_action_result="open";
            break;
        case "InitialLeadFormStart":
            eventname = "asc_form_engagement";
            asc_template.comm_type= "Form";
            asc_template.comm_status= "start";
            asc_template.form_name= "inventory_lead";
            asc_template.element_text="Payment option";
            asc_template.form_type="consumer_contact";
           
            break;

        case "InitialLeadFormEnd":
          eventname = "asc_form_submission";
            asc_template.comm_type= "Form";
            asc_template.comm_status= "submit";
            //asc_template.form_name= "inventory_lead";  
            asc_template.form_name= "initial_lead_form";
            asc_template.form_type="consumer_contact";
            asc_template.element_text="Payment option";
            break;

        case "widget-close":
          eventname = "asc_cta_interaction";
          asc_template.element_text = "payment options",
            asc_template.element_type="Form",
            asc_template.event_action_result="close";
            break;
        case "TradeInBB":
          eventname = "asc_menu_interaction";
          asc_template.element_text="Trade In";
          asc_template.element_subtype = "nav_tab";
          asc_template.element_type = "";
          asc_template.event_action = "click";
          break; 
          
        case "TradeInKBB":
          eventname = "asc_menu_interaction";
        asc_template.element_text="Trade In Kbb";
        asc_template.element_subtype = "nav_tab";
        asc_template.element_type = "";
        asc_template.event_action = "click";
        break;
        
        case "ApplyForCreditR1":

        eventname  = "asc_form_engagement";
        asc_template.comm_type = "form";
        asc_template.comm_status = "start";
        asc_template.element_text = "ApplyForCreditR1";
        asc_template.department = "";
        asc_template.form_name = "inventory_lead";
        break;

        case "ApplyForCreditDT":
          eventname  = "asc_form_engagement";
          asc_template.comm_type = "form";
          asc_template.comm_status = "start";
          asc_template.element_text = "ApplyForCreditR1";
          asc_template.department = "";
          asc_template.form_name = "inventory_lead";
        break;
        case "ApplyForCreditAF":
          eventname  = "asc_form_engagement";
          asc_template.comm_type = "form";
          asc_template.comm_status = "start";
          asc_template.element_text = "ApplyForCreditR1";
          asc_template.department = "";
          asc_template.form_name = "inventory_lead";
        break;
        case "VehicleInformation":
          eventname = "asc_cta_interaction";
          asc_template.element_text = "payment options",
          asc_template.element_type="item_details",
          asc_template.event_action_result="open";
        break;
        // case "DeliveryReview":
        //   eventname = "asc_menu_interaction";
        //   asc_template.element_text = "DeliveryReview";
        //   asc_template.element_subtype = "nav_tab";
        //   asc_template.element_type	= "";
        //   asc_template.event_action = "click";
        // break;
        case "TestDriveFormclick":
          eventname = "asc_cta_interaction";
          //  asc_template.comm_type= "Form";
            asc_template.comm_status= "test drive";
            asc_template.form_name= "inventory_lead";
            asc_template.form_type="consumer_contact";
            asc_template.event_action_result="Form";
            asc_template.element_text = "test drive";

       break;
       case "TestDriveFormInvalid":
          eventname = "asc_cta_interaction";
          //  asc_template.comm_type= "Form";
            asc_template.comm_status= "test drive";
            asc_template.form_name= "inventory_lead";
            asc_template.event_action_result="Form";

       break;
        case "TestDriveFormStart":
          eventname = "asc_form_engagement";
           asc_template.comm_type= "Form";
            asc_template.comm_status= "start";
            asc_template.form_name= "inventory_lead";
            asc_template.form_type="consumer_contact";

       break;
        case "TestDriveFormEnd":
          eventname = "asc_form_submission";
            asc_template.comm_type= "Form";
            asc_template.comm_status= "submit";
            //asc_template.form_name= "inventory_lead";
            asc_template.form_name= "test_drive_form";
            asc_template.form_type="consumer_contact";
        break;
        case "GetBetterEstimateFormEnd":
          eventname = "asc_form_submission";
          asc_template.comm_type= "Form";
          asc_template.comm_status= "submit";
          asc_template.form_name= "inventory_lead";
          asc_template.form_type="consumer_contact";
        break;
        case "GetBetterEstimateFormStart":
          eventname = "asc_form_engagement";
            
          asc_template.comm_type= "Form";
          asc_template.comm_status= "start";
          asc_template.form_name= "inventory_lead";
          asc_template.form_type="consumer_contact";
        break;
        case "ScheduleDelivery":
          eventname = "asc_form_submission";
          asc_template.comm_type= "Form";
          asc_template.comm_status= "submit";
        
         
        break;
        case "PhotoGallery":
          eventname = "asc_cta_interaction";
          asc_template.element_text = "Photo Gallery",
          asc_template.element_type="popup",
          asc_template.event_action_result="open";
        break;
        case "ReserveNow":
          eventname = "asc_form_engagement";
        asc_template.comm_type= "Form";
        asc_template.comm_status= "start";
        asc_template.form_name= "inventory_lead";
        asc_template.form_type="consumer_contact";
        break;
        case "ScheduleTestDrive":
        break;
        case "LeasePayment":
          eventname = "asc_cta_interaction";
          asc_template.element_text = "Lease Payment",
          asc_template.element_type="header",
          asc_template.event_action_result="open";
        break;
        case "FinancePayment":
          eventname = "asc_cta_interaction";
          asc_template.element_text = "Finance Payment",
          asc_template.element_type="header",
          asc_template.event_action_result="open";
        break;
        case "CashPayment":
          eventname = "asc_cta_interaction";
          asc_template.element_text = "Cash Payment",
          asc_template.element_type="header",
          asc_template.event_action_result="open";
        break;
        case "ApplyForCreditFormStartDT":
          eventname = "asc_form_engagement";
          asc_template.comm_type= "Form";
           asc_template.comm_status= "start";
           asc_template.form_name= "inventory_lead";
           asc_template.form_type="consumer_contact";

        break;
        case "ApplyForCreditFormStartR1":
          eventname = "asc_form_engagement";
          asc_template.comm_type= "Form";
           asc_template.comm_status= "start";
           asc_template.form_name= "inventory_lead";
           asc_template.form_type="consumer_contact";

        break;
        case "ApplyForCreditFormStartAF":
          eventname = "asc_form_engagement";
          asc_template.comm_type= "Form";
           asc_template.comm_status= "start";
           asc_template.form_name= "inventory_lead";
           asc_template.form_type="consumer_contact";

        break;
        case "SubmitToDealerFormStart":
          eventname = "asc_form_engagement";
          asc_template.comm_type= "Form";
           asc_template.comm_status= "start";
           asc_template.form_name= "inventory_lead";
           asc_template.form_type="consumer_contact";

        break;
       
        case "SubmitToDealerFormEnd":
          eventname = "asc_form_submission";
          asc_template.comm_type= "Form";
          asc_template.comm_status= "submit";
          //asc_template.form_name= "inventory_lead"; 
          asc_template.form_name= "inventory_lead_form";
          asc_template.form_type="consumer_contact";
        break;
        case "Idlelead":
        break;
        case "ApplyForCreditFormEndDT":
          eventname = "asc_form_submission";
          asc_template.comm_type= "Form";
          asc_template.comm_status= "submit";
          //asc_template.form_name= "inventory_lead";
          asc_template.form_name= "apply_credit_form";
          asc_template.form_type="consumer_contact";
        break;
        case "ApplyForCreditFormEndR1":
          eventname = "asc_form_submission";
          asc_template.comm_type= "Form";
          asc_template.comm_status= "submit";
          //asc_template.form_name= "inventory_lead";
          asc_template.form_name= "apply_credit_form";
          asc_template.form_type="consumer_contact";
        break;
        case "ApplyForCreditFormEndAF":
          eventname = "asc_form_submission";
          asc_template.comm_type= "Form";
          asc_template.comm_status= "submit";
          //asc_template.form_name= "inventory_lead";
          asc_template.form_name= "apply_credit_form";
          asc_template.form_type="consumer_contact";
        break;

        case "ServiceProtection":
          eventname = "asc_menu_interaction";
          asc_template.element_text = "ServiceProtection";
          asc_template.element_subtype = "nav_tab";
          asc_template.element_type	= "";
          asc_template.event_action = "click";
        break;
        case "ServiceProtection-lease":
          eventname = "asc_menu_interaction";
          asc_template.element_text = "service-protection-lease";
          asc_template.element_subtype = "nav_tab";
          asc_template.element_type	= "";
          asc_template.event_action = "click";
        break;
        case "ServiceProtection-finance":
          eventname = "asc_menu_interaction";
          asc_template.element_text = "service-protection-finance";
          asc_template.element_subtype = "nav_tab";
          asc_template.element_type	= "";
          asc_template.event_action = "click";
        break;
        case "ServiceProtection-cash":
          eventname = "asc_menu_interaction";
          asc_template.element_text = "service-protection-cash";
          asc_template.element_subtype = "nav_tab";
          asc_template.element_type	= "";
          asc_template.event_action = "click";
        break;

        case "Accessories":
          eventname = "asc_menu_interaction";
          asc_template.element_text = "Accessories";
          asc_template.element_subtype = "nav_tab";
          asc_template.element_type	= "";
          asc_template.event_action = "click";
        break;
        case "Accessories-select":
          eventname = "asc_menu_interaction";
          asc_template.element_text = "accessories-select";
          asc_template.element_subtype = "nav_tab";
          asc_template.element_type	= "";
          asc_template.event_action = "click";
        break;
        case "Accessories-search":
          eventname = "asc_menu_interaction";
          asc_template.element_text = "Get Price";
          asc_template.element_subtype = "";
          asc_template.element_type	= "search bar";
          asc_template.event_action_result="search";
        break;
        case "add-vehicle-accessories":
          eventname = "";
          asc_template.element_text = "";
          asc_template.element_subtype = "";
          asc_template.element_type	= "";
          asc_template.event_action_result="check";
        break;
        case "remove-vehicle-accessories":
          eventname = "";
          asc_template.element_text = "";
          asc_template.element_subtype = "";
          asc_template.element_type	= "";
          asc_template.event_action_result="uncheck";
        break;

        case "VehicleInformationView":
          eventname = "asc_menu_interaction";
          asc_template.element_text = "VehicleInformationView";
          asc_template.element_subtype = "nav_tab";
          asc_template.element_type	= "";
          asc_template.event_action = "click";
        break;

        case "TradeInPageView":
          eventname = "asc_menu_interaction";
          asc_template.element_text = "TradeInPageView";
          asc_template.element_subtype = "nav_tab";
          asc_template.element_type	= "";
          asc_template.event_action = "click";
        break;
     case "CreditEstimatorEnd":
          eventname = "asc_form_submission";
          asc_template.comm_type= "Form";
          asc_template.comm_status= "submit";
          //asc_template.form_name= "inventory_lead";
          asc_template.form_name= "credit_estimator_form";
          asc_template.form_type="consumer_contact";
        break;
      
          
        case "ServiceProtectionView":
          eventname = "asc_menu_interaction";
          asc_template.element_text = "ServiceProtectionView";
          asc_template.element_subtype = "nav_tab";
          asc_template.element_type	= "";
          asc_template.event_action = "click";
        break;
        
        case "AccessoriesView":
          eventname = "asc_menu_interaction";
          asc_template.element_text = "AccessoriesView";
          asc_template.element_subtype = "nav_tab";
          asc_template.element_type	= "";
          asc_template.event_action = "click";
        break;
          
        case "ReviewSubmitView":
          eventname = "asc_menu_interaction";
          asc_template.element_text = "ReviewSubmitView";
          asc_template.element_subtype = "nav_tab";
          asc_template.element_type	= "";
          asc_template.event_action = "click";
        break;
        case "DeliverySubmitView":
          eventname = "asc_menu_interaction";
          asc_template.element_text = "delivery-review-submit";
          asc_template.element_subtype = "nav_tab";
          asc_template.element_type	= "";
          asc_template.event_action = "click";
        break;
         case "ReserveNowEnd":
          eventname = "asc_form_submission";
          asc_template.comm_type= "Form";
          asc_template.comm_status= "submit";
          //asc_template.form_name= "inventory_lead";
          asc_template.form_name= "reserve_vehicle_form";
          asc_template.form_type="consumer_contact";
        break;
        
        default : 
        
    
      

    }
 
 return this.httpClient.post(this.url + '/api/google_analytics_four_tracking_data', { 
    'dealer_code' : DataHandler.dealer,
    'data' : {
       'name':eventname,
          'params' : {asc_template}
        
    }
    
    });
  }

  submit_to_api_ga4dealer(eventname: any) {
    let variableWithSpace = DataHandler.trim;
    let variableWithoutSpace = variableWithSpace?.replace(/\s/g, '');
    var GASource;
   

    if(DataHandler.extraParameter == 'eprice'){
    GASource = 'E-price';
    } else{
     GASource = DataHandler.GASource;
    }
    if(eventname == 'VehicleInformationView'){ 
        this.pagepath= 'Vehicle Information';
    }else if(eventname == 'TradeInPageView'){
        this.pagepath= 'Trade In';
    }else if(eventname == 'DeliverySubmitView'){
        this.pagepath= 'Delivery Submit';
    }else if(eventname == 'ServiceProtectionView'){
        this.pagepath= 'Service and Protection';
    }else if(eventname == 'AccessoriesView'){
        this.pagepath= 'Accessories';
    }else if(eventname == 'ReviewSubmitView'){
        this.pagepath= 'Review Submit';
    }

    this.fire_asc_events(eventname);
    
    if(eventname == 'WidgetStart'|| eventname == 'ReserveNowEnd' || eventname == 'CreditEstimatorEnd' || eventname == 'InitialLeadFormStart'|| eventname == 'Details' || eventname == 'TradeInBB' || eventname == 'TradeInKBB' || eventname == 'ApplyForCreditR1' || eventname == 'ApplyForCreditDT' || eventname == 'ApplyForCreditAF' || eventname == 'InitialLeadFormEnd' || eventname == 'VehicleInformation' || eventname == 'DeliveryReview' || eventname == 'TestDriveFormStart' || eventname == 'TestDriveFormEnd' || eventname == 'GetBetterEstimateFormEnd' || eventname == 'GetBetterEstimateFormStart' || eventname == 'ScheduleDelivery' || eventname == 'PhotoGallery' || eventname == 'ReserveNow'  || eventname == 'ScheduleTestDrive'|| eventname == 'LeasePayment'|| eventname == 'FinancePayment'|| eventname == 'CashPayment'
    || eventname == 'ApplyForCreditFormStartDT'|| eventname == 'ApplyForCreditFormStartR1'|| eventname == 'ApplyForCreditFormStartAF'|| eventname == 'SubmitToDealerFormStart' || eventname == 'Reviewsubmit'|| eventname == 'SubmitToDealerFormEnd' || eventname == 'Idlelead' || eventname == 'ApplyForCreditFormEndDT'|| eventname == 'ApplyForCreditFormEndR1'|| eventname == 'ApplyForCreditFormEndAF' || eventname == 'ServiceProtection' || eventname == 'Accessories'  || eventname =='widget-close'){
        console.log('in page view',eventname);
      return this.httpClient.post(this.url + '/api/google_analytics_four_tracking_data', { 
        'dealer_code' : DataHandler.dealer,
        'data' : {
           'name':eventname,
              'params' : 
              {
              'Type' : 'New',
              'event_owner':'eshop',
              'Make' : DataHandler.make,
              'Model' : DataHandler.model,
              'Year' :DataHandler.year,
              'VIN' : DataHandler.vin,
              'Trim' : variableWithoutSpace,
              "Source":GASource ,
              "Medium": "InWidget",
              "page_title": eventname,
              "page_path": '/DealerID='+DataHandler.dealer+'&Type=New&Make='+DataHandler.make+'&Model='+DataHandler.model+'&Year='+DataHandler.year+'&VIN='+DataHandler.vin+'&Trim='+variableWithoutSpace+'&Source='+GASource+'&Medium=InWidget',
              }
        },
        metadata:this.aMetaData
        //visitorData:this.visitorData
        });
  }else if(eventname == 'VehicleInformationView'|| eventname == 'TradeInPageView'|| eventname == 'DeliverySubmitView'|| eventname == 'ServiceProtectionView'|| eventname == 'AccessoriesView' || eventname == 'ReviewSubmitView'){
   
    return this.httpClient.post(this.url + '/api/google_analytics_four_tracking_data', { 

        
        'dealer_code' : DataHandler.dealer,
        'data' : {
           'name':eventname,
              'params' : 
              {
              'Type' : 'New',
              'Make' : DataHandler.make,
              'Model' : DataHandler.model,
              'Year' :DataHandler.year,
              'VIN' : DataHandler.vin,
              'Trim' : variableWithoutSpace,
              "Source":GASource ,
              "Medium": "InWidget",
              "page_title": this.pagepath,
              "page_path": '/DealerID='+DataHandler.dealer+'&Type=New&Make='+DataHandler.make+'&Model='+DataHandler.model+'&Year='+DataHandler.year+'&VIN='+DataHandler.vin+'&Trim='+variableWithoutSpace+'&Source='+GASource+'&Medium=InWidget',
              }
        },
        metadata:this.aMetaData
        //visitorData:this.visitorData
      
        });
  }else {
      return this.httpClient.post(this.url + '/api/google_analytics_four_tracking_data', {});
    }

  }

  //Get Browser Info as a separate function
  getBrowserInfo(ua:any) {
    let tem, match = ua.match(/(opera|chrome|safari|firefox|edge|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(match[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: tem[1] || '' };
    }
    if (match[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edg)\/(\d+)/);
        if (tem != null) return {
            name: tem[1].replace('OPR', 'Opera').replace('Edg', 'Edge'),
            version: tem[2]
        };
    }
    match = match[2] ? [match[1], match[2]] : [navigator.appName, navigator.appVersion, '-?'];
    return { name: match[0], version: match[1] };
  }

  getDeviceInfo() {
    return {
        browser: platform.name ? platform.name : 'Unknown browser',
        os: platform.os ? platform.os.family : 'Unknown OS',
        device: platform.product || 'Unknown Device'
    };
  }

  analyticsGenerateUUID(bn:any,os:any) {
    var auid_set = this.aGetWithExpiry('aVisitorId')
    //console.log('getwithExpiry-UUID:: ' + auid_set);
    if (auid_set && auid_set != null){
        return auid_set;
    }
    else{
        var estDate = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
        var d = estDate.getTime();
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;

        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16;
            if (d > 0) {
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        //console.log('Generated-UUID:: ' + uuid);
       var auid = uuid + ":" + bn + ":" + os;
        this.aSetWithExpiry("aVisitorId", auid, 3600000);
        //setWithExpiry("aVisitorId", auid, 30000);
        return auid;
    }
  }

  aSetWithExpiry(key:any, value:any, ttl:any) {
    const now = new Date()

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item))
}

  aGetWithExpiry(key:any) {
    const itemStr = localStorage.getItem(key)

    // if the item doesn't exist, return null
    if (!itemStr) {
        return null
    }

    const item = JSON.parse(itemStr)
    const now = new Date()

    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
        // If the item is expired, delete the item from storage
        // and return null
        localStorage.removeItem(key)
        return null
    }
    return item.value
  }

  aGetDeviceCategory(){
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const screenResolution = `${screenWidth}x${screenHeight}`;

    // Classify screen type
    let deviceCategory = "Unknown";

    if (screenWidth <= 767) {
        deviceCategory = "Mobile";
    } else if (screenWidth <= 1024) {
        deviceCategory = "Tablet";
    } else if (screenWidth <= 1440) {
        deviceCategory = "Laptop";
    } else {
        deviceCategory = "Desktop";
    }

    //console.log("Screen Resolution:", screenResolution);
    //console.log("Device Category:", deviceCategory);
    return deviceCategory;
  }

  init(){
        var useragent = navigator.userAgent;
        const uaData = (navigator as any).userAgentData;
        const platform = uaData && uaData.platform ? uaData.platform : navigator.platform;

        var browserInfo = this.getBrowserInfo(useragent);

        // Capture browser & OS info using platform.js
        var deviceInfo = this.getDeviceInfo();
        var browser_name = deviceInfo.browser;
        var os_name = deviceInfo.os;

        // Screen resolution
        var screenResolution = `${window.screen.width}x${window.screen.height}`;

        //Application from domain
        var hostname = window.location.href;
        //var pathname = window.location.pathname;

        //Campaigns from URL
        var urlParams = new URLSearchParams(window.location.search);
        var campaigns: { [key: string]: string | null } = {};
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
            if (urlParams.has(param)) {
                campaigns[param] = urlParams.get(param);
            }
        });
        var deviceCategory = this.aGetDeviceCategory();

        var visitorId = this.analyticsGenerateUUID(browser_name,os_name);

        // Final data object
        this.visitorData = {
            browser: browserInfo,
            platform: platform,
            screen: screenResolution,
            application: hostname,
            campaigns: campaigns,
            deviceinfo: deviceInfo,
            device:deviceCategory,
            visitor_id: visitorId
        };

       this.aMetaData = {
            application: hostname,
            browser: deviceInfo.browser,
            campaigns: campaigns,
            deviceOs: deviceInfo.os,
            deviceType: deviceCategory,
            screen: screenResolution,
            visitor_id: visitorId
        }

        console.log("Visitor Data:", this.visitorData);
        console.log("aMeta Data:", this.aMetaData);

  }

 
}