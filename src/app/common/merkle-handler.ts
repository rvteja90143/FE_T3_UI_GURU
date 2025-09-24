import { DataHandler } from '../common/data-handler';
import { environment } from '../../environments/environment';

export class MerkleHandler {

    public static generateUUID() { // Public Domain/MIT
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


    public static generateFTID() {
        var date = new Date();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var year = date.getFullYear();

        var date_hour = date.getHours();
        var date_minute = date.getMinutes();
        var date_second = date.getSeconds();
        var fulldate = year + "-" + (('' + month).length < 2 ? '0' : '') + month + "-" + (('' + day).length < 2 ? '0' : '') + day + "T" + (('' + date_hour).length < 2 ? '0' : '') + date_hour + ":" + (('' + date_minute).length < 2 ? '0' : '') + date_minute + ":" + (('' + date_second).length < 2 ? '0' : '') + date_second;

        var gen_FTID = DataHandler.getGlobalVisitorsIds;
        return gen_FTID + ":" + fulldate;
    }

    public static async encryptemail(email:any){
        var emailsubmit = email.toLowerCase();
        var finalEmail = emailsubmit.trim();
        var msgUint8 = new TextEncoder().encode(finalEmail);
        var hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        var hashArray = Array.from(new Uint8Array(hashBuffer));
        var hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    public static  merkleexecutor(section: any, position: any = '', sectiontab: string = '') {
        
        var dealerName, linkText, navClickPosition, dealerCode, virtpageType = '';
        var pageText: any = '';
        var stat = 1;
        var navClick = 0;
        var virtual_page = 0;
        var ctaClick = 0;

        if (position == 0) {
            navClickPosition = "topNav";
        } else if (position == 1) {
            navClickPosition = "bottomNav";
        }

        var make = DataHandler.make;
        if(DataHandler.model?.toLowerCase() == 'grand cherokee' && DataHandler.year == '2023' ){
            DataHandler.model = DataHandler.model.split(" ").join("-").concat("-wl");
        }
        if(DataHandler.model?.toLowerCase() == 'wrangler 4xe'||DataHandler.model?.toLowerCase() == 'Wrangler 4xe' && DataHandler.year == '2023' ){
            DataHandler.model = DataHandler.model.split(" ").join("-");
        }
        if(DataHandler.model?.toLowerCase() == 'ram promaster®'||DataHandler.model?.toLowerCase() == 'Ram promaster®' && DataHandler.year == '2023' ){
            DataHandler.model = 'ram promaster'.split(" ").join("-");
        }
        var model = DataHandler.model;
        var year = DataHandler.year;
        var trim = DataHandler.trim;
        var vin = DataHandler.vin;
        var dealerCode = DataHandler.dealer;

        var dealerName: any = null;
        var provider: any = null;
        var state: any = null;
        var zcode: any = null;
        var traffic: any = null;


        if (DataHandler.tier3dealaerName != null)
            dealerName = DataHandler.tier3dealaerName;
        else
            dealerName = DataHandler.dealerName;

        if (DataHandler.tier3providerName != null)
            provider = DataHandler.tier3providerName;

        if (DataHandler.tier3_dealerState != null)
            state = DataHandler.tier3_dealerState;

        if (DataHandler.tier3_dealerZipcode != null)
            zcode = DataHandler.tier3_dealerZipcode;
        else
            zcode = DataHandler.dealerzip;

        if (DataHandler.tier3_trafficType != null)
            traffic = DataHandler.tier3_trafficType;

        if (DataHandler.model?.toLowerCase() == 'ram 1500') {
            DataHandler.model = DataHandler.model.split(" ").join("-").concat("-dt");
        }
        
        if(DataHandler.model?.toLowerCase() == 'grand cherokee' && DataHandler.year == '2023' ){
            DataHandler.model = DataHandler.model.split(" ").join("-").concat("-wl");
        }
        if(DataHandler.model?.toLowerCase() == 'wrangler 4xe'||DataHandler.model?.toLowerCase() == 'Wrangler 4xe' && DataHandler.year == '2023' ){
            DataHandler.model = DataHandler.model.split(" ").join("-");
        }
        if(DataHandler.model?.toLowerCase() == 'ram promaster®'||DataHandler.model?.toLowerCase() == 'Ram promaster®' && DataHandler.year == '2023' ){
            DataHandler.model = 'ram promaster'.split(" ").join("-");
        }
        if(DataHandler.digitalData != undefined) {
            DataHandler.digitalData.page.pageInfo = {
                pageName: "DriveFCA:" + make + ":" + dealerName + ":US:vehicle-reservation",
                language: "en",
                responsiveState: "Desktop",
                dealerID: dealerCode,
                dealerName: dealerName,
                providerName: provider,
                vehicleMake: DataHandler.make,
                vehicleModel: DataHandler.model,
                vehicleStatus: "new",
                vehicleTrim: DataHandler.trim,
                vehicleVin: DataHandler.vin,
                vehicleYear: DataHandler.year,
                vehicleInventoryStatus: DataHandler.vehicleInventoryStatusCode,
                tier3_dealerState: state,
                tier3_dealerZipcode: zcode,
                tier3_trafficType: traffic,
                websiteTier: "eshop dealer widget",
                geoRegion: "US",
                
            };

            DataHandler.digitalData.page.category = {
                pageType: "Vehicle Details"
            };

            if (section == "page-load") {
                DataHandler.digitalData.page.pageInfo.vehicleInventoryStatus = DataHandler.vehicleInventoryStatusCode;
                pageText = "DriveFCA:inwidget: make :" + model + ":" + year + ":new:us:vehicle-information";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "JSpageView", eventAction: "contentView", attributes: { pageID: "abc_virtualPageView",  thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
                var gen_FTID: any = MerkleHandler.generateUUID();
                DataHandler.getGlobalVisitorsIds = gen_FTID;
            }

            if (section == "trade-in-bb") {
                pageText = "DriveFCA:inwidget:" + make + ":" + dealerName + ":US:trade-in";
                linkText = "Trade-In";
                virtpageType = "Trade-In";
                navClick = 1;
                virtual_page = 1;
            }
            if (section == "trade-in-kbb") {
                pageText = "DriveFCA:inwidget:" + make + ":" + dealerName + ":US:trade-in";
                linkText = "Trade-In";
                virtpageType = "Trade-In";
                navClick = 1;
                virtual_page = 1;
            }

            if (section == "service-protection") {
                pageText = "DriveFCA:inwidget:" + make + ":" + dealerName + ":US:service-and-protection";
                linkText = "Service-and-Protection";
                virtpageType = "Service and Protection";
                navClick = 1;
                virtual_page = 1;
            }

            if (section == "service-protection-finance")
                pageText = "vcard:inwidget:DriveFCA:us:service-and-protection:toggle-finance";

            if (section == "service-protection-lease")
                pageText = "vcard:inwidget:DriveFCA:us:service-and-protection:toggle-lease";

            if (section == "service-protection-cash")
                pageText = "vcard:inwidget:DriveFCA:us:service-and-protection:toggle-cash";

            if (section == "delivery-review-submit") {
                pageText = "DriveFCA:inwidget:" + make + ":" + dealerName + ":US:review-and-submit";
                linkText = "Review-and-Submit";
                navClick = 1;
                virtpageType = "Review and Submit";
                virtual_page = 1;
            }

            if (section == "delivery-review-submit-lease")
                pageText = "vcard:inwidget:DriveFCA:us:Delivery, Review and Submit:toggle-lease";

            if (section == "delivery-review-submit-finance")
                pageText = "vcard:inwidget:DriveFCA:us:Delivery, Review and Submit:toggle-finance";

            if (section == "delivery-review-submit-cash")
                pageText = "vcard:inwidget:DriveFCA:us:Delivery, Review and Submit:toggle-cash";

            if (section == "Vehicle Personalization") {
                pageText = "DriveFCA:inwidget:" + make + ":" + dealerName + ":US:vehicle-personalization";
                virtpageType = "Vehicle Personalization";
                linkText = "Vehicle-Personalization";
                navClick = 1;
                virtual_page = 1;
            }

            if (section == "Vehicle Details") {
                linkText = "Vehicle-Details";
                navClick = 1;
                pageText = "DriveFCA:inwidget:" + make + ":" + dealerName + ":US:vehicle-details";
                virtpageType = "Vehicle Details";
                virtual_page = 1;
            }

            if (section == "review-payment-options") {
                pageText = "DriveFCA:inwidget:" + make + ":" + dealerName + ":US:payment-options";
                linkText = "Payment-Options";
                navClickPosition = "sidebar";
                navClick = 1;
                virtpageType = "Payment Options";
                virtual_page = 1;
            }
            if (section == "Lease") {
                linkText = "Payment-Options:Lease";
                // navClickPosition = "Lease";
                navClick = 1;
            }
            if (section == "Finance") {
                linkText = "Payment-Options:Finance";
                // navClickPosition = "Finance";
                navClick = 1;
            }
            if (section == "Cash") {
                linkText = "Payment-Options:Cash";
                // navClickPosition = "Cash";
                navClick = 1;
            }
            if (section == "veh_expand") {
                linkText = "DriveFCA:inwidget:" + make + ":" + dealerName + ":US:Vehicle-Expanded";
                navClickPosition = "topNav";
                navClick = 1;
            }

            if (section == "photo-gallery" || section == "photo-gallery-open-popup") {
                linkText = "Gallery";
                navClickPosition = "sidebar";
                navClick = 1;
            }
            if (section == "test-drive") {
                linkText = "Test-Drive";
                navClickPosition = "sidebar";
                navClick = 1;
            }
            if (section == "test-drive-start") {
                // pageText = "vcard:DriveFCA:test-drive-submission";
                pageText = "DriveFCA:inwidget:modal:" + make + ":" + model + ":" + year + ":new:US:test-drive-submission";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "start", eventAction: "form", attributes: { formDescription: "lead", formType: pageText, displayType: "modal", displayFormat: "modal",thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            }

            if (section == "test-drive-end") {
                var hashedemail = this.encryptemail(DataHandler.email).then((adobeMail)=>{
                pageText = "DriveFCA:inwidget:modal:test-drive-submission-success";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "submit", eventAction: "form", attributes: { formDescription: "lead", formType: pageText, displayType: "modal", displayFormat: "modal", leadId: MerkleHandler.generateFTID(),hashedEmail : adobeMail, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            });
            }

            if (section == "cashdown-open") {
                pageText = "DriveFCA:inwidget:"+ make + ":financecalc"+ ":" +":Cash-Down-open";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: { formType: pageText,   thirdPartyToolProvider: "vehicle-reservation|Carzato" }});
                stat = 0;
            }

            if (section == "due-at-signing-open") {
                pageText = "DriveFCA:inwidget:"+ make + ":leasecalc"+ ":" +":Due-At-Signing-open";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: { formType: pageText,    thirdPartyToolProvider: "vehicle-reservation|Carzato" }});
                stat = 0;
            }

            if (section == "due-at-signing-close") {
                pageText = "DriveFCA:inwidget:"+ ":" +":leasecalc"+ ":" +"Due-At-Signing-close";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: { formType: pageText,   thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            }

            if (section == "cashdown-close") {
                pageText = "DriveFCA:inwidget:"+ ":" +":financecalc"+ ":" +"Cash-Down-close";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: { formType: pageText,    thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            }

            if (section == "taxes-fee-close") {
                pageText = "inwidget"+ ":" + sectiontab+ "calc" + ":" +"Taxes-&-Fees-close";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: { formType: pageText,   thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            }

            if (section == "taxes-fee-open") {
                pageText = "inwidget:"+ make +":" + sectiontab+ "calc" +":" +"Taxes-&-Fees-open";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick" , attributes: { formType: pageText,   thirdPartyToolProvider: "vehicle-reservation|Carzato" }});
                stat = 0;
            }


            if (section == "Estimated-Monthly-Taxes-open") {
                pageText = "DriveFCA:inwidget"+ ":" + sectiontab+ "calc" + ":" +"Estimated-Monthly-Taxes-open";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: { formType: pageText,   thirdPartyToolProvider: "vehicle-reservation|Carzato" }});
                stat = 0;
            }

            if (section == "Estimated-Monthly-Taxes-close") {
                pageText = "DriveFCA:inwidget"+ ":" + sectiontab+ "calc" +":" +"Estimated-Monthly-Taxes-close";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: { formType: pageText,   thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            }

            
            if (section == "Estimated-Upfront-Taxes-open") {
                pageText = "DriveFCA:inwidget"+ ":" + sectiontab+ "calc" +":" +"Estimated-Upfront-Taxes-open";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: { formType: pageText,   thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            }

            if (section == "Estimated-Upfront-Taxes-close") {
                pageText = "DriveFCA:inwidget"+ ":" + sectiontab+ "calc" +":" +"Estimated-Upfront-Taxes-close";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick" , attributes: { formType: pageText,   thirdPartyToolProvider: "vehicle-reservation|Carzato" }});
                stat = 0;
            }

            
            if (section == "Upfront-Fees-open") {
                pageText = "DriveFCA:inwidget"+ ":" + sectiontab+ "calc" +":" +"Upfront-Fees-open";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick" , attributes: { formType: pageText,   thirdPartyToolProvider: "vehicle-reservation|Carzato" }});
                stat = 0;
            }

            if (section == "Upfront-Fees-close") {
                pageText = "DriveFCA:inwidget"+ ":" + sectiontab+ "calc" + ":" +"Upfront-Fees-close";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick" , attributes: { formType: pageText,   thirdPartyToolProvider: "vehicle-reservation|Carzato" }});
                stat = 0;
            }
            if (section == "test-drive-invalid")
                pageText = "vcard:DriveFCA:test-drive-submission-failure";


            if (section == "scheduled-delivery-start-date") {
                pageText = "vcard:DriveFCA:scheduled-delivery-submission";
                //DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "start", eventAction: "form", attributes: { formDescription: "lead", formType: pageText, displayType: "modal", displayFormat: "modal" } }); 
                stat = 1;
                pageText = "DriveFCA:inwidget:" + make + ":" + model + ":" + year + ":US:" + vin + ":" + dealerCode + ":scheduledelivery:deliveryDate:" + sectiontab;
            }

            if (section == "scheduled-delivery-start-time") {
                pageText = "vcard:DriveFCA:scheduled-delivery-submission";
                //DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "start", eventAction: "form", attributes: { formDescription: "lead", formType: pageText, displayType: "modal", displayFormat: "modal" } }); 
                stat = 1;
                pageText = "DriveFCA:inwidget:" + make + ":" + model + ":" + year + ":US:" + vin + ":" + dealerCode + ":scheduledelivery:deliverytime:" + sectiontab;
            }

            if (section == "scheduled-delivery-end") {
                pageText = "vcard:DriveFCA:scheduled-delivery-submission-success";
                //DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "submit", eventAction: "form", attributes: { formDescription: "lead", formType: pageText, displayType: "modal", displayFormat: "modal", leadId: MerkleHandler.generateFTID() } }); 
                stat = 0;
            }

            if (section == "scheduled-delivery-invalid")
                pageText = "vcard:DriveFCA:scheduled-delivery-submission-failure";

            if (section == "review-submit-start") {
                pageText = "drivefca:inwidget:" + make + ":" + model + ":" + year + ":new:US:second-lead-submission";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "start", eventAction: "form", attributes: { formDescription: "lead", formType: pageText, displayType: "modal", displayFormat: "modal", vehicleInventoryStatus: DataHandler.vehicleInventoryStatusCode, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            }

            if (section == "view-offer-start") {
                pageText = "drivefca:inwidget:" + make + ":" + model + ":" + year + ":new:US:dealer-discount";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "start", eventAction: "form", attributes: { formDescription: "lead", formType: pageText, displayType: "modal", displayFormat: "modal", vehicleInventoryStatus: DataHandler.vehicleInventoryStatusCode, thirdPartyToolProvider: "vehicle-reservation|Carzato"  } });
                stat = 0;
            }

            if( section == "apply-credit-start"){
                pageText = "drivefca:inwidget:" + make + ":" + model + ":" + year + ":new:US:explore-finance-options";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "start", eventAction: "form", attributes: { formDescription: "lead", formType: pageText, displayType: "modal", displayFormat: "modal", vehicleInventoryStatus: DataHandler.vehicleInventoryStatusCode, thirdPartyToolProvider: "vehicle-reservation|Carzato"  } });
                stat = 0;
            }

            if (section == "tradein-bb-start") {
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "start", eventAction: "form", attributes: { formDescription: "non-lead", formType: 'vendor trade in tool', displayType: "inPage", displayFormat: "iframe", tradeInProvider: 'BlackBook', thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            }

            if (section == "tradein-bb-submit") {
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "submit", eventAction: "form", attributes: { formDescription: "non-lead", formType: "vendor trade in tool", displayType: "inPage", displayFormat: "iframe", tradeInProvider: "BlackBook", tradeInVehicleYear: DataHandler.tradeinyear, tradeInVehicleMake: DataHandler.tradeinmake, tradeInVehicleModel: DataHandler.tradeinmodel, desiredVehicleYear: year, desiredVehicleMake: make, desiredVehicleModel: model,    thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            }

            if (section == "tradein-kbb-start") {
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "start", eventAction: "form", attributes: { formDescription: "non-lead", formType: 'vendor trade in tool', displayType: "inPage", displayFormat: "iframe", tradeInProvider: 'KelleyBlueBook', thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            }

            if (section == "tradein-kbb-submit") {
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "submit", eventAction: "form", attributes: { formDescription: "non-lead", formType: "vendor trade in tool", displayType: "inPage", displayFormat: "iframe", tradeInProvider: "KelleyBlueBook", tradeInVehicleYear: DataHandler.tradeinyear, tradeInVehicleMake: DataHandler.tradeinmake, tradeInVehicleModel: DataHandler.tradeinmodel, desiredVehicleYear: year, desiredVehicleMake: make, desiredVehicleModel: model,   thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            }

            if (section == "review-submit-start-first") {
                pageText = "drivefca:inwidget:" + make + ":" + model + ":" + year + ":new:US:first-lead-submission";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "start", eventAction: "form", attributes: { formDescription: "lead", formType: pageText, displayType: "modal", displayFormat: "modal", vehicleInventoryStatus: DataHandler.vehicleInventoryStatusCode, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            }

            if (section == "review-submit-end-first") {
                var hashedemail = this.encryptemail(DataHandler.email).then((adobeMail)=>{
                pageText = "drivefca:inwidget:" + make + ":" + model + ":" + year + ":new:us:first-lead-submission";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "submit", eventAction: "form", attributes: { formDescription: "lead", formType: pageText, displayType: "modal", displayFormat: "modal", leadId: MerkleHandler.generateFTID(), vehicleInventoryStatus: DataHandler.vehicleInventoryStatusCode ,hashedEmail : adobeMail,thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            });
            }

            if (section == "review-submit-end") {
                var hashedemail = this.encryptemail(DataHandler.email).then((adobeMail)=>{
                pageText = "drivefca:inwidget:" + make + ":" + model + ":" + year + ":new:us:second-lead-submission";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "submit", eventAction: "form", attributes: { formDescription: "lead", formType: pageText, displayType: "modal", displayFormat: "modal", leadId: MerkleHandler.generateFTID(), vehicleInventoryStatus: DataHandler.vehicleInventoryStatusCode,hashedEmail : adobeMail, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
                });
            }

            if (section == "view-offer-end") {
                var hashedemail = this.encryptemail(DataHandler.email).then((adobeMail)=>{
                pageText = "drivefca:inwidget:" + make + ":" + model + ":" + year + ":new:us:dealer-discount";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "submit", eventAction: "form", attributes: { formDescription: "lead", formType: pageText, displayType: "modal", displayFormat: "modal", leadId: MerkleHandler.generateFTID(), vehicleInventoryStatus: DataHandler.vehicleInventoryStatusCode,hashedEmail : adobeMail, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            });
            
            }

            
            if (section == "view-offer-end-autofi") {
                var hashedemail = this.encryptemail(DataHandler.email).then((adobeMail)=>{
                pageText = "drivefca:inwidget:" + make + ":" + model + ":" + year + ":vehicle-information:dealer-discount:close";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "submit", eventAction: "form", attributes: { formDescription: "lead", formType: pageText, displayType: "modal", displayFormat: "modal", leadId: MerkleHandler.generateFTID(), vehicleInventoryStatus: DataHandler.vehicleInventoryStatusCode ,hashedEmail : adobeMail, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            });
            }

            if (section == "review-submit-invalid"){
                pageText = "vcard:DriveFCA:Delivery, Review and Submit-submission-failure";
            }


            if (section == "apply-credit-end") {
                var hashedemail = this.encryptemail(DataHandler.email).then((adobeMail)=>{
                pageText = "drivefca:inwidget:" + make + ":" + model + ":" + year + ":new:US:explore-finance-options";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "submit", eventAction: "form", attributes: { formDescription: "lead", formType: pageText, displayType: "modal", displayFormat: "modal", leadId: MerkleHandler.generateFTID(),hashedEmail : adobeMail, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            });
            }

            if (section == "apply-credit-invalid"){
                pageText = "vcard:DriveFCA:Apply-for-credit-failure";
            }


            if (section == "apply-credit-routone"){
                pageText = "vcard:DriveFCA:Apply-for-credit:routone";
            }

            if (section == "apply-credit-dealertrack"){
                pageText = "vcard:DriveFCA:Apply-for-credit:dealertrak";
            }

            if (section == "gallery-popup-close"){
                pageText = "inwidget:gallery-popup:close";
            }

            if (section == "gallery-popup-carousel"){
                pageText = "inwidget:gallery-popup:carousel";
            }

            if (section == "view-available-offers-from-your-dealer"){
                pageText = "inwidget:Payment-Options:" + sectiontab + ":view-available-offers-from-your-dealer";
            }   

            if (section == "view-available-offers-from-your-dealer-autofi"){
                pageText = "inwidget:credit-application:payment-options:" + sectiontab + ":view-available-offers-from-your-dealer";
            }  

            if (section == "modal:initial-popup:how-itworks-link"){
                pageText = "modal:initial-popup:how-itworks-link";
            }

            if (section == "inwidget:vehicle-information:first-lead-submission-popup:close"){
                pageText = "inwidget:vehicle-information:first-lead-submission-popup:close";
            }

            if (section == "inwidget-Widget-Close"){
                pageText = "inwidget:Widget:Close";
            }

            if (section == "add-vehicle-accessories"){
                pageText = "inwidget:Vehicle Personalization:accessories:Checked:" + sectiontab;
            }
            if (section == "remove-vehicle-accessories"){
                pageText = "inwidget:Vehicle Personalization:accessories:unChecked:" + sectiontab;
            }

            if (section == "review-payment-option-discounts"){
                pageText = "inwidget:Payment-Options:" + sectiontab ;
            }

            
            if (section == "review-payment-option-discountsautofi"){
                pageText = "inwidget:"+ make + ":" + sectiontab;
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: { linkText: pageText,    thirdPartyToolProvider: "vehicle-reservation|Carzato"} });
                stat = 0;
            }

            if (section == "scheduledelivery-deliverylocation-select"){
                pageText = "DriveFCA:inwidget:" + make + ":" + model + ":" + year + ":US:" + vin + ":" + dealerCode + ":scheduledelivery:deliverylocation:Checked:" + sectiontab;
            }

            if (section == "service-and-protection-accessories"){
                pageText = "DriveFCA:inwidget:" + make + ":" + model + ":" + year + ":US:" + vin + ":" + dealerCode + ":service-and-protection-accessories:" + sectiontab;
            }
            if (section == "service-and-protection-accessories-lease"){
                pageText = "DriveFCA:inwidget:" + make + ":" + model + ":" + year + ":US:" + vin + ":" + dealerCode + ":service-and-protection-accessories:" + sectiontab;
            }
            if (section == "service-and-protection-accessories-finance"){
                pageText = "DriveFCA:inwidget:" + make + ":" + model + ":" + year + ":US:" + vin + ":" + dealerCode + ":service-and-protection-accessories:" + sectiontab;
            }
            if (section == "service-and-protection-accessories-cash"){
                pageText = "DriveFCA:inwidget:" + make + ":" + model + ":" + year + ":US:" + vin + ":" + dealerCode + ":service-and-protection-accessories:" + sectiontab;
            }

            if (section == "submit-to-dealer-button") {
                linkText = "Submit-to-Dealer";
                navClickPosition = "bottomNav";
                navClick = 1;
            }
            if (section == "bottom-apply-credit") {
                pageText = "DriveFCA:inwidget:" + make + ":" + dealerName + ":US:finance";
                linkText = "Apply-for-Credit";
                navClickPosition = "bottomNav";
                navClick = 1;
                virtpageType = "Finance";
                virtual_page = 1;
            }
            if (section == "submit-to-dealer-popup-close")
                pageText = "submit-to-dealer-popup-close";

            if (section == "submit-to-dealer-offers-popup-close")
                pageText = "inwidget:vehicle-information:dealer-discount:close";

            if (section == "apply-to-credit-popup-close")
                pageText = "apply-to-credit-popup-close";

            if (section == "tax-and-fees") {
                if (position == 2) {
                    ctaClick = 1;
                    stat = 0;
                } else {
                    stat = 1;
                }
                pageText = sectiontab;
            }

            
            if (section == "tax-and-fees-autofi") {
                if (position == 2) {
                    stat = 0;
                } else {
                    pageText = sectiontab;
                    DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: { linkText: pageText,   thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                    stat =0;
                }
                
            }
            if (section == "payment-option-credit-range") {
                pageText = "t3:payment options modal:" + position + ":credit range:tier " + sectiontab;
            }

            if (section == "payment-option-credit-range-autofi") {
                pageText = "inwidget:credit-application:payment options:" + position + ":credit range:tier " + sectiontab;
            }

            if (section == "service-and-protection-jeep-wave-program-lease") {
                pageText = "t3:"+ make + ":" + model + ":" + year + ":US:" + vin + ":" + dealerCode +":" + position + " service-and-protection-plans:" + sectiontab;
            }
            if (section == "service-and-protection-jeep-wave-program-finance") {
                pageText = "t3:"+ make + ":" + model + ":" + year + ":US:" + vin + ":" + dealerCode +":" + position + " service-and-protection-plans:" + sectiontab;
            }
            if (section == "service-and-protection-jeep-wave-program-cash") {
                pageText = "t3:"+ make + ":" + model + ":" + year + ":US:" + vin + ":" + dealerCode +":" + position + " service-and-protection-plans:" + sectiontab;
            }
            if (section == "payment-option-term-duration") {
                pageText = "t3:payment options modal:" + position + ":term duration:" + sectiontab;
            }

            if (section == "payment-option-term-duration-autofi") {
                pageText = "inwidget:credit-application:payment options:" + position + ":term duration:" + sectiontab;
            }
            if (section == "payment-option-annual-mileage") {
                pageText = "t3:payment options modal:" + position + ":annual mileage:" + sectiontab;
            }

            if (section == "payment-option-annual-mileage-autofi") {
                pageText = "inwidget:credit-application:payment options:" + position + ":annual mileage:" + sectiontab;
            }

            if (section == "co-applicant-pop-close") {
                pageText = "inwidget:credit-application:popup:close";
            }

            if (section == "reserve-vehicle-now") {
                pageText = "t3:" + make + ":" + model + ":reserve-now";
                var txt = "t3:inwidget:" + make + ":" + model + ":vehicle-reservation";
                ctaClick = 1;
                stat = 0;
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: { virtPageName: txt, virtPageType: 'vehicle-reservation', thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
            }
            if (section == "paypal-form-start") {
                pageText = "vehicle-reservation";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "start", eventAction: "form", attributes: { formDescription: "lead", formType: pageText, displayType: "modal", displayFormat: "modal", vehicleInventoryStatus: DataHandler.vehicleInventoryStatusCode, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            }
            if (section == "paypal-form-submit") {
                var hashedemail = this.encryptemail(DataHandler.email).then((adobeMail)=>{
                pageText = "vehicle-reservation";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "submit", eventAction: "form", attributes: { formDescription: "lead", formType: pageText, displayType: "modal", displayFormat: "modal", leadId: MerkleHandler.generateFTID(), vehicleInventoryStatus: DataHandler.vehicleInventoryStatusCode, transactionNumber: position,hashedEmail : adobeMail, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            });
            }
            if (section == "reserve-print-this-page") {
                pageText = "t3:" + make + ":" + model + ":vehicle-reservation-thank-you:print-this-page";
                ctaClick = 1;
                stat = 0;
            }
            if (section == "paypal-form-paypal") {
                pageText = "t3:" + make + ":" + model + ":vehicle-reservation:paypal";
                ctaClick = 1;
                stat = 0;
            }
            if (section == "paypal-form-card") {
                pageText = "t3:" + make + ":" + model + ":vehicle-reservation:debit-or-credit-card";
                ctaClick = 1;
                stat = 0;
            }
            if (section == "reservenow-close") {
                stat = 1;
                ctaClick = 0;
                pageText = "t3:" + make + ":" + model + ":vehicle-reservation-thank-you:close-window";
            }

            if (section == "faq-header-open") {
                stat = 1;
                ctaClick = 0;
                pageText = "t3:" + make + ":" + model + ":vehicle-reservation-thank-you:faq:" + sectiontab + "-open";
            }

            if (section == "faq-header-close") {
                stat = 1;
                ctaClick = 0;
                pageText = "t3:" + make + ":" + model + ":vehicle-reservation-thank-you:faq:" + sectiontab + "-close";
            }
            
            if(section=="cashcheck"){
                stat = 1;
                pageText = "t3:" + make + ":cashcalc:checked:" + sectiontab;
            }
            if(section=="cashuncheck"){
                stat = 1;
                pageText = "t3:" + make + ":cashcalc:unchecked:" + sectiontab;
            }

            if(section=="financecheck"){
                stat = 1;
                pageText = "t3:" + make + ":financecalc:checked:" + sectiontab;
            }
            if(section=="financeuncheck"){
                stat = 1;
                pageText = "t3:" + make + ":financecalc:unchecked:" + sectiontab;
            }
            if(section=="leasecheck"){
                stat = 1;
                pageText = "t3:" + make + ":leasecalc:checked:" + sectiontab;
            }
            if(section=="leaseuncheck"){
                stat = 1;
                pageText = "t3:" + make + ":leasecalc:unchecked:" + sectiontab;
            }

            if (section == "get-a-better-estimate") {
                stat = 0;
                pageText = "inwidget:" + make + ":" + model + ":payment-options:" + sectiontab+":get-a-better-estimate-click-here";
                var pagetext1= "inwidget:" + make + ":" + model +":" + dealerName + ":US:get-a-better-estimate-click-here";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: { virtPageName: pagetext1, virtPageType: 'credit-estimator',thirdPartyToolProvider: "vehicle-reservation|Carzato"} });
            }

            if (section == "estimate-start") {
                stat = 1;
                pageText = "inwidget:" + make + ":" + model +":estimate-modal:start";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "start", eventAction: "form", attributes: { formDescription: "lead", formType: "credit-estimator", displayType: "modal", displayFormat: "modal", vehicleInventoryStatus:DataHandler.display_label,thirdPartyToolProvider: "vehicle-reservation|Carzato"} });
            }


            if(section=="estimate-back"){
                stat = 1;
                pageText = "inwidget:" + make + ":" + model +":estimate-modal-credit-estimator:back";
            }

            if(section == "accessories"){
                pageText = "DriveFCA:inwidget:" + make + ":" + dealerName + ":US:accessories";
                linkText = "accessories";
                navClick = 1;
                navClickPosition = "topNav";
                virtpageType = "accessories";
                virtual_page = 1;
            }

            if(section == "accessoriesbottom"){
                pageText = "DriveFCA:inwidget:" + make + ":" + dealerName + ":US:accessories";
                linkText = "accessories";
                navClick = 1;
                navClickPosition = "bottomNav";
                virtpageType = "accessories";
                virtual_page = 1;
            }

            if(section == "accessories-select"){
                pageText = "Payment Options:" + make + ":" + model+":"+year+":"+position+" "+"accessories";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "navClick", eventAction: "pageElementInteraction", attributes: { linkText: pageText, year: year, make: make, model: model, trim: trim, status: "new", thirdPartyToolProvider: "vehicle-reservation|Carzato" }});
            }

            if(section == "accessories-search"){
                pageText = "inwidget:" + make + ":" + model ;
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "typed", eventAction: "search", attributes: {  searchTerm:sectiontab, type:'internal' ,searchResultsNumber:position, thirdPartyToolProvider: "vehicle-reservation|Carzato" }});
            }


            if (section == "estimater-form-start") {
                pageText = "modal:drivefca:inwidget:" + make + ":" + model + ":" + year + ":new:US:test-drive-submission";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "start", eventAction: "form", attributes: { formDescription: "lead", formType: 'credit-estimator', displayType: "modal", displayFormat: "modal",vehicleInventoryStatus:DataHandler.display_label, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            }

            if(section=="see-my-estimate"){
                stat = 0;
                pageText = "inwidget:" + make + ":" + model +":estimate-modal-credit-estimator:see-my-estimates";
            }

            if(section=="estimate-close"){
                stat = 0;
                pageText = "inwidget:" + make + ":" + model +":estimate-modal-credit-estimator:close";
            }

            if(section=="estimate-credit-estimator-x"){
                stat = 0;
                pageText = "inwidget:" + make + ":" + model +":estimate-modal-credit-estimator:close-x";
            }

            if (section == "estimator-form-submit") {
                var hashedemail = this.encryptemail(DataHandler.email).then((adobeMail)=>{
                    pageText = "credit-estimator";
                    DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "submit", eventAction: "form", attributes: { formDescription: "lead", formType: pageText, displayType: "modal", displayFormat: "modal", leadId: MerkleHandler.generateFTID(), vehicleInventoryStatus:  DataHandler.display_label, creditRange:sectiontab,hashedEmail : adobeMail ,thirdPartyToolProvider: "vehicle-reservation|Carzato"} });
                    stat = 0;
                });
            }

            if(section == "private-offer-open"){
                pageText = "inwidget:" + make + ":" + model +":us:private-offer-modal:"+sectiontab+":"+position+"-bonus-cash";
            
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: { virtPageName: pageText, virtPageType: 'private-offer', thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                virtual_page = 1; 
            }

            if (section == "private-offer-close"){
                stat = 1; 
                pageText = "inwidget:" + make + ":" + model +":"+position+ ":private-offer-modal:close";
            }

            if(section=="close-zipcode-better"){
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: { linkText: pageText, year: year, make: make, model: model, trim: trim, status: DataHandler.display_label,    thirdPartyToolProvider: "vehicle-reservation|Carzato"} });
                pageText = "inwidget:" + make + ":" + model +":estimate-modal-zip-code:close-x";
            }

            if(section=="open-testdrive"){
                // virtual_page = 1;
                pageText="DriveFCA:inwidget:"+make+":"+dealerName+":"+"US:Take-a-TestDrive";  
                DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: {virtPageName:pageText,virtPageType:"Take a TESTDRIVE", thirdPartyToolProvider: "vehicle-reservation|Carzato"} });
            }

            if(section=="testrive-close"){
                DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: {linkText:pageText, year: year, make: make, model: model, trim: trim, status: "new", thirdPartyToolProvider: "vehicle-reservation|Carzato"} });
                pageText="inwidget:"+make+":"+model+":"+"take-a-testdrive:close-x";  
            }

            if(section=="continue-link"){
                stat=1;
                pageText="inwidget:"+make+":"+model+":"+"estimate-modal:start";  
                // DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: {linkText:pageText, year: year, make: make, model: model, trim: trim, status: "new"} });
            }
            
            if(section=="close-better"){
                DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: {linkText:pageText, year: year, make: make, model: model, trim: trim, status: "new", thirdPartyToolProvider: "vehicle-reservation|Carzato"} });
                pageText="inwidget:"+make+":"+model+":"+"estimate-modal-credit-estimator:close-x";  
            }

            if (section == "private-offer-continue"){
                stat = 1; 
            
                pageText = "inwidget:" + make + ":" + model +":"+position+ ":private-offer-modal:continue";
            }
            

            if(section == 'autofiapply'){
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "CTA", eventAction: "buttonClick", attributes: { linkText:"bottom:inwidget:DriveFCA:"+ make + ":" + model +":"  + year+":new:us:leadsubmit:Apply for Credit", "displayFormat": "inPage", thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            }

            if(section == 'paymentcalcload'){
                DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: { virtPageName:"drivefca:"+dealerName+":us:credit-application:payment-options",virtPageType:"credit-application:payment-options", thirdPartyToolProvider: "vehicle-reservation|Carzato"} });
                stat = 0;
            }

            if(section == 'startapplication'){
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "CTA", eventAction: "buttonClick", attributes: { linkText:"bottom:inwidget:DriveFCA:"+ make + ":" + ":new:us:leadsubmit:Start Application", "displayFormat": "inPage",   thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            }

            if(section == 'vehicledetailsnav'){
                linkText = "Vehicle Pricing Details";
                navClick = 1;
                position = "topNav";
                stat = 0;
            }

            if(section == 'vehicledetailsclose'){
                pageText = "inwidget:credit-application:vehicle-pricing-details-popup:close";
                stat =1;
            }

            if(section == 'applyforcreditformstart'){
                //var vehicleInventoryStatus=DataHandler.display_label;
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "start", eventAction: "form", attributes: { formDescription: "lead", formType: "apply-for-financing", displayType: "in-page", displayFormat: "in-page","vehicleInventoryStatus":DataHandler.display_label, thirdPartyToolProvider: "vehicle-reservation|Carzato"} });
                stat =0;
            }

            if(section == 'contactinfojsview'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:contact-information";
                virtpageType = "credit-application:form";
                stat =0;
            }

            if(section == 'co_contactinfojsview'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:co-applicant-contact-information";
                virtpageType = "credit-application:form";
                stat = 0;
            }

            if(section == 'residentjsview'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:residence-type";
                virtpageType = "credit-application:form";
                stat = 0;
            }

            if(section == 'co_relationshipjsview'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:co-applicant-relationship";
                virtpageType = "credit-application:form";
                stat = 0;
            }

            if(section == 'co_residentjsview'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:co-applicant-residence type";
                virtpageType = "credit-application:form";
                stat = 0;
            }

            if(section == 'prevresidentjsview'){
                virtual_page =1 ;
            // DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: {linkText:"inwidget:drivefca:"+ year +":" + make + ":" + model+ "us:credit-application:Continue to Previous Residence"  }});
                pageText= "drivefca:"+dealerName+":us:credit-application:previous-residence-type";
                virtpageType = "credit-application:form";
                stat = 0;
            }

            if(section == 'prevco_residentjsview'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:co-applicant-previous-residence-type";
                virtpageType = "credit-application:form";
                stat = 0;
            }

            if(section == 'employmentjsview'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:employment";
                virtpageType = "credit-application:form";
                stat = 0;
            }

            if(section == 'current_incomejsview'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:current-income";
                virtpageType = "credit-application:form";
                stat = 0;
            }

            if(section == 'review_applicationjsview'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:review-application";
                virtpageType = "credit-application:form";
                stat = 0;
            }

            if(section == 'coapplicant_current_incomejsview'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:coapplicant-current-income";
                virtpageType = "credit-application:form";
                stat = 0;
            }

            if(section == 'co_employmentjsview'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:co-applicant-employment";
                virtpageType = "credit-application:form";
                stat = 0;
            }

            if(section == 'prevemploymentjsview'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:previous-employment";
                virtpageType = "credit-application:form";
                stat = 0;
            }

            if(section == 'prevco_employmentjsview'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:co-applicant-previous-employment";
                virtpageType = "credit-application:form";
                stat = 0;
            }

            if(section == 'currentincomejsview'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:current-income";
                virtpageType = "credit-application:form";
                stat = 0;
            }

            if(section == 'co_currentincomejsview'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:co-applicant-current-income";
                virtpageType = "credit-application:form";
                stat = 0;
            }

            if(section == 'creditinfojsview'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:credit-information";
                virtpageType = "credit-application:form";
                stat = 0;
            }

            if(section == 'co_creditinfojsview'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:co-applicant-credit-information";
                virtpageType = "credit-application:form";
                stat = 0;
            }

            if(section == 'reviewjsview'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:review-application";
                virtpageType = "credit-application:form";
                stat = 0;
            }

            if(section == 'submissionlead'){
                var hashedemail = this.encryptemail(DataHandler.email).then((adobeMail)=>{
                DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "submit", eventAction: "form", attributes: { formDescription: "lead", formType: "apply-for-financing", displayType: "in-page", displayFormat: "inPage", leadId:  MerkleHandler.generateFTID(), vehicleInventoryStatus: DataHandler.vehicleInventoryStatusCode,hashedEmail : adobeMail, thirdPartyToolProvider: "vehicle-reservation|Carzato"} });
                stat = 0;
            });
            }
            
            if(section == 'submitclick'){
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "CTA", eventAction: "buttonClick", attributes: { linkText: "inwidget:credit-application:form:apply-for-financing-submit", displayFormat:"inPage", thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
            }
            if(section == 'printdisclosure'){
            stat =1;
            pageText = "inwidget:credit-application:form:print-documents";
            }

            if(section == 'contacttoresidencenav'){
                linkText = "Continue to Residence Type";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'co_contactinfonav'){
                linkText = "Continue to Identity And Co-Applicant Contact Information";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'co_contacttoresidencenav'){
                linkText = "Continue to Co-Applicant Residence Type";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'co_contacttorelationshipnav'){
                linkText = "Continue to Co-Applicant Relationship";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'residencetoemploymentnav'){
                linkText = "Continue to Employment";
                navClick = 1;
                navClickPosition = "bottomNav";
            }

            if(section == 'co_residencetoemploymentnav'){
                linkText = "Continue to Co-Applicant Employment";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'residencetoprevresidencenav'){
                linkText = "Continue to Previous Residence";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'co_residencetoprevresidencenav'){
                linkText = "Continue to Co-Applicant Previous Residence";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'employmenttocurrentincomenav'){
                linkText = "Continue to Current Income";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'co_employmenttocurrentincomenav'){
                linkText = "Continue to Co-Applicant Current Income";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'employmenttoprevemploymentnav'){
                linkText = "Continue to Previous Employment";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'co_employmenttoprevemploymentnav'){
                linkText = "Continue to Co-Applicant Previous Employment";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'currentincometocreditinfonav'){
                linkText = "Continue to Credit Information";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'co_currentincometocreditinfonav'){
                linkText = "Continue to Co-Applicant Credit Information";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'creditinfotoreviewnav'){
                linkText = "Continue to Review Application";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'reviewtosubmitnav'){
                linkText = "Continue to review-application-terms";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }
            
            if(section == 'backtocalc'){
                linkText = "Back to Calculators";
                navClickPosition = "bottomNav";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "navClick", eventAction: "pageElementInteraction", attributes: { position: navClickPosition, linkText: linkText, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
                DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: {virtPageName:"inwidget:drivefca:"+ dealerName + ":" + "us:credit-application:payment-options",virtpageType : "credit-application:payment-options", thirdPartyToolProvider: "vehicle-reservation|Carzato" }});
            }

            if(section == 'backtocontactnav'){
                linkText = "Back to Identity And Contact Information";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'co_backtocontactnav'){
                linkText = "Back to Co-Applicant Identity And Contact Information";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'backtoresidencenav'){
                linkText = "Back to Residence Type";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'backtorelationshipnav'){
                linkText = "Back to Co-Applicant Relationship";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'co_backtoresidencenav'){
                linkText = "Back to Co-Applicant Residence Type";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'backtoemploymentnav'){
                linkText = "Back to Employment";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'co_backtoemploymentnav'){
                linkText = "Back to Co-Applicant Employment";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'backtocurrentincomenav'){
                linkText = "Back to Current Income";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'co_backtocurrentincomenav'){
                linkText = "Back to Co-Applicant Current Income";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'backtocreditinfonav'){
                linkText = "Back to Credit Information";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'co_backtocreditinfonav'){
                linkText = "Back to Co-Applicant Credit Information";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'backtoreviewnav'){
                linkText = "Back to Review Application";
                navClick = 1;
                navClickPosition = "bottomNav";
                stat = 0;
            }

            if(section == 'closeautowidget'){
                linkText = "Back to Widget";
                navClickPosition = "topNav";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "navClick", eventAction: "pageElementInteraction", attributes: { position: navClickPosition, linkText: linkText, thirdPartyToolProvider: "vehicle-reservation|Carzato"} });
                stat = 0;
                DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: {virtPageName :"inwidget:drivefca:"+ dealerName + ":"+ make + ":" + "us:review-and-submit" ,virtpageType : "credit-application:form", thirdPartyToolProvider: "vehicle-reservation|Carzato"  }});
            }

            if(section == 'back to widget'){
                linkText = "Back to Widget";
                navClickPosition = "topNav";
                var date = new Date();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var year:any = date.getFullYear();
        
                var date_hour = date.getHours();
                var date_minute = date.getMinutes();
                var date_second = date.getSeconds();
                var fulldate = year + "-" + (('' + month).length < 2 ? '0' : '') + month + "-" + (('' + day).length < 2 ? '0' : '') + day + "T" + (('' + date_hour).length < 2 ? '0' : '') + date_hour + ":" + (('' + date_minute).length < 2 ? '0' : '') + date_minute + ":" + (('' + date_second).length < 2 ? '0' : '') + date_second;
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "navClick", eventAction: "pageElementInteraction", attributes: { position: navClickPosition, linkText: linkText,timeStamp :fulldate, thirdPartyToolProvider: "vehicle-reservation|Carzato"} });
                stat = 0;
            // DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: {virtPageName :"inwidget:drivefca:"+ dealerName + ":"+ make + ":" + "us:review-and-submit" ,virtpageType : "credit-application:form"  }});
            }

            if(section == 'sidecontactinfonav'){
                linkText = "Identity & Contact";
                navClickPosition = "sidebar";
                stat = 0;
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "navClick", eventAction: "pageElementInteraction", attributes: { position: navClickPosition, linkText: linkText, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: {virtPageName:"drivefca:"+ dealerName + ":" + "us:credit-application:Identity & Contact" ,virtpageType : "credit-application:form", thirdPartyToolProvider: "vehicle-reservation|Carzato"  }});
            }

            if(section == 'sideresidencenav'){
                linkText = "Residence";
                navClickPosition = "sidebar";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "navClick", eventAction: "pageElementInteraction", attributes: { position: navClickPosition, linkText: linkText, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
                DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: {virtPageName:"drivefca:"+ dealerName + ":" + "us:credit-application: Residence",virtpageType : "credit-application:form",thirdPartyToolProvider: "vehicle-reservation|Carzato"   }});
            }

            if(section == 'sideemploymentnav'){
                linkText = "Employment";
                navClickPosition = "sidebar";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "navClick", eventAction: "pageElementInteraction", attributes: { position: navClickPosition, linkText: linkText, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
                DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: {virtPageName:"drivefca:"+ dealerName + ":" + "us:credit-application:Employment" ,virtpageType : "credit-application:form",thirdPartyToolProvider: "vehicle-reservation|Carzato"  }});
            }

            if(section == 'sidecurrentincomenav'){
                linkText = "Current Income";
                navClickPosition = "sidebar";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "navClick", eventAction: "pageElementInteraction", attributes: { position: navClickPosition, linkText: linkText, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
                DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: {virtPageName:"drivefca:"+ dealerName + ":" + "us:credit-application:Current Income",virtpageType : "credit-application:form", thirdPartyToolProvider: "vehicle-reservation|Carzato"   }});
            }

            if(section == 'sidecreditinfonav'){
                linkText = "Credit";
                navClickPosition = "sidebar";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "navClick", eventAction: "pageElementInteraction", attributes: { position: navClickPosition, linkText: linkText, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
                DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: {virtPageName:"drivefca:"+ dealerName + ":" + "us:credit-application:Credit",virtpageType : "credit-application:form", thirdPartyToolProvider: "vehicle-reservation|Carzato"   }});
            }

            if(section == 'sidecalculatornav'){
                linkText = "Calculate Savings ";
                navClickPosition = "sidebar";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "navClick", eventAction: "pageElementInteraction", attributes: { position: navClickPosition, linkText: linkText, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
                DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: {virtPageName:"drivefca:"+ dealerName + ":" + "us:credit-application:payment-options",virtpageType : "credit-application:payment-options", thirdPartyToolProvider: "vehicle-reservation|Carzato" }});
            }

            if(section == 'reviewtosubmitjs'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:review-application-terms";
                virtpageType = "credit-application:form";
                stat = 0;
            }

            if(section == 'sideco_contactinfonav'){
                linkText = "Co-Applicant Identity & Contact";
                navClickPosition = "sidebar";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "navClick", eventAction: "pageElementInteraction", attributes: { position: navClickPosition, linkText: linkText, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
                DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: {virtPageName:"drivefca:"+ dealerName + ":" +"us:credit-application:Co-Applicant Identity & Contact" ,virtpageType : "credit-application:form",   thirdPartyToolProvider: "vehicle-reservation|Carzato"  }});
            }

            if(section == 'sideco_residencenav'){
                linkText = " Co-Applicant Residence";
                navClickPosition = "sidebar";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "navClick", eventAction: "pageElementInteraction", attributes: { position: navClickPosition, linkText: linkText, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
                DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: {virtPageName:"drivefca:"+ dealerName + ":" + "us:credit-application:Co-Applicant Residence",virtpageType : "credit-application:form", thirdPartyToolProvider: "vehicle-reservation|Carzato"   }});
            }

            if(section == 'sideco_relationshipnav'){
                linkText = "Co-Applicant Relationship";
                navClickPosition = "sidebar";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "navClick", eventAction: "pageElementInteraction", attributes: { position: navClickPosition, linkText: linkText, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
                DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: {virtPageName:"drivefca:"+ dealerName + ":" + "us:credit-application:Co-Applicant Relationship",virtpageType : "credit-application:form", thirdPartyToolProvider: "vehicle-reservation|Carzato"   }});
            }

            if(section == 'sideco_employmentnav'){
                linkText = "Co-Applicant Employment";
                navClickPosition = "sidebar";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "navClick", eventAction: "pageElementInteraction", attributes: { position: navClickPosition, linkText: linkText, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                stat = 0;
                DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: {linkText:"drivefca:"+ dealerName + ":" + "us:credit-application:Co-Applicant Employment" ,virtpageType : "credit-application:form", thirdPartyToolProvider: "vehicle-reservation|Carzato"  }});
            }

            if(section == 'sideco_currentincomenav'){
                linkText = " Co-Applicant Current Income";
                navClickPosition = "sidebar";
                stat = 0;
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "navClick", eventAction: "pageElementInteraction", attributes: { position: navClickPosition, linkText: linkText, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: {linkText:"drivefca:"+ dealerName + ":" + "us:credit-application:Co-Applicant Current Income",virtpageType : "credit-application:form", thirdPartyToolProvider: "vehicle-reservation|Carzato"   }});
            }

            if(section == 'sideco_creditinfonav'){
                linkText = "Co-Applicant Credit";
                navClickPosition = "sidebar";
                stat = 0;
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "navClick", eventAction: "pageElementInteraction", attributes: { position: navClickPosition, linkText: linkText, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
                DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: {linkText:"drivefca:"+ dealerName + ":" +"us:credit-application:Co-Applicant Credit" ,virtpageType : "credit-application:form", thirdPartyToolProvider: "vehicle-reservation|Carzato"  }});
            }

            if(section == 'autoButtonclicks'){
                pageText = "inwidget:credit-application:form:form-button-interaction";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: { linkText: pageText,    thirdPartyToolProvider: "vehicle-reservation|Carzato"} });
                stat=0;
            }

            if(section == 'autoInputclicks'){
                pageText = "inwidget:credit-application:form:form-input-interaction";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: { linkText: pageText,   thirdPartyToolProvider: "vehicle-reservation|Carzato"} });
                stat=0;
            }

            if(section == 'autoDropdownclicks'){
                pageText = "inwidget:credit-application:form:form-dropdown-interaction";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: { linkText: pageText,   thirdPartyToolProvider: "vehicle-reservation|Carzato"} });
                stat=0;
            }

            if(section == 'policyclick'){
                pageText = "inwidget:credit-application:form:privacy-policy";
                stat=1;
            }

            if(section == 'termsclick'){
                pageText = "inwidget:credit-application:form:terms-of-service";
                stat=1;
            }

            
            if(section == 'msrptooltiplease'){
                pageText = "drivefca:"+ make +":" +"leasecalc:msrp-tooltip";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: { linkText: pageText,   thirdPartyToolProvider: "vehicle-reservation|Carzato"} });
                stat=0;
            }
            if(section == 'msrptooltipfinance'){
                pageText = "drivefca:"+ make + ":" +"financecalc:msrp-tooltip";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: { linkText: pageText,   thirdPartyToolProvider: "vehicle-reservation|Carzato"} });
                stat=0;
            }
            if(section == 'inputInteraction'){
                pageText = "inwidget:drivefca:" + make + ":" +"credit-application:form:form-input-interaction";
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: { linkText: pageText,   thirdPartyToolProvider: "vehicle-reservation|Carzato"} });
                stat=0;
            }
            if (section == "autoLease") {
                linkText = "inwidget:credit-application:payment-options:lease";
                // navClickPosition = "Lease";
                navClick = 1;
            }
            if (section == "autoFinance") {
                linkText = "inwidget:credit-application:payment-options:finance";
                // navClickPosition = "Finance";
                navClick = 1;
            }
            if(section == 'merklemsrp'){
                pageText="inwidget:"+make+":leasecalc:msrp-tooltip" ; 
            }
            if(section == 'finaltimer'){
                virtual_page =1 ;
                pageText= "drivefca:"+dealerName+":us:credit-application:financing-review-confirmation";
                virtpageType = "credit-application:form";
                stat = 0;
            }


            if (navClick == 1) {
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "navClick", eventAction: "pageElementInteraction", attributes: { position: navClickPosition, linkText: linkText, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
            } else if (stat == 1) {
                pageText = pageText.replace(' - ', '-');
                pageText = pageText.replace(/\s+/g, '-');
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: { linkText: pageText, year: year, make: make, model: model, trim: trim, status: "new", thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
            } else if (ctaClick == 1) {
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "CTA", eventAction: "buttonClick", attributes: { linkText: pageText, year: year, make: make, model: model, trim: trim, status: "new", thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
            }
            if (virtual_page == 1) {
                DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: { virtPageName: pageText, virtPageType: virtpageType, thirdPartyToolProvider: "vehicle-reservation|Carzato" } });
            }
        }

    }

}
