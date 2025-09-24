import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { DataHandler } from '../common/data-handler';
import { ShiftDigitalHandler } from '../common/shift-digital';
import { MerkleHandler } from '../common/merkle-handler';
import { GA4Service } from '../services/ga4.service';
import { GoogleAnalyticsHandler } from '../common/googleanalytics-handler';
import { GA4Handler } from '../common/ga4-handler';
import { GA4DealerService } from '../services/ga4dealer.service';
import { EventEmitterService } from '../event-emitter.service';
import { AdobeSDGHandler } from '../services/adobesdg.handler';

@Component({
    selector: 'app-trade-in',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './trade-in.component.html',
    styleUrl: './trade-in.component.scss'
})
export class TradeInComponent {
    @Input() tradeinpar!: string;
    kbbURL: any;
    loaded = 0;

    vehicle: string = '';
    style: string = '';
    mileage: string = '';
    zip: string = '';
    condition: string = '';
    options: any = '';
    tradein: string = '';
    tradein_adj: string = '';

    kbbyear: any = "";
    kbbmake: any = "";
    kbbmodel: any = "";
    kbbseries: any = "";
    kbbstyle: any = "";
    kbbmileage: any = "";
    kbbzip: any = "";
    kbbcondition: any = "";
    kbboptions: any = "";
    kbbprice: any = "";
    kbbtradein_value: any = "";
    kbbremainingvalue: any = "";



    constructor(private sanitizer: DomSanitizer, private renderer: Renderer2, private el: ElementRef, private ga4Service: GA4Service, private ga4dealerService: GA4DealerService, private eventEmitterService: EventEmitterService) {
        this.kbbURL = this.sanitizer.bypassSecurityTrustResourceUrl('https://tradeinadvisor.kbb.com/app?apiKey=' + environment.KBB_APP_KEY);

        if (window.addEventListener) {  //ifram-events reading
            window.addEventListener("message", this.receiveMessage.bind(this), false);
        }
        else {
            (<any>window).attachEvent("onmessage", this.receiveMessage.bind(this));
        }
        DataHandler.shifttradeinstart =0;
        DataHandler.shiftdigitalbb =0;
        DataHandler.shiftdigitalkbb =0;
    }
    ngOnInit(){
        DataHandler.shifttradeinstart =0;
        DataHandler.shiftdigitalbb =0;
        DataHandler.shiftdigitalkbb =0;
    }
    ngAfterViewInit() {        
        if (this.tradeinpar === 'bb') {
            this.preloadBBScript();
            this.initializebb();
            MerkleHandler.merkleexecutor("trade-in-bb", 1);
            GoogleAnalyticsHandler.googleAnalyticsExecutor("trade-in-bb", 1);
            GoogleAnalyticsHandler.googleAnalyticsExecutor('TradeInBB-GaGoal');
            GA4Handler.ga4VirtualPageView('TradeInBB');
            this.ga4Service.submit_to_api('TradeInBB', '', '', '', '', '', '').subscribe((response) => { });
            this.ga4Service.submit_to_api('TradeInBBnew', '', '', '', '', '', 'Trade In').subscribe((response) => { });
            // this.ga4dealerService.submit_to_api_ga4dealer('TradeInBB').subscribe((response: any) => {});
            // this.ga4dealerService.submit_to_api_ga4dealer('TradeInPageView').subscribe((response: any) => {});

            this.ga4dealerService.fire_asc_events('TradeInBB').subscribe((response: any) => { });
            this.ga4dealerService.fire_asc_events('TradeInPageView').subscribe((response: any) => { });
        } else if (this.tradeinpar === 'kbb') {
            // Handle KBB case if needed
            MerkleHandler.merkleexecutor('tradein-kbb-start', '');
            GA4Handler.ga4VirtualPageView('TradeInkbb');
            GoogleAnalyticsHandler.googleAnalyticsExecutor('tradein-kbb-start', 1);
            GoogleAnalyticsHandler.googleAnalyticsExecutor('tradein-kbb-start', '');
            GoogleAnalyticsHandler.googleAnalyticsExecutor('TradeInKBB-GaGoal');
            this.ga4Service.submit_to_api('TradeInKBB', '', '', '', '', '', '').subscribe((response) => { });
            this.ga4Service.submit_to_api('TradeInKBBnew', '', '', '', '', '', 'Trade In').subscribe((response) => { });
            // this.ga4dealerService.submit_to_api_ga4dealer('TradeInKBB').subscribe((response: any) => {});
            // this.ga4dealerService.submit_to_api_ga4dealer('TradeInPageView').subscribe((response: any) => {});

            this.ga4dealerService.fire_asc_events('TradeInKBB').subscribe((response: any) => { });
            this.ga4dealerService.fire_asc_events('TradeInPageView').subscribe((response: any) => { });

        }
    }

    preloadBBScript() {
        if (!document.getElementById('bb-preload-script')) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'script';
            link.href = 'https://app.blackbookinformation.com/app/shopping-tools-js/v1.js';
            link.id = 'bb-preload-script';
            document.head.appendChild(link);
        }
    }

    public initializebb() {
        if (this.loaded == 0) {
            this.loadScript('https://app.blackbookinformation.com/app/shopping-tools-js/v1.js')
                .then(() => {
                    this.loadScriptContent('var shoppingTools = _shoppingTools({ elementId: "OreTradeIn", appUrl: "https://app.blackbookinformation.com", dealerid: "10150001" });shoppingTools.listen(function(data) {  });');
                });
            this.loaded = 1;
        }

    }

    tradeinbb() {
        if (this.tradeinpar === 'bb') {
            this.ga4dealerService.submit_to_api_ga4dealer('TradeInBB').subscribe((response: any) => { });
        }
        if (this.tradeinpar === 'kbb') {
            this.ga4dealerService.submit_to_api_ga4dealer('TradeInKBB').subscribe((response: any) => { });
        }
    }

    public loadScript(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const script = this.renderer.createElement('script');
            script.src = url;
            script.async = false;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = () => reject();
            this.renderer.appendChild(this.el.nativeElement, script);
        });
    }

    public loadScriptContent(content: string) {
        const script = this.renderer.createElement('script');
        script.textContent = content;
        script.async = false;
        script.defer = true;
        this.renderer.appendChild(this.el.nativeElement, script);
    }

    public adobe_sdg_event(event_type: any, param: any = '', param1: any = '') {
       // console.log('TradeInComponent-', event_type);
        try {
            const formSubmit = { ...DataHandler.SDGEvents.formSubmit };
            const formStart = { ...DataHandler.SDGEvents.formStart };
            const errorDisplay = { ...DataHandler.SDGEvents.errorDisplay };

            formStart.formType = "trade-in:" + param;
            formStart.formDescription = "non-lead";
            formStart.displayType = "page";
            formStart.displayFormat = "iframe";
            formStart.tradeInProvider = param;

            formSubmit.formType = "trade-in:" + param;
            formSubmit.formDescription = "non-lead";
            formSubmit.displayType = "page";
            formSubmit.displayFormat = "iframe";
            formSubmit.tradeInProvider = param;

            if (event_type == 'form-start') {
                AdobeSDGHandler.eventLogger("form-start", formStart);
                return;
            }
            if (event_type == 'form-submit') {
                AdobeSDGHandler.eventLogger("form-submit", formSubmit);
                return;
            }
            if (event_type == 'error-display') {
                errorDisplay.message = param;
                errorDisplay.type = param1;
                AdobeSDGHandler.eventLogger("error-display", errorDisplay);
                return;
            }
        } catch (e) {
            console.log('TradeInComponent-adobe_sdg_event issue', e);
        }
    }

    receiveMessage: any = (event: any) => {
        if (event.data.eventName == "pageLoaded") {
        }
 
        if (event.data.eventName == "formSubmitted" && event.data.pageId == 1) {
            MerkleHandler.merkleexecutor('tradein-bb-start', '');
            if (DataHandler.shifttradeinstart == 0) {
                 DataHandler.shifttradeinstart = 1;
                 DataHandler.shiftdigitalbb = 0;
                ShiftDigitalHandler.shiftdigitalexecutor('tradein start');
                this.adobe_sdg_event('form-start', 'blackbook');
                this.ga4Service.submit_to_api('TradeInBB', '', '', '', '', '', '').subscribe((response) => { });
            }
            this.vehicle = event.data.data[0].year + " " + event.data.data[0].make + " " + event.data.data[0].model + " " + event.data.data[0].series
            this.style = event.data.data[0].style;
            this.mileage = event.data.data[0].mileage;
            this.zip = event.data.data[0].zip;
            this.condition = event.data.data[0].condition;

            DataHandler.tradeinmake = event.data.data[0].make;
            DataHandler.tradeinmodel = event.data.data[0].model;
            DataHandler.tradeinseries = event.data.data[0].series;
            DataHandler.tradeinyear = event.data.data[0].year;
            DataHandler.tradeinstyle = event.data.data[0].style;
            DataHandler.tradeinzip = event.data.data[0].zip;
            DataHandler.tradeinmileage = event.data.data[0].mileage;
            DataHandler.tradeincondition = event.data.data[0].condition;

        }

        //Storing step 2 data
        if (event.data.eventName == "formSubmitted" && event.data.pageId == 2) {
            this.options = event.data.data;
            DataHandler.tradeinoptions = event.data.data;
        }

        //Storing step 3 Price and sending ajax
        if (event.data.eventName == "formSubmitted" && event.data.pageId == 5 && event.data.step == 0) {
            this.tradein = event.data.data[0].results.price;
            this.tradein_adj = event.data.data[0].Remainingvalue;

            DataHandler.tradeinvalue = this.tradein;
            DataHandler.tradeinadjvalue = this.tradein_adj;

            if (this.tradein_adj == '0' || this.tradein_adj == '') {
                this.tradein_adj = (this.tradein);
                DataHandler.tradeinadjvalue = this.tradein_adj;
            }
            // this.eventEmitterService.populatetradein(this.tradein);

        }

        //Storing step 4 Remainingvalue
        if (event.data.eventName == "formSubmitted" && event.data.pageId == 5 && event.data.step == 1) {
            if (DataHandler.shiftdigitalbb == 0) {
                ShiftDigitalHandler.shiftdigitalexecutor('tradein bb submit');
                this.adobe_sdg_event('form-submit', 'blackbook');
                DataHandler.shiftdigitalbb = 1;
                DataHandler.shifttradeinstart = 0;
            }
            MerkleHandler.merkleexecutor('tradein-bb-submit', '');
            this.tradein_adj = event.data.data[0].RemainingValue;
            DataHandler.tradeinadjvalue = this.tradein_adj;

            if (this.tradein_adj == '0') {
                this.tradein_adj = (this.tradein);
                DataHandler.tradeinadjvalue = this.tradein_adj;
            }
            DataHandler.tradeinamount = Number(event.data.data[0].svtPrice);
            DataHandler.tradeinpayoff = DataHandler.tradeinamount - Number(DataHandler.tradeinadjvalue);
            this.eventEmitterService.populatetradein(this.tradein_adj);
            // this.show = 1;
        }

        if (event?.data?.data?.eventCategory === "tradeInFormSubmission" && this.tradeinpar === 'kbb') {
            this.adobe_sdg_event('form-start', 'kbb');
        }

        //storing the KBB details if present
        if (event.data["KBB_Trade-In_Advisor_Event"] != undefined) {

            if (event.data["KBB_Trade-In_Advisor_Event"]["event"] == "Trade-In Report Generated") {
                if (DataHandler.shiftdigitalkbb == 0) {
                    ShiftDigitalHandler.shiftdigitalexecutor('tradein kbb submit');
                    this.adobe_sdg_event('form-submit', 'kbb');
                    DataHandler.shiftdigitalkbb = 1;
                }
                MerkleHandler.merkleexecutor('tradein-kbb-submit', '', '');
                var kbb_data = event.data["KBB_Trade-In_Advisor_Event"];

                this.kbbyear = kbb_data["tradein_year"];
                this.kbbmake = kbb_data["tradein_make"];
                this.kbbmodel = kbb_data["tradein_model"];
                this.kbbseries = "";
                this.kbbstyle = kbb_data["tradein_style"];
                this.kbbmileage = kbb_data["tradein_mileage"];
                this.kbbzip = kbb_data["tradein_zip_code"];
                this.kbbcondition = kbb_data["tradein_condition"];

                if (kbb_data["tradein_options"] != "") {
                    var strval = kbb_data["tradein_options"]
                    var myarr = strval.split("|");
                    this.kbboptions = myarr;
                }

                this.kbbprice = kbb_data["kbb_tradein_value"];
                this.kbbtradein_value = kbb_data["kbb_tradein_value"];
                this.kbbremainingvalue = "0";

                this.tradein = this.kbbtradein_value;
                this.vehicle = kbb_data["tradein_year"] + " " + kbb_data["tradein_make"] + " " + kbb_data["tradein_model"];
                this.style = kbb_data["tradein_style"];
                this.mileage = kbb_data["tradein_mileage"];
                this.tradein_adj = kbb_data["kbb_tradein_value"];
                this.options = this.kbboptions;

                DataHandler.tradeinmake = kbb_data["tradein_make"];
                DataHandler.tradeinmodel = kbb_data["tradein_model"];
                DataHandler.tradeinseries = "";
                DataHandler.tradeinyear = kbb_data["tradein_year"];
                DataHandler.tradeinstyle = kbb_data["tradein_style"];
                DataHandler.tradeinzip = kbb_data["tradein_zip_code"];
                DataHandler.tradeinmileage = kbb_data["tradein_mileage"];
                DataHandler.tradeincondition = kbb_data["tradein_condition"];
                DataHandler.tradeinoptions = this.kbboptions;

                DataHandler.tradeinvalue = kbb_data["kbb_tradein_value"];
                DataHandler.tradeinadjvalue = kbb_data["kbb_tradein_value"];

                this.eventEmitterService.populatetradein(this.kbbtradein_value);
                // this.show = 1;
            }
        }

    }



}
