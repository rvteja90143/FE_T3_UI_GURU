import{ DataHandler } from '../common/data-handler';
export class GoogleAnalyticsHandler {
    
    public static googleAnalyticsExecutor(section: any, position: any = '', sectiontab : string = '') {
                    
        var pageText,dealerName,linkText,navClickPosition,dealerCode,virtpageType ='';
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
        var model = DataHandler.model;
        var year = DataHandler.year;
        var trim = DataHandler.trim;
        var vin = DataHandler.vin;
        var dealerCode = DataHandler.dealer;
        var GASource 
        if(DataHandler.extraParameter == 'eprice'){
         GASource = 'E-price'
        } else{
         GASource = DataHandler.GASource;
        }
        
        
        var dealerName:any = null;
        var provider:any = null;
        var state:any = null;
        var zcode:any = null;
        var traffic:any = null;

        var textTail = "| New"+"-"+ year+"-"+ make+"-"+ model+"-"+ vin;
        

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
            traffic  = DataHandler.tier3_trafficType;
        
        if (model=='ram 1500') {
            model = model.split(" ").join("-").concat("-dt");
        }


        if (section == "page-load") {
            pageText = "DriveFCA:inwidget: make :" + model + ":" + year + ":new:us:vehicle-information";
            DataHandler.googleAnalyticsData[section]=({ "category": "eShop","cs":GASource ,"cm": "InWidget", "action": "Page View", "label": "Widget Start"  + textTail });
            stat = 0;
        }

        if (section == "trade-in-bb"){
            pageText = "Trade In" + textTail; 
            linkText = "Trade-In";
            virtpageType = "Trade-In";
            navClick = 1;
            virtual_page = 1;
        }
        if (section == "trade-in-kbb"){ 
            pageText = "Trade In-KBB" + textTail; 
            linkText = "Trade-In";
            virtpageType = "Trade-In";
            navClick = 1;
            virtual_page = 1;
        }

        if (section == "service-protection"){
            pageText = "Service and Protection" + textTail;   
            linkText = "Service-and-Protection";
            virtpageType = "Service and Protection";
            navClick = 1;
            virtual_page = 1;
        }

        if (section == "service-protection-finance")
            pageText = "Service and Protection Add:toggle-finance" + textTail;

        if (section == "service-protection-lease")
            pageText = "Service and Protection Add:toggle-lease" + textTail;
            
        if (section == "delivery-review-submit"){ 
            pageText = "Delivery Review and Submit" + textTail; 
            linkText = "Review-and-Submit";
            navClick = 1;
            virtpageType = "Review and Submit";
            virtual_page = 1;
        }

        if (section == "delivery-review-submit-lease")
            pageText = "vcard:inwidget:DriveFCA:us:Delivery, Review and Submit:toggle-lease";  
           
        if (section == "delivery-review-submit-finance")
            pageText = "vcard:inwidget:DriveFCA:us:Delivery, Review and Submit:toggle-finance";  

        if ( section == "Vehicle Personalization"){ 
            pageText = "DriveFCA:inwidget:" + make + ":"+ dealerName +":US:vehicle-personalization";  
            virtpageType = "Vehicle Personalization";
            linkText = "Vehicle-Personalization";
            navClick = 1;
            virtual_page = 1;
        }

        if ( section == "Vehicle Details"){
            linkText = "Vehicle-Details";
            navClick = 1;
            pageText = "Vehicle Information" + textTail;  
            virtpageType = "Vehicle Information";
            virtual_page = 1;
        }

        if ( section == "review-payment-options"){
            linkText = "Payment-Options"; 
            navClickPosition = "sidebar";
            navClick = 1;
        }
        if ( section == "Lease"){
            linkText = "Payment-Options:Lease";
            navClickPosition = "sidebar";
            navClick = 1;
            pageText =  'Payment Option Lease' + textTail; 
        }
        if ( section == "Finance"){
            linkText = "Payment-Options:Finance"; 
            navClickPosition = "sidebar";
            navClick = 1;
            pageText =  'Payment Option Finance' + textTail;  
        }
        if ( section == "Cash"){
            linkText = "Payment-Options:Cash"; 
            navClickPosition = "sidebar";
            navClick = 1;
            pageText =  'Payment Option Cash' + textTail; 
        }
        if ( section == "veh_expand"){
            linkText = "DriveFCA:inwidget:"+make + ":" + dealerName+ ":US:Vehicle-Expanded";
            navClickPosition = "topNav";
            navClick = 1;
        }
            
        if ( section == "photo-gallery" || section == "photo-gallery-open-popup"){ 
            linkText = "Gallery"; 
            navClickPosition = "sidebar";
            navClick = 1;
            pageText="Photo Gallery" + textTail;
        }
        if ( section == "test-drive"){
            linkText = "Test-Drive"; 
            navClickPosition = "sidebar";
            navClick = 1;
            pageText="Test Drive" + textTail;
        }
        if ( section == "test-drive-start") {
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop","cs":GASource ,"cm": "InWidget", "action": "Form Start", "label": "Test Drive " + textTail });
            stat = 0;
        }
    
        if ( section == "test-drive-end") { 
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop","cs":GASource ,"cm": "InWidget", "action": "Form Submit", "label": "Test Drive "+ textTail });
            stat = 0;
        }

        if ( section == "test-drive-invalid")
            pageText = "vcard:DriveFCA:test-drive-submission-failure";


        if ( section == "scheduled-delivery-start-date") {
            stat = 1;
            pageText = "Delivery Date" + textTail;  
        }

        if ( section == "scheduled-delivery-start-time") {
            stat = 1;
            pageText = "Delivery Time" + textTail; 
        }
    
        if ( section == "scheduled-delivery-end") { 
            pageText = "vcard:DriveFCA:scheduled-delivery-submission-success";
            //DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "submit", eventAction: "form", attributes: { formDescription: "lead", formType: pageText, displayType: "modal", displayFormat: "modal", leadId: MerkleHandler.generateFTID() } }); 
            stat = 0;
        }

        if ( section == "scheduled-delivery-invalid")
            pageText = "vcard:DriveFCA:scheduled-delivery-submission-failure";

        if ( section == "review-submit-start") {
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop","cs":GASource ,"cm": "InWidget",  "action": "Form Start", "label": "Submit to Dealer"+ textTail });
            stat = 0;
        }
        if(section == "apply-credit-start"){
            DataHandler.googleAnalyticsData[section]=({ "category": "eShop","cs":GASource ,"cm": "InWidget",  "action": "Form Start", "label": "Apply for credit start" + textTail });
            stat = 0;
        }
        if (section == "tradein-bb-start") {
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop","cs":GASource ,"cm": "InWidget",  "action": "click", "label": "Trade In" + textTail });
            stat = 0;
        }

        if (section == "tradein-btm" || section == "vehicledetails-btm" || section == "serviceandprotection-btm" || section == "tradeinprev-btm"|| section == "review-btm"|| section == "serviceandprotectionprev-btm") {
            pageText =  sectiontab + textTail;  
            navClick = 1;
            stat = 0;
        }
        
        if (section == "tradein-kbb-start") {
            // DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "start", eventAction: "form", attributes: { formDescription: "non-lead", formType: 'vendor trade in tool', displayType: "inPage", displayFormat: "iframe", tradeInProvider: 'KelleyBlackBook' } });
            stat = 0;
        }

        if (section == "tradein-kbb-submit") {
            // DataHandler.digitalData.newEvent({ type: "CustomTagEvent", eventName: "submit", eventAction: "form", attributes: { formDescription: "non-lead", formType: "vendor trade in tool", displayType: "inPage", displayFormat: "iframe", tradeInProvider: "KelleyBlackBook", tradeInVehicleYear: DataHandler.tradeinyear, tradeInVehicleMake: DataHandler.tradeinmake, tradeInVehicleModel: DataHandler.tradeinmodel, desiredVehicleYear: year, desiredVehicleMake: make, desiredVehicleModel: model } });
            stat = 0;
        }

        if ( section == "review-submit-start-first") {
            pageText = "drivefca:inwidget:" + make + ":"+ model + ":"+ year +":new:US:first-lead-submission";
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop","cs":GASource ,"cm": "InWidget",  "action": "Form Start", "label": "Initial popup first lead"+ textTail });
            stat = 0;
        }

        if ( section == "review-submit-end-first") { 
            pageText  = "drivefca:inwidget:" + make + ":"+ model + ":"+ year +":new:us:first-lead-submission";
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop","cs":GASource ,"cm": "InWidget",  "action": "Form Submit", "label": "Initial popup first lead" + textTail });
            stat = 0;
        }

        if (section == "review-submit-end") {
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop","cs":GASource ,"cm": "InWidget",  "action": "Form Submit", "label": "Submit to Dealer" + textTail });
            stat = 0;
        }

        if ( section == "review-submit-invalid")
            pageText = "vcard:DriveFCA:Delivery, Review and Submit-submission-failure";

    
        if ( section == "apply-credit-end") { 
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop","cs":GASource ,"cm": "InWidget",  "action": "Form Submit", "label": "Initial popup first lead" + textTail });
            stat = 0;
        }

        if ( section == "apply-credit-invalid")
            pageText = "vcard:DriveFCA:Apply-for-credit-failure";

        
        if ( section == "apply-credit-routone")
            pageText = "vcard:DriveFCA:Apply-for-credit:routone";

        if ( section == "apply-credit-dealertrack")
            pageText = "vcard:DriveFCA:Apply-for-credit:dealertrak";
    
        if ( section == "gallery-popup-close")
            pageText = "Photo Gallery Close"+ textTail;

        if ( section == "gallery-popup-carousel")
            pageText = "Photo Gallery Next-Previous"+ textTail;

        if(section == "view-available-offers-from-your-dealer")
            pageText = "inwidget:Payment-Options:"+ sectiontab +":view-available-offers-from-your-dealer";  
            
        if(section == "modal:initial-popup:how-itworks-link")
            pageText = "modal:initial-popup:how-itworks-link";

        if(section == "inwidget:vehicle-information:first-lead-submission-popup:close"){
            pageText = "Initial popup close initial lead cpature close"+ textTail;
        }
            
        if(section == "inwidget-Widget-Close")
            pageText = "Delivery Widget Close"+ textTail;

        if(section == "add-vehicle-accessories")
            pageText = sectiontab+textTail;

        if(section == "review-payment-option-discounts")
            pageText = "inwidget:Payment-Options:"+sectiontab;    

        if(section == "scheduledelivery-deliverylocation-select")
            pageText = sectiontab + textTail;
       
        if(section == "service-and-protection-accessories")
            pageText = "DriveFCA:inwidget:" + make + ":"+ model + ":"+ year +":US:"+ vin +":"+ dealerCode +":service-and-protection-accessories:"+sectiontab;
       
        if(section == "submit-to-dealer-button"){
            navClick = 1;
            navClickPosition = "bottomNav";
            pageText = "Submit to Dealer" + textTail; 
        }
        if ( section == "bottom-apply-credit"){
            pageText = "DriveFCA:inwidget:" + make + ":"+ dealerName +":US:finance";  
            linkText = "Apply-for-Credit"; 
            navClickPosition = "bottomNav";
            navClick = 1;
            virtpageType = "Finance";
            virtual_page = 1;
        }
        if(section == "submit-to-dealer-popup-close")
            pageText = "submit-to-dealer-popup-close";
        
        if(section == "submit-to-dealer-offers-popup-close")
            pageText = "submit-to-dealer-offers-popup-close";
        
        if(section == "apply-to-credit-popup-close")
            pageText = "Apply for credit close" + textTail;    
        
        if(section == "tax-and-fees"){
            if(position == 2){
               ctaClick = 1; 
               stat = 0;
            }else{
               stat = 1; 
            }
            pageText = sectiontab;
        }
        if(section == "payment-option-credit-range"){
            pageText = "t3:payment options modal:"+position+":credit range:tier "+sectiontab;
        }
        if(section == "service-and-protection-jeep-wave-program"){
            pageText = "t3:"+position+" plans:"+sectiontab;
        }
        if(section == "payment-option-term-duration"){
            pageText = "t3:payment options modal:"+position+":term duration:"+sectiontab;
        }
        if(section == "payment-option-annual-mileage"){
            pageText = "t3:payment options modal:"+position+":annual mileage:"+sectiontab;
        }
        
        if(section == "Delivery Review and Submit Lease Toggle"){
            pageText = "Delivery Review and Submit Lease Toggle"+textTail;
        }
        if(section == "Delivery Review and Submit Fiance Toggle"){
            pageText = "Delivery Review and Submit Finance Toggle"+textTail;
        }
        if(section == "Delivery Review and Submit Cash Toggle"){
            pageText = "Delivery Review and Submit Cash Toggle"+textTail;
        }
        if(section ==  "Service and Protection Lease Toggle"){
            pageText = "Service and Protection Lease Toggle"+textTail;
        }
        if(section ==  "Service and Protection Finance Toggle"){
            pageText = "Service and Protection Finance Toggle"+textTail;
        }
        if(section ==  "Service and Protection Cash Toggle"){
            pageText = "Service and Protection Cash Toggle"+textTail;
        }
        if(section ==  "Lease Service and Protection Add"){
            pageText = "Service and Protection Add"+textTail;
        }
        if(section ==  "Finance Service and Protection Add"){
            pageText = "Service and Protection Add"+textTail;
        }
        if(section ==  "Cash Service and Protection Add"){
            pageText = "Service and Protection Add"+textTail;
        }
        if(section ==  "accessories delivry page"){
            pageText = "Delivery Accessories"+textTail;
        }
        if(section ==  "accessories"){
            pageText = "Accessories"+textTail;
        }
        if(section ==  "accessories-btm"){
            pageText = "Bottom Nav Prev Accessories"+textTail;
        }
        if(section ==  "accessories-next-btm"){
            pageText = "Bottom Nav Next Accessories"+textTail;
        }

        if(section ==  "accessories-next-btm"){
            pageText = "Bottom Nav Next Accessories"+textTail;
        }


        ///GA GoalEvents Starts///

        if ( section == "Inital-Lead-GaGoal") { 
            // pageText  = "drivefca:inwidget:" + make + ":"+ model + ":"+ year +":new:us:first-lead-submission";
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop", "action": "GoalEvents", "label": "InitialLeadForm" , "value": "1","cs":GASource ,"cm": "InWidget"});
             stat = 0;
        }
        if ( section == "VehicleInformation-GaGoal") { 
            // pageText  = "drivefca:inwidget:" + make + ":"+ model + ":"+ year +":new:us:first-lead-submission";
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop", "action": "GoalEvents", "label": "VehicleInformation","value": "1","cs":GASource ,"cm": "InWidget" });
             stat = 0;
        }
        if ( section == "TradeInBB-GaGoal") { 
            // pageText  = "drivefca:inwidget:" + make + ":"+ model + ":"+ year +":new:us:first-lead-submission";
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop", "action": "GoalEvents", "label": "TradeIn","value": "1" ,"cs":GASource ,"cm": "InWidget"});
             stat = 0;
        }
        if ( section == "TradeInKBB-GaGoal") { 
            // pageText  = "drivefca:inwidget:" + make + ":"+ model + ":"+ year +":new:us:first-lead-submission";
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop", "action": "GoalEvents", "label": "TradeIn","value": "2","cs":GASource ,"cm": "InWidget" });
             stat = 0;
        }
        if ( section == "ServiceProtection-GaGoal") { 
            // pageText  = "drivefca:inwidget:" + make + ":"+ model + ":"+ year +":new:us:first-lead-submission";
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop", "action": "GoalEvents", "label": "ServiceProtection","value": "1","cs":GASource ,"cm": "InWidget" });
             stat = 0;
        }
        if ( section == "Accessories-GaGoal") { 
            // pageText  = "drivefca:inwidget:" + make + ":"+ model + ":"+ year +":new:us:first-lead-submission";
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop", "action": "GoalEvents", "label": "Accessories" ,"value": "1","cs":GASource ,"cm": "InWidget"});
             stat = 0;
        }
        if ( section == "DeliveryReview-GaGoal") { 
            // pageText  = "drivefca:inwidget:" + make + ":"+ model + ":"+ year +":new:us:first-lead-submission";
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop", "action": "GoalEvents", "label": "DeliveryReview" ,"value": "1","cs":GASource ,"cm": "InWidget"});
             stat = 0;
        }
        if ( section == "LeasePayment-GaGoal") { 
            // pageText  = "drivefca:inwidget:" + make + ":"+ model + ":"+ year +":new:us:first-lead-submission";
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop", "action": "GoalEvents", "label": "LeasePayment","value": "1" ,"cs":GASource ,"cm": "InWidget"});
             stat = 0;
        }
        if ( section == "FinancePayment-GaGoal") { 
            // pageText  = "drivefca:inwidget:" + make + ":"+ model + ":"+ year +":new:us:first-lead-submission";
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop", "action": "GoalEvents", "label": "FinancePayment","value": "1" ,"cs":GASource ,"cm": "InWidget"});
             stat = 0;
        }
        if ( section == "CashPayment-GaGoal") { 
            // pageText  = "drivefca:inwidget:" + make + ":"+ model + ":"+ year +":new:us:first-lead-submission";
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop", "action": "GoalEvents", "label": "CashPayment" ,"value": "1","cs":GASource ,"cm": "InWidget"});
             stat = 0;
        }

        if ( section == "ScheduleTestDrive-GaGoal") { 
            // pageText  = "drivefca:inwidget:" + make + ":"+ model + ":"+ year +":new:us:first-lead-submission";
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop", "action": "GoalEvents", "label": "ScheduleTestDrive" ,"value": "1","cs":GASource ,"cm": "InWidget"});
             stat = 0;
        }

        if ( section == "ScheduleDelivery-GaGoal") { 
            // pageText  = "drivefca:inwidget:" + make + ":"+ model + ":"+ year +":new:us:first-lead-submission";
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop", "action": "GoalEvents", "label": "ScheduleDelivery" ,"value": "1","cs":GASource ,"cm": "InWidget"});
             stat = 0;
        }

        if ( section == "PhotoGallery-GaGoal") { 
            // pageText  = "drivefca:inwidget:" + make + ":"+ model + ":"+ year +":new:us:first-lead-submission";
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop", "action": "GoalEvents", "label": "PhotoGallery" ,"value": "1","cs":GASource ,"cm": "InWidget"});
             stat = 0;
        }

        if ( section == "ReserveNow-GaGoal") { 
            // pageText  = "drivefca:inwidget:" + make + ":"+ model + ":"+ year +":new:us:first-lead-submission";
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop", "action": "GoalEvents", "label": "ReserveNow","value": "1","cs":GASource ,"cm": "InWidget" });
             stat = 0;
        }

        if ( section == "ApplyForCreditDT-GaGoal") { 
            // pageText  = "drivefca:inwidget:" + make + ":"+ model + ":"+ year +":new:us:first-lead-submission";
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop", "action": "GoalEvents", "label": "ApplyForCredit","value": "1" ,"cs":GASource ,"cm": "InWidget"});
             stat = 0;
        }

        if ( section == "ApplyForCreditRone-GaGoal") { 
            // pageText  = "drivefca:inwidget:" + make + ":"+ model + ":"+ year +":new:us:first-lead-submission";
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop", "action": "GoalEvents", "label": "ApplyForCredit","value": "2","cs":GASource ,"cm": "InWidget" });
             stat = 0;
        }

        if ( section == "ApplyForCreditAutofi-GaGoal") { 
            // pageText  = "drivefca:inwidget:" + make + ":"+ model + ":"+ year +":new:us:first-lead-submission";
            DataHandler.googleAnalyticsData[section] = ({ "category": "eShop", "action": "GoalEvents", "label": "ApplyForCredit","value": "3" ,"cs":GASource ,"cm": "InWidget"});
             stat = 0;
        }


        ///GA GoalEvents Ends///

		if(navClick == 1){
            DataHandler.googleAnalyticsData[section]=({ "category": "eShop", "action": "Click", "label": pageText ,"cs":GASource ,"cm": "InWidget"});
        }else if (stat == 1){ 
            DataHandler.googleAnalyticsData[section]=({ "category": "eShop", "action": "Click", "label": pageText ,"cs":GASource ,"cm": "InWidget"});
            // DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "linkclick", eventAction: "linkClick", attributes: {linkText : pageText , year: year , make:make , model: model , trim: trim , status: "new"}});    
        } else if(ctaClick == 1){
            // DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "CTA", eventAction: "buttonClick", attributes: {linkText : pageText , year: year , make:make , model: model , trim: trim , status: "new"}});   
        }  
        if(virtual_page == 1){
            // DataHandler.digitalData.newEvent({type: "CustomTagEvent", eventName: "JSvirtualPageView", eventAction: "contentView", attributes: {virtPageName: pageText, virtPageType: virtpageType}});
        }
    }
 
}
