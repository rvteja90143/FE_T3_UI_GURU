import { DataHandler } from '../common/data-handler';
import { environment } from '../../environments/environment';
//import "node_modules/@types/gtag.js/index.d.ts";
//import "node_modules/gtag.js";


declare global {
    interface Window { asc_datalayer: any; dataLayer:any;}
}

window.asc_datalayer = window.asc_datalayer || {};
window.dataLayer = window.dataLayer ||{};
export class AscHandler
{
   // this.output = <JSON>this.obj;   
   // this.asc_template = <JSON>this.template;

    public static  Ascexecutor(section: any) {
        
        /*var  dealerCode;
        var pageText: any = '';
        var aschandler: AscHandler = new AscHandler;
        var make = DataHandler.make;
        var model = DataHandler.model;
        var year = DataHandler.year;
        var trim = DataHandler.trim;
        var vin = DataHandler.vin;
        var dealerCode = DataHandler.dealer;*/

          
    var asc_template: any;
    var template: any = {
        event:'asc_cta_interaction',
        event_owner:'eshop',
        page_type:'widget',
        element_text:'payment options',
        element_color:'',
        element_order:'',
       // element_type:'popup',
        event_action:'',
        //event_action_result:'open',
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

       
    var submitted:boolean = false;
    switch (section) {
        case "widget-load":
            asc_template.event= "asc_cta_interaction";
            asc_template.element_type="popup",
            asc_template.event_action_result="open";
            break;

        case "lead-form-start":
            asc_template.event= "asc_form_engagement";
            
            asc_template.comm_type= "Form";
            asc_template.comm_status= "start";
            asc_template.form_name= "inventory_lead";
            asc_template.form_type="consumer_contact";
            break;

        case "lead-form-submit":
            asc_template.event= "asc_form_submission";
            asc_template.comm_type= "Form";
            asc_template.comm_status= "submit";
            asc_template.form_name= "inventory_lead";
            asc_template.form_type="consumer_contact";
            break;

        case "widget-close":
            asc_template.event= "asc_cta_interaction";
            asc_template.element_type="Form",
            asc_template.event_action_result="close";
            break;
        case "TradeInBB":
            asc_template.event= "asc_cta_interaction";
            asc_template.element_type="Form",
            asc_template.event_action_result="close";
            break;
    }
    if(window.asc_datalayer.events !== undefined){
        window.asc_datalayer.events.push(JSON.parse(JSON.stringify(<JSON>asc_template)));
        //console.log("asc data layer push::");
    }
       if(!submitted && window.dataLayer !== undefined){
        try{
            switch (section) {
                case "widget-load":
                    window.dataLayer.push("event", "asc_cta_interaction",JSON.parse(JSON.stringify(<JSON>asc_template)));
                    /*asc_template.event= "asc_cta_interaction";
                    window.asc_datalayer.events.push(asc_template);*/
                    submitted = true;
                    break;
        
                case "lead-form-start":
                    window.dataLayer.push("event", "asc_form_engagement",JSON.parse(JSON.stringify(<JSON>asc_template)));
                    /*asc_template.event= "asc_form_engagement";
                    asc_template.comm_type= "Form";
                    asc_template.comm_status= "start";
                    asc_template.form_name= "inventory_lead";
                    asc_template.form_type="consumer_contact";
                    window.asc_datalayer.events.push(asc_template);*/
                    submitted = true;
                    break;
        
                case "lead-form-submit":
                    window.dataLayer.push("event", "asc_form_submission",JSON.parse(JSON.stringify(<JSON>asc_template)));
                    /*asc_template.event= "asc_form_submission";
                    asc_template.comm_type= "Form";
                    asc_template.comm_status= "submit";
                    asc_template.form_name= "inventory_lead";
                    asc_template.form_type="consumer_contact";
                    window.asc_datalayer.events.push(asc_template);*/
                    submitted = true;
                    break;
        
                case "widget-close":
                    window.dataLayer.push("event", "asc_cta_interaction",JSON.parse(JSON.stringify(<JSON>asc_template)));
                    /*asc_template.event= "asc_cta_interaction";
                    asc_template.event_action_result="close";
                    window.asc_datalayer.events.push(asc_template);*/
                    submitted = true;
                    break;
            }
        }
        catch(e:any){
            var result:any = e.message; // error under useUnknownInCatchVariables 
            if (typeof e === "string") {
                console.log("Error:"+ e.toUpperCase()); // works, `e` narrowed to string
            } else if (e instanceof Error) {
                console.log("Error:"+ e.message); // works, `e` narrowed to Error
            }
        }
       }
}
    
}



//export class AscHandler {

    // const Gtag:  Gtag.Gtag = function () {
    //     window.dataLayer.push(arguments);
    // };

    // window.dataLayer = window.dataLayer || [];
    // window.dataLayer.push({
    //   event: 'button_click',
    //   event_category: 'Button Click',
    //   event_label: analyticsId,
    //   event_value: analyticsValue,
    // });
//}