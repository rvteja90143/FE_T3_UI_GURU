import { Component, Renderer2, Inject, LOCALE_ID, Input, ChangeDetectorRef, input } from '@angular/core';
import { EventEmitterService } from '../event-emitter.service';
import { ShiftDigitalHandler } from '../common/shift-digital';
import { HttpParams } from '@angular/common/http';
import { GA4Service } from '../services/ga4.service';
import { FormControl } from '@angular/forms';
import { MerkleHandler } from '../common/merkle-handler';
import { formatNumber } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DataHandler } from '../common/data-handler';
import { MaterialModule } from '../material/material.module';
import { distinctUntilChanged, Subject, Subscription, take, takeUntil, zip } from 'rxjs';
import { getLeaseDetailsState } from '../common/store/lease-details/lease-details-selector';
import { Store, select } from '@ngrx/store';
import { cashDetails, financeDetail, leaseDatails } from '../common/data-models';
import { leaseDetailAction } from '../common/store/lease-details/lease-details-action';
import { financeDetailAction } from '../common/store/finance-details/finance-details-action';
import { getFinanceDetailsState } from '../common/store/finance-details/finance-details-selector';
import { getCashDetailsState } from '../common/store/cash-details/cash-details-selector';
import { cashDetailAction } from '../common/store/cash-details/cash-details-action';
import { GoogleAnalyticsHandler } from '../common/googleanalytics-handler';
import { GA4DealerService } from '../services/ga4dealer.service';
import { ObservableLiveData } from '../common/observable-live-data';
import { RestService } from '../services/rest.service';
import { MatCardModule } from '@angular/material/card';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { AdobeSDGHandler } from '../services/adobesdg.handler';
import { SharedService } from '../shared.service';
import $ from 'jquery';

@Component({
    selector: 'app-payment-calculator',
    standalone: true,
    imports: [MaterialModule, MatCardModule, MatSelectModule],
    templateUrl: './payment-calculator.component.html',
    styleUrl: './payment-calculator.component.scss'
})
export class PaymentCalculatorComponent {
    @Input() vin!: any;
    @Input() dealer!: any;
    @Input() zipcode!: any;
    @Input() title!: any;
    @Input() hideCash: any;


    lease_insentiveids:any

    isChipListDisabled: boolean = false;
    isChipListDisabledFinance: boolean = false;

    minimumDownPercent: any
    showleasedownpaymenterror =  false
    showfinancedownpaymenterror =  false
    error: any = 0;
    enable: any = 0;
    customerzipcode: any = "";
    customerstate: any = "";
    customercitycounty: any = "";
    selectimage: any;
    leasetier: string = '1';
    financetier: string = '1';
    leasedetails: any;
    listingdata: Array<any> = [];
    incentivedata: Array<any> = [];
    conditionaldata: Array<any> = [];
    discountdata: Array<any> = [];
    incentivetotal: any = 0;
    conditionaltotal: any = 0;
    discounttotal: any;
    dlr_accessories: any;
    totallease: any = 0;
    msrp: any;
    msrp_vin_details: any;
    defaultterm: any;
    defualtmileage: any;
    capitalizedcost: any;
    capitalizedcostxdiscount: any;
    monthlycost: any;
    leasedownpayment: any;
    leasedownpayment_disp: any;
    leasedownpaymentper: any;
    leasetradein: any;
    leaseupfits: any;
    leaseupfitstype: any;
    leaseupfitslabel: any;
    leaseupfitamount: any;
    leasedownpay :any;

    leaseupfitflag: any = 0;
    leasemsrpdisclaimer: any;
    leaseupfitsdisclaimer: any;
    leasetaxdetails: any;
    leasemonthlytaxes: any;
    leaseupfronttaxes: any;
    leaseupfrontfees: any;
    leaseserviceprotection: any = [];
    leasetaxfeestotal: any;
    leasetfdisclaimertext: any;
    leasetfdisclaimertextwithouttaxesandfee: any;
    leasepaymentmode: any;
    leasedueatsigningval: any;
    leasemonthlytaxesval: any;
    leaseAmountForDisplay: any;
    msrp_finance: any;
    msrp_vin_details_finance: any;
    financeflag: any;
    financedetails: any;
    defaultfinanceterm: any;
    financeapr: any;
    financecapitalizedcost: any;
    financecapitalizedcostxdiscount: any;
    financemonthlycost: any;
    financedownpayment: any;
    financedownpayment_disp: any;
    financedownpaymentper: any;
    financetradein: any;
    financeupfits: any;
    financeupfitstype: any;
    financeupfitslabel: any;
    financeupfitamount: any;
    financeupfitflag: any = 0;
    financemsrpdisclaimer: any;
    financeupfitsdisclaimer: any;
    financetaxdetails: any;
    financefeesdetails: any;
    financeserviceprotection: any;
    financedisclaimertext: any;
    financedisclaimertextwithouttaxesandfee: any;
    financetaxfeestotal: any;
    financeincentivedata: Array<any> = [];
    financeincentivedataToShow: Array<any> = [];
    financeconditionaldata: Array<any> = [];
    financediscountdata: Array<any> = [];
    financeincentivetotal: any = 0;
    financeconditionaltotal: any = 0;
    financediscounttotal: any;
    finance_dlr_accessories: any;
    totalfinance: any;
    financedueatsigningval: any;
    msrp_cash: any;
    msrp_vin_details_cash: any;
    cashflag: any;
    cashdetails: any;
    cashmonthlycost: any;
    cashmonthlycostxdiscount: any;
    cashtradein: any;
    cashupfits: any;
    cashupfitstype: any;
    cashupfitslabel: any;
    cashupfitamount: any;
    cashupfitflag: any = 0;
    cashmsrpdisclaimer: any;
    cashupfitsdisclaimer: any;
    cashtaxdetails: any;
    cashfeesdetails: any;
    cashserviceprotection: any;
    cashdisclaimertext: any;
    cashdisclaimertextwithouttaxesandfee: any;
    cashtaxfeestotal: any;
    cashincentivedata: Array<any> = [];
    cashconditionaldata: Array<any> = [];
    cashdiscountdata: Array<any> = [];
    cashincentivetotal: any = 0;
    cashconditionaltotal: any = 0;
    cashdiscounttotal: any;
    cash_dlr_accessories: any;
    totalcash: any;
    calculatorsource = DataHandler.make_url;
    viewoffer = DataHandler.viewoffer;
    lease_lock = 0;
    finance_lock = 0;
    cash_lock = 0;
    selected = new FormControl(0);
    leaserange: any;
    financerange: any;
    leaserangearr: any = [];
    financerangearr: any;
    hideConditionalOffter: any;
    hideConditionalOffterCash : any
    hideConditionalOffterfinance = true
    incentiveUserSelected: any;
    applyCreditDisable: any;
    alstDesc: any = '';
    taxesEnable: any = 'N';
    feesEnable: any = 'N';
    taxesFinEnable: any = 'N';
    feesFinEnable: any = 'N';
    progs: any = [];
    leaseoffer: any = 0;
    financeoffer: any = 0;
    cashoffer: any = 0;
    vinToDisplay: any;
    subventedProgramStatus: any;
    nonSubventedProgramStatus: any;
    lowestType: any;
    isNonSubvented: boolean = false;

    has_vauto_dlr_disc: any;
    dealer_price_finance: any;
    hideEstimator = false;
    dealer_price_cash: any;
    has_max_digital_dlr_disc: any;
    has_ferrario_dlr_disc: any;
    ferrario_list_price: any;
    ferrario_vin: any;
    finance_has_ferrario_dlr_disc: any;
    finance_ferrario_list_price: any;
    cash_has_ferrario_dlr_disc: any;
    cash_ferrario_list_price: any;
    vauto_list_price: any;
    vauto_upfit: any;
    vauto_price_wo_incentive: any;
    max_list_price: any;
    vin_msrp: any;
    finance_has_vauto_dlr_disc: any;
    finance_has_max_digital_dlr_disc: any;
    finance_vauto_list_price: any;
    finance_vauto_upfit: any;
    finance_vauto_price_wo_incentive: any;
    finance_max_list_price: any;
    finance_vin_msrp: any;
    cash_has_vauto_dlr_disc: any;
    cash_has_max_digital_dlr_disc: any;
    cash_vauto_list_price: any;
    adprice: any;
    cash_vauto_upfit: any;
    cash_vauto_price_wo_incentive: any;
    cash_max_list_price: any;
    cash_vin_msrp: any;
    isActive: boolean = false;
    selectedIndex = 0;
    year: any;
    make: any;
    isTermChanged: any;
    dealercode: any;
    leasetfdisclaimerlabel: any;
    financedisclaimerlabel: any;
    disableTab: string = '';
    disableLeaseTab: string = '';
    shiftdigitalshow: any = 0;
    payload_mopar_accessries: any;
    mopar_accessries_total: any;
    finance_payload_mopar_accessries: any;
    finance_mopar_accessries_total: any;
    cash_payload_mopar_accessries: any;
    cash_mopar_accessries_total: any;
    activeTab: any;
    snpTotal: any = 0;
    snpFTotal: any = 0;
    snpCTotal: any = 0;
    conditionalLeaseDataToShow: any = [];
    conditionalFinanceDataToShow: any = [];
    conditionalCashDataToShow: any = [];
    timeout: any;
    LeaseGoalGAFirstTime: any = 0;
    FinanceGoalGAFirstTime: any = 0;
    CashGoalGAFirstTime: any = 0;
    showFullDescriptionlease = true;
    showFullDescriptionfinance = true;
    showFullDescriptioncash = true;
    isLeaseLoadedAutofi: boolean = false;
    isFinanceLoadedAutofi: boolean = false;
    isCashLoadedAutofi: boolean = false;
    private_offer_refresh: boolean = false;
    customeplan: any;
    financeamountwithSandP: any;
    financeamountwithSandP_taxesandfeedisable: any;
    cashamountwithSandP: any;
    financedueatSandP: any;
    currentdate: any;
    cashamountwithSandPTotal: any;
    custome_added_plan: any;
    monthlycostSandPTotal: any;
    financeIncentiveReset: any = false;
    msrp_strikeoff_enable: any;
    finance_msrp_strikeoff_enable: any;
    cash_msrp_strikeoff_enable: any;
    downPaymentChanged: boolean = false;
    termUpdateCallApi = false;
    displayterm: any;
    has_homenet_dlr_disc: any;
    homenet_cache: any;
    homenet_incentive_check: any;
    homenet_dealer_discount_check: any;
    is_homenet_vin: any;
    homenet: any;
    homenet_list_price: any;
    finance_has_homenet_dlr_disc: any;
    finance_homenet_list_price: any;
    homenet_market_adjustment_cost_finance: any;
    homenet_market_adjustment_cost_cash: any;
    cash_has_homenet_dlr_disc: any;
    cash_homenet_list_price: any;
    isDealerDiscountBoldVisible: boolean = true;
    isDealerDiscountNormalVisible: boolean = true;
    sfsorccap_APRRate: boolean = false;
    dealersetting_APRRate: boolean = false;
    lenderValue: string = '';

    is_vauto_vin: any;
    price_display_type: any;
    lease_msrp: any;
    lease_listprice: any;

    finance_listprice: any;
    finance_msrp: any;

    isLoading: boolean = false;
    stack: any;
    customstrike!: boolean;
    customStrike!: boolean;
    isMobileScreen: boolean | undefined;
    vehicle_type: string;
    vehicleInfo: any;
    dealerInfo: any;
    display_vehicle_name: string | undefined;
    countycity: any = [];
    currentSession: any;
    public unsubscribe$: Subject<void> = new Subject<void>();
    public unsubscribefinance$: Subject<void> = new Subject<void>();
    public unsubscribecash$: Subject<void> = new Subject<void>();
    leaseDetails: any | undefined;
    financeDetails: any | undefined;
    cashDetails: any | undefined;
    dealerprice: any = 0;
    lenderCode: any = 'US-169';
    countycitylist: any;
    selectedCountyCity: any;
    subVar: Subscription | undefined
    financesubVar: Subscription | undefined
    cashsubVar: Subscription | undefined
    tradeVar: Subscription | undefined
    leaseResponseAvailable: boolean = true
    finaceResponseAvailable: boolean = true
    loaderImage: boolean = false;
    paymentType: string = '';
    apr_rate_subvented: any;
    dealerAprProgramStatus: any;
    lender_program_name_subvented: any;
    lender_programType_subvented: any;
    apr_rate_nonsubvented: any;
    lender_program_name_nonsubvented: any;
    lender_programType_nonsubvented: any;
    financeaprthirdparty: any = '';
    lease_lender_program_name_subvented: any;
    lease_lender_programType_subvented: any;
    lease_apr_rate_subvented: any;
    lease_lender_program_name_nonsubvented: any;
    lease_lender_programType_nonsubvented: any;
    lease_apr_rate_nonsubvented: any;
    lease_lender_program_name_dealerdefine: any;
    lease_lender_programType_dealerdefine: any;

    lease_apr_rate_dealerdefine: any
    finance_rate_interest_used: any;
    public financeaprradio: any = 'defaultapr';
    public default_apr_rate: any;
    is_autoNation_vin: any;
    autoNation_listPrice: any;
    autoNation_upfits: any;
    Lease_priceDispalyType: any;
    finance_priceDispalyType: any;
    is_autoNationFinance_vin: any;
    autoNation_FinancelistPrice: any;
    autoNationFinance_upfits: any;
    is_autoNationCash_vin: any;
    autoNation_CashlistPrice: any;
    autoNationCash_upfits: any;

    is_homenet_vin_finance: any;
    homenet_market_adjustment_cost: any
    is_homenet_incentives: any

    is_homenet_vin_cash: any;
     homenet_lease_vin:any;
     dat_leaseupfitsdisclaimer:any;
    dat_financeupfitsdisclaimer:any;
    dat_cashupfitsdisclaimer:any;
     autoNationCash_listPrice: any;
     autoNationFinance_listPrice: any;
    lenderProgramDetails  :any;
   
 
    
    



    ngOnDestroy() {
        if (this.subVar) {
            this.subVar.unsubscribe();
        }
        if (this.financesubVar) {
            this.financesubVar.unsubscribe();
        }
        if (this.cashsubVar) {
            this.cashsubVar.unsubscribe();
        }
        if (this.tradeVar) {
            this.tradeVar.unsubscribe();
        }

        this.unsubscribe$.next();
        this.unsubscribe$.complete();

        this.unsubscribefinance$.next();
        this.unsubscribefinance$.complete();

        this.unsubscribecash$.next();
        this.unsubscribecash$.complete();

    }

    constructor(@Inject(LOCALE_ID) private locale: string, private renderer: Renderer2, private ga4Service: GA4Service, private ga4dealerService: GA4DealerService, private restService: RestService, private cdr: ChangeDetectorRef, private eventEmitterService: EventEmitterService, public dialog: MatDialog, private store: Store<any>, private observableService: ObservableLiveData, private sharedService: SharedService) {
        this.isMobileScreen = DataHandler.isMobileScreen;
        this.dealercode = DataHandler.dealercode;
        this.vin = DataHandler.vin;
        this.zipcode = DataHandler.zipcode;
        DataHandler.dealerzip = this.zipcode;

        this.vehicle_type = DataHandler.vehicle_type;
        this.make = DataHandler.make?.toLowerCase();
        this.alstDesc = DataHandler.alstDesc;
        this.msrp = 0;
        this.financeflag = 0;
        this.cashflag = 0;
        this.applyCreditDisable = false;
        this.dealercode = DataHandler.dealer;
        setTimeout(() => {
            this.make = DataHandler.make?.toUpperCase();
            if (this.make == 'JEEP') {
                this.selectimage = "https://d1jougtdqdwy1v.cloudfront.net/images/brand-icons/payment_select_jeep.svg";
            } else if (this.make == 'RAM') {
                this.selectimage = "https://d1jougtdqdwy1v.cloudfront.net/images/brand-icons/payment_select_ram.svg";
            } else if (this.make == 'FIAT') {
                this.selectimage = "https://d1jougtdqdwy1v.cloudfront.net/images/brand-icons/payment_select_fiat.svg";
            } else if (this.make == 'DODGE') {
                this.selectimage = "https://d1jougtdqdwy1v.cloudfront.net/images/brand-icons/payment_select_dodge.svg";
            } else if (this.make == 'CHRYSLER') {
                this.selectimage = "https://d1jougtdqdwy1v.cloudfront.net/images/brand-icons/payment_select_chrysler.svg";
            } else if (this.make == 'ALFA ROMEO') {
                this.selectimage = "https://d1jougtdqdwy1v.cloudfront.net/images/brand-icons/payment_select_alfa.svg";
            } else if (this.make == 'WAGONEER') {
                this.selectimage = "https://d1jougtdqdwy1v.cloudfront.net/images/brand-icons/payment_select_wagoneer.svg";
            }
        }, 2000);

        if ((this.eventEmitterService.subsVar == undefined) || (this.eventEmitterService.subsVar != undefined)) {

            this.tradeVar = this.eventEmitterService.
                invoketradeinpopulateFunction.subscribe((param: string) => {
                    DataHandler.leasetradein = DataHandler.financetradein = DataHandler.cashtradein = param;
                    this.leasetradein = formatNumber(Number(param), this.locale, '1.0-0');
                    this.financetradein = formatNumber(Number(param), this.locale, '1.0-0');
                    this.cashtradein = formatNumber(Number(param), this.locale, '1.0-0');

                    if (Number(param) > this.msrp) {
                        this.leasedownpayment = 0;
                        this.leasedownpayment_disp = 0;
                        this.leasedownpaymentper = 0;
                        this.financedownpayment = 0;
                        this.financedownpayment_disp = 0;
                        this.financedownpaymentper = 0;
                    }
                    this.onCheckboxChange_lease('', 1, 0, 'tradein-ui');
                    if (this.incentiveUserSelected) {
                        this.onCheckboxChange_finance('', 3, 0, 'tradein-ui');
                    } else {
                        this.onCheckboxChange_finance('', 1, 0, 'tradein-ui');
                    }
                    this.onCheckboxChange_cash('');
                });

            this.eventEmitterService.subsVar = this.eventEmitterService.
                invokedisableviewoffer.subscribe((param: string) => {
                    this.viewoffer = 0;
                    DataHandler.viewoffer = 0;
                });

            this.eventEmitterService.subsVar = this.eventEmitterService.
                togglepaymenttab.subscribe((param: string) => {
                    this.track('', '', param);
                    // this.activeTab = param.toLocaleLowerCase();;
                    if (param == 'finance')
                        this.selected.setValue(1);
                    else if (param == 'lease') {
                        this.selected.setValue(0);



                    } else if (param == 'cash') {
                        this.selected.setValue(2);
                    }
                });

            this.subVar = this.eventEmitterService.
                leasepaymentrefresh.subscribe((data: any, isChecked: any, programId: any, type: any) => {
                    this.onCheckboxChange_lease('', 1, 0, 'tradein-ui');
                });

            this.cashsubVar = this.eventEmitterService.
                cashpaymentrefresh.subscribe((data: any, isChecked: any, programId: any, type: any) => {
                    if (DataHandler.private_Offer_Status == true) {
                        this.updateCashForPrivate();
                    } else {
                        this.onCheckboxChange_cash('');
                    }
                });

            this.financesubVar = this.eventEmitterService.
                financepaymentrefresh.subscribe((data: any, isChecked: any, programId: any, type: any) => {
                    if (DataHandler.private_Offer_Status == true) {

                        this.updateFinanceForPrivate();
                    } else if (this.incentiveUserSelected) {
                        this.onCheckboxChange_finance('', 3, 0, 'tradein-ui');
                    } else {
                        this.onCheckboxChange_finance('', 1, 0, 'tradein-ui');
                    }
                });

            this.eventEmitterService.subsVar = this.eventEmitterService.
                resetpaymentcalculartor.subscribe((param: any) => {

                    this.incentivedata = [];
                    this.conditionaldata = [];
                    //this.discountdata = [];

                    this.financeincentivedataToShow = [];
                    this.financeincentivedata = [];
                    this.financeconditionaldata = [];
                    //this.financediscountdata = [];

                    this.cashincentivedata = [];
                    this.cashconditionaldata = [];
                    //this.cashdiscountdata = [];

                    this.customerzipcode = param.par1;
                    this.customerstate = param.par2;
                    this.customercitycounty = param.par3;


                    /* this.customerzipcode = param.par1;
                       DataHandler.editedZipcode_Prequalify = this.customerzipcode;
                       this.customerstate = param.par2;
                       this.customercitycounty = param.par3;
                       DataHandler.leasetier = this.leasetier = param.par4;
                       DataHandler.financetier = this.financetier = param.par5;*/

                    this.leasetaxfeestotal = 0;
                    this.financetaxfeestotal = 0;
                    this.cashtaxfeestotal = 0;

                    this.leasetaxdetails = null;
                    this.leasemonthlytaxes = null;
                    this.leaseupfronttaxes = null;
                    this.leaseupfrontfees = null;
                    this.leaseserviceprotection = [];

                    this.financetaxdetails = null;
                    this.financefeesdetails = null;
                    this.financeserviceprotection = [];

                    this.cashtaxdetails = null;
                    this.cashfeesdetails = null;
                    this.cashserviceprotection = null;
                });

            this.eventEmitterService.subsVar = this.eventEmitterService.callLender.subscribe((param: any) => {
                if (param == 'finance') {
                    if (DataHandler.private_Offer_Status == true) {
                        this.updateFinanceForPrivate();
                    } else if (this.incentiveUserSelected) {
                        this.onCheckboxChange_finance('', 3, 0, 'tradein-ui');
                    } else {
                        this.onCheckboxChange_finance('', 1, 0, 'tradein-ui');
                    }
                } else if (param == 'lease') {
                    this.onCheckboxChange_lease('', 1, 0, 'tradein-ui');
                } else if (param == 'cash') {
                    if (DataHandler.private_Offer_Status == true) {
                        this.updateCashForPrivate();
                    } else {
                        this.onCheckboxChange_cash('');
                    }
                }
            });
        }
        this.observableService.selectedPaymentType$.subscribe((value: any) => {
            this.activeTab = value
        });
    }

    ngOnInit() {
        this.loaderImage = true;
        this.observableService.leaseResponseAvailable$.subscribe((value) => {
            this.leaseResponseAvailable = value;
        });
        this.observableService.financeResponseAvailable$.subscribe((value) => {
            this.finaceResponseAvailable = value;
        });
        if (this.hideCash === null || undefined) {
            this.hideCash = false;
            this.cdr.detectChanges();
        }

        if (DataHandler.initialleasecall == false) {


            DataHandler.initialleasecall = true

            this.restService.get_countycity(this.zipcode).subscribe((response) => {
                var obj = JSON.parse(JSON.stringify(response));
                if (obj.county_city_details != undefined) {
                    this.error = 0;
                    this.enable = 1;
                    this.customerstate = obj.state;
                    DataHandler.countycity = this.countycity = obj?.county_city_details[0].county_city;
                    this.countycitylist = obj?.county_city_details;
                    DataHandler.countycitylist = this.countycitylist
                }
            })

            this.restService.getCreditscore().subscribe((response) => {
                var obj = JSON.parse(JSON.stringify(response));

                this.leaserange = obj.body.data.lease.data;
                this.financerange = obj.body.data.finance.data;

                DataHandler.leaserange = this.leaserange;
                DataHandler.financerange = this.financerange;

            });

            this.dispatchLeaseDetailsAPICall(this.zipcode, '0', this.leasetradein, '0', '0', '0', '0', '', '', 'Y', '1', this.lenderCode)
            this.dispatchFinanceDetailsAPICall(this.zipcode, '0', '0', '0', '', '0', '', '', '1', this.lenderCode)
            this.dispatchCashDetailsAPICall(this.zipcode, '0', '0', '0', '', '', this.lenderCode);

            setTimeout(()=>{
                console.log("default_payment_mode",DataHandler.defaultPayment,this.leaseResponseAvailable,this.finaceResponseAvailable)
                var defaultSelection = ''
                 if(this.leaseResponseAvailable && DataHandler.defaultPayment == 'lease' ){
                  defaultSelection = 'lease'
                  DataHandler.paymenttype = 'lease'
                  DataHandler.objActivePaymentData.activeTab = 'lease';
                 }else if(this.finaceResponseAvailable && DataHandler.defaultPayment == 'finance'){
                  defaultSelection = 'finance'
                  DataHandler.paymenttype = 'finance'
                  DataHandler.objActivePaymentData.activeTab = 'finance';
                 }else if(!this.leaseResponseAvailable && this.finaceResponseAvailable && DataHandler.defaultPayment!='cash'){
                  defaultSelection = 'finance'
                  DataHandler.paymenttype = 'finance'
                 }else if(!this.finaceResponseAvailable && this.leaseResponseAvailable && DataHandler.defaultPayment!='cash'){
                  defaultSelection = 'lease'
                  DataHandler.paymenttype = 'lease'
                  DataHandler.objActivePaymentData.activeTab = 'lease';
                 }else{
                  defaultSelection = 'cash'
                  DataHandler.paymenttype = 'cash'
                  DataHandler.objActivePaymentData.activeTab = 'cash';
                 }
                 this.observableService.setSelectedPaymentType(defaultSelection)
                 //this.show_loader = false
                 //console.log("select",defaultSelection)
                 //this.eventEmitterService.toggelpaymenttab(defaultSelection)
            },4000);
               //DataHandler.defaultLoad = false

        }
        else {
            this.countycitylist = DataHandler.countycitylist
            this.selectedCountyCity = DataHandler.countycity
        }


        if (DataHandler.dealer == '26778') {
            this.isDealerDiscountBoldVisible = true;
            this.isDealerDiscountNormalVisible = false;
        }
        else {
            this.isDealerDiscountBoldVisible = false;
            this.isDealerDiscountNormalVisible = true;
        }

        DataHandler.paymenttype = 'Lease';
        this.isFinanceLoadedAutofi = false;
        this.isLeaseLoadedAutofi = false;
        this.year = DataHandler.year;
       // this.vinToDisplay = DataHandler.vin.split('').join(' ');
        this.vin = DataHandler.vin;
        this.dealer = DataHandler.dealer;
        this.zipcode = DataHandler.dealerzip;
        if (DataHandler.firstname != '' && DataHandler.lastname != '' && DataHandler.email != '' && DataHandler.zipcode != '') {
            this.viewoffer = 0;
            DataHandler.viewoffer = 0;
        }
        if (DataHandler.dealerdiscount = "true") {
            this.viewoffer = 0;
            DataHandler.viewoffer = 0;
        }

        if (DataHandler.dealerzip == '' || DataHandler.dealerzip == null || DataHandler.dealerzip == undefined)
            this.zipcode = DataHandler.dealerzip;
        setTimeout(() => {
            if (!DataHandler.isPaymentCalculatorInitialized) {
                if (this.vehicle_type == 'new') {
                    DataHandler.leasestate = '0'
                    DataHandler.financestate = '0'
                    DataHandler.cashstate = '0'
                    this.dispatchLeaseDetailsAPICall(this.zipcode, '0', '0', '0', '0', '', '0', '', '', 'Y', '1', this.lenderCode);

                    this.dispatchFinanceDetailsAPICall(this.zipcode, '0', '0', '0', '', '0', '', '', '1', this.lenderCode);

                    this.dispatchCashDetailsAPICall(this.zipcode, '0', '0', '0', '', '', this.lenderCode);
                }
            }
        }, 5000)

        this.eventEmitterService.subsVar = this.eventEmitterService.applyCreditDisable.subscribe((name: string) => {
            this.applyCreditDisable = true;
        });
        this.eventEmitterService.subsVar = this.eventEmitterService.updatemaincalc.subscribe((label: string) => {
            this.track('', '', label);
        });
        var httpParams = new HttpParams({ fromString: window.location.href.split('?')[1] });
        var cmp_type = httpParams.get("cmp_type");
        if (cmp_type == 'finance' || DataHandler.dealer_denverBC == 'Y') {
            this.selectedIndex = 1;
        }

        setTimeout(() => {
            this.getLeaseDetails();
            this.getFinanceDetails();
            this.getCashDetails();
            this.loaderImage = false;

            this.sharedService.paymentCalculatorState$
                .pipe(take(1))
                .subscribe((isClicked) => {
                    if (isClicked) {
                        this.adobe_sdg_event('page-load');
                    }
                });

        }, 1000);
    }

    public adobe_sdg_event(event_type: string, additionalContext: Record<string, any> = {}) {
        const interactionClick = { ...DataHandler.SDGEvents.interactionClick };
        const pageLoad = { ...DataHandler.SDGEvents.pageLoad };

        pageLoad.pageType = "build-your-deal";
        pageLoad.pageName = 'payment-estimator';
        pageLoad.site = "dealer";
        pageLoad.zipCode = DataHandler.zipcode;
        pageLoad.make = DataHandler.make;
        pageLoad.model = DataHandler.model;
        pageLoad.year = DataHandler.year;
        pageLoad.condition = DataHandler.actualVehicleType.toLowerCase();
        pageLoad.trim = DataHandler.trim;
        pageLoad.vin = DataHandler.vin;
        pageLoad.dealerCode = this.dealercode;

        try {
            switch (event_type) {
                case 'page-load':
                    DataHandler.SDGEvents.interactionClick.page = pageLoad.pageName;
                    AdobeSDGHandler.eventLogger('page-load', pageLoad);
                    break;

                case 'interaction-click':
                    let interactionClick = {
                        site: "dealer",
                        type: "tool",
                        page: "payment-estimator"
                    };

                    if (additionalContext.type === 'paymentEstimationTypeClick') {
                        Object.assign(interactionClick, {
                            location: "payment-selection",
                            name: additionalContext.value,
                        });
                    }

                    if (additionalContext.type === 'lengthofLoan') {
                        Object.assign(interactionClick, {
                            description: `duration-${additionalContext.value}-months`,
                            location: `${this.activeTab}-option`
                        });
                    }

                    if (additionalContext.type === 'annualMileage') {
                        const convertToK = (value: number): string => {
                            return value >= 1000 ? `${value / 1000}k` : value.toString();
                        };
                        Object.assign(interactionClick, {
                            description: `mileage-${convertToK(additionalContext.value.value)}`,
                            location: `${this.paymentType && this.paymentType.trim() ? this.paymentType : 'lease'}-options`
                        });
                    }

                if (additionalContext.type === 'conditionalOfferClick') {
                        Object.assign(interactionClick, {
                            location: `${this.paymentType && this.paymentType.trim() ? this.paymentType : 'lease'}-option`,
                            description:"offer-"+`${this.paymentType && this.paymentType.trim() ? this.paymentType : 'lease'}-option`+"-"+additionalContext.programName.toLowerCase()+"-"+(additionalContext.checked ? 'added': 'removed'),
                        });
                    }
                    if (additionalContext.type === 'creditRating') {
                        const creditRatingMapping: Record<string, string> = {
                            "Tier 1 (700-850) - Excellent": "excellent",
                            "Tier 2 (680-699) - Very Good": "very-good",
                            "Tier 3 (660-679) - Good": "good",
                            "Tier 4 (640-659) - Fair": "fair"
                        };

                        const normalizedValue = creditRatingMapping[additionalContext.value] || additionalContext.value;
                        Object.assign(interactionClick, {
                            description: `credit-${normalizedValue}`,
                            location: `${this.paymentType && this.paymentType.trim() ? this.paymentType : 'lease'}-options`
                        });
                    }

                    if (additionalContext.type === 'show-more' || additionalContext.type === 'show-less') {
                        Object.assign(interactionClick, {
                            description: `${additionalContext.value}`,
                            location: `${this.paymentType && this.paymentType.trim() ? this.paymentType : 'lease'}-options`
                        });
                    }

                    AdobeSDGHandler.eventLogger('interaction-click', { ...interactionClick });
                    break;


                default:
                    console.warn('Unhandled event type:', event_type);
                    break;
            }
        } catch (error) {
            console.error('Error in adobe_sdg_event:', error);
        }
    }


    shiftpriceunlocklease() {
        if (this.leasedetails && this.leasedetails.status != 200) {
            DataHandler.price = 'False';
            DataHandler.leasestatuscode = 'True'
        } else {
            DataHandler.price = 'True';
            DataHandler.leasestatuscode = 'false'
        }
    }

    shiftpriceunlockfinance() {
        if (this.financedetails && this.financedetails.status != 200) {
            DataHandler.price = 'False';
            DataHandler.financestatuscode = 'True';

        } else {
            DataHandler.price = 'True';
            DataHandler.financestatuscode = 'false';

        }
    }
    convertToNumber(prData: any) {
        return parseInt(prData);
    }


    shiftpriceunlockcash() {
        if (this.cashdetails && this.cashdetails.status != 200) {
            DataHandler.price = 'False';
        } else {
            DataHandler.price = 'True';
        }

    }

    shiftdigitalevent() {
        setTimeout(() => {
            ShiftDigitalHandler.shiftdigitalexecutorpaymentcalc('Payment Calc Interaction');
        }, 2000);

    }

    merkledowninput() {
        MerkleHandler.merkleexecutor('autoInputclicks');
    }

    keyPress(event: any) {
        const pattern = /[-0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!inputChar.match(/[0-9]/)) {
            event.charCode = event.charCode.replace(/[^0-9]/g, '');
            event.preventDefault();

        }
    }

    keyPressDn(event: any) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
    keyPressin(event: any) {
        const pattern = /[0-9.]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    validateNumericInput(event: any): void {
        const input = event.target.value;
        // Remove any non-numeric characters
        event.target.value = input.replace(/[^0-9]/g, '');
    }

    clearIfZero(event: any,obj:any): void {

        if(obj == 'downpay'){
            if(this.leasedownpayment_disp == '0'){
                this.leasedownpayment_disp = ''
            }
             if(this.financedownpayment_disp == '0'){
                this.financedownpayment_disp = ''
            }
        }else{

            if (this.leasetradein == 0 ) {
                this.leasetradein = '';
            }
            if (this.financetradein == 0 ) {
                this.financetradein = '';
            }
            if(this.cashtradein == 0){
                this.cashtradein = '';
            }
        }
    }

    resetIfEmpty(event: any,obj:any): void {
    const value = event.target.value?.trim();
    if (!value) {
        if(obj == 'downpay'){
           
            this.leasedownpayment_disp = '0'
           
            this.financedownpayment_disp = '0'
            
           
            
        }else{
        this.leasetradein = '0';
        this.financetradein  = '0';
        this.cashtradein = '0';
        }

        if(obj == 'downpay'){
            console.log(this.leasedownpayment_disp + " - " + DataHandler.minimumleasedownpayment + " - " + this.financedownpayment_disp)
             if(this.leasedownpayment_disp < DataHandler.minimumleasedownpayment ){
                this.showleasedownpaymenterror = true 
                this.showfinancedownpaymenterror = true 
                this.leasedownpayment_disp = DataHandler.minimumleasedownpayment
            }
            if( this.financedownpayment_disp < DataHandler.minimumfinancedownpayment){
                this.showleasedownpaymenterror = true 
                this.showfinancedownpaymenterror = true 
                this.financedownpayment_disp = DataHandler.minimumfinancedownpayment
            }
        }
    }
    

    
    }


    invokepupulation(event: any) {
        let callapi = false;
        if ((event.target?.value?.length == 5) || (event?.target?.value == undefined)) {

            callapi = true;
        }
        if (callapi == true) {
            this.zipcode = (event?.target?.value == undefined) ? event : event?.target?.value;
            DataHandler.zipcode = this.zipcode
            this.restService.get_countycity(event?.target?.value).subscribe((response) => {
                var obj = JSON.parse(JSON.stringify(response));
                if (obj?.status !== 200) {
                    this.error = 1
                }
                if (obj?.county_city_details != undefined) {
                    this.error = 0;
                    this.enable = 1;
                    this.customerstate = obj.state;
                    DataHandler.countycity = this.countycity = obj?.county_city_details[0].county_city;
                    this.selectedCountyCity = this.countycity
                    this.countycitylist = obj?.county_city_details;
                    DataHandler.countycitylist = this.countycitylist
                    this.customerzipcode = this.zipcode
                    DataHandler.customerzipcode = this.customerzipcode
                    DataHandler.customerstate = this.customerstate
                    this.dispatchLeaseDetailsAPICall(this.zipcode, '0', this.leasetradein.replace(',', ''), '0', '0', '', '0', this.customerstate, this.countycity, 'Y', DataHandler.leasetier, this.lenderCode);
                    this.dispatchFinanceDetailsAPICall(this.zipcode, 0, this.financetradein.replace(',', ''), 0, '', '0', this.customerstate, this.countycity, DataHandler.financetier, this.lenderCode);
                    this.dispatchCashDetailsAPICall(this.zipcode, 0, '', '0', this.customerstate, this.countycity, this.lenderCode);
                } else {
                    this.error = 1;
                    this.enable = 0;
                    this.countycity = [];
                }
            });
        } else {
            this.error = 1;
            this.enable = 0;
            this.countycity = [];
        }
    }
    onDropdownChange(event: any) {
        this.countycity = DataHandler.countycity = event.value

        this.dispatchLeaseDetailsAPICall(this.zipcode, '0', '0', '0', '0', '', '0', this.customerstate, this.countycity, 'Y', DataHandler.leasetier, this.lenderCode);
        this.dispatchFinanceDetailsAPICall(this.zipcode, 0, 0, 0, '', '0', this.customerstate, this.countycity, DataHandler.financetier, this.lenderCode);
        this.dispatchCashDetailsAPICall(this.zipcode, 0, '', '0', this.customerstate, this.countycity, this.lenderCode);
    }

    getLeaseDetails() {
        DataHandler.isPaymentCalculatorInitialized = true;
        this.store
            .pipe(select(getLeaseDetailsState), takeUntil(this.unsubscribe$),
                distinctUntilChanged((prev, curr) => JSON.stringify(prev.leaseDetails) === JSON.stringify(curr.leaseDetails)) // Only emit when lease details actually change
            )
            .subscribe({
                next: (data) => {
                    this.leasedetails = JSON.parse(JSON.stringify(data.leaseDetails));
                    
                    if (this.leasedetails !== null) {
                        console.log("leasedetails::",this.leasedetails);
                        if (data.status != '200') {
                            this.lease_listprice = this.leasedetails?.msrp;
                            this.lease_msrp = this.leasedetails?.vin_details?.msrp;
                            this.observableService.setLeaseResponseStatus(false)
                            //this.observableService.setSelectedPaymentType('finance')
                        }
                        if (data.status == '200') {
                            if (!DataHandler.callonce && DataHandler.vehicle_type == 'new') {
                               // DataHandler.minimumPercentage = this.leasedetails?.payload_calculation?.dp_percentage
                            //     var defaultSelect = this.leasedetails?.payload_payment_setting?.default_payment_mode
                            //    // this.observableService.setSelectedPaymentType(defaultSelect)
                                DataHandler.callonce = true
                             }
                            this.observableService.setLeaseResponseStatus(true)
                            if (DataHandler.showPrivateOffer == true) {
                                if (DataHandler.private_Offer_Status == true) {
                                    if (Object.keys(this.leasedetails.payload_incentives.e_shop_private_offers)?.length > 0) {
                                        DataHandler.which_private_offer_popup = 1;
                                        this.eventEmitterService.fnOpenPrivateOffer();
                                        DataHandler.open_private_offer_pop = 1;
                                        DataHandler.showPrivateOffer = false;
                                    }
                                }
                            }
                        }

                        this.minimumDownPercent = DataHandler.minimumPercentage
                    

                        if(DataHandler.leasestate == '0'){
                            this.defualtmileage = Number(this.leasedetails?.payload_calculation?.default_mileage)
                        }else{
                            this.defualtmileage = Number(this.leasedetails?.request?.mileage);
                        }
                        DataHandler.programtype = this.leasedetails?.payload_calculation?.selectedLenderProgram
                        this.displayterm = Number(this.defualtmileage / 1000);
                        this.hideConditionalOffter = this.leasedetails?.hide_conditional_offter;
                        this.msrp = this.leasedetails.request?.msrp;
                         this.dat_leaseupfitsdisclaimer = this.leasedetails.request?.list_price_disclaimer;
                        this.msrp_vin_details = this.leasedetails.request?.vin_details.msrp;
                        DataHandler.termdurationlease = this.leasedetails.payload_calculation?.terms_list;
                        DataHandler.lease_Milage = this.leasedetails.request?.mileage;
                        DataHandler.oem_model_code = this.leasedetails.request?.vin_details?.oem_model_code;
                        this.capitalizedcost = this.leasedetails.payload_calculation?.adjusted_cost;
                        this.capitalizedcostxdiscount = Number(this.leasedetails.payload_calculation?.adjusted_cost.replace(',', '')) + Number(this.leasedetails.payload_calculation?.discount_amount);
                        let arMonthlyPayment = this.leasedetails.payload_calculation?.monthly_payment.split("-");
                        this.custome_added_plan = DataHandler.custom_plan_added;
                        this.stack = this.leasedetails?.payload_stackability_incentives;
                        this.incentivetotal = 0;
                        this.leaseAmountForDisplay = this.monthlycost = 0;
                        this.leasedownpayment = 0;

                        if (arMonthlyPayment != undefined) {
                            this.leaseAmountForDisplay = this.monthlycost = Number(arMonthlyPayment[0].toString().replaceAll(',', ''));
                            this.observableService.setleaseFirstMonthPayment(arMonthlyPayment[0].toString().replaceAll(',', ''))
                            this.leasedownpayment = Math.floor(Number(arMonthlyPayment[1]));
                            //console.log("leasedownpayment",this.leasedownpayment)
                            // if(this.leasedownpayment >= DataHandler.minimumleasedownpayment){
                            //     this.showleasedownpaymenterror = false
                            // }
                            this.observableService.setleaseMonthlyPayment(this.leaseAmountForDisplay);
                            this.observableService.setleasefirstmonth(Number(arMonthlyPayment[0].toString().replaceAll(',', '')))
                        }
this.homenet_lease_vin = this.leasedetails.request?.is_homenet_vin;
                        this.leaseupfits = this.leasedetails.payload_upfits?.upfit_list;
                        this.leaseupfitsdisclaimer = this.leasedetails.payload_upfits?.upfit_list[0]?.disclaimer;
                        this.leaseupfitstype = this.leasedetails.payload_upfits?.upfit_list_type;
                        this.leaseupfitslabel = this.leasedetails.payload_upfits?.listprice_label;
                        this.leaseupfitamount = this.leasedetails.payload_upfits?.upfit_list_amount;
                        this.msrp_strikeoff_enable = this.leasedetails.request?.is_msrp_strikeoff_enable;

                        this.homenet_list_price = this.leasedetails?.homenet_list_price;
                        this.homenet_incentive_check = this.leasedetails.request?.homenet_incentive_check;
                        this.homenet_dealer_discount_check = this.leasedetails.request?.homenet_dealer_discount_check;
                        this.homenet_cache = this.leasedetails.request?.homenet_cache;
                        //vAuto
                        this.vauto_list_price = this.leasedetails?.vauto_list_price;

                        this.vauto_price_wo_incentive = this.leasedetails?.vauto_price_wo_incentive;
                        this.vauto_upfit = this.leasedetails?.vauto_upfit;
                        this.has_vauto_dlr_disc = false;
                        if(this.vauto_upfit != '' && this.vauto_upfit != 0){
                            this.leaseupfitamount = this.vauto_upfit
                        }
                        if (this.leasedetails?.has_vauto_dlr_disc || (this.vauto_list_price != undefined && this.vauto_list_price != '')) {
                            DataHandler.lease_has_vauto_dlr_disc = this.has_vauto_dlr_disc = true;
                        }

                        //Max digital
                        this.max_list_price = this.leasedetails?.max_list_price;
                        this.has_max_digital_dlr_disc = false;
                        if (this.max_list_price != undefined && this.max_list_price != '') {
                            DataHandler.lease_has_max_digital_dlr_disc = this.has_max_digital_dlr_disc = true;
                        }

                        // Autonation Lease
                        this.is_autoNation_vin = this.leasedetails.request?.is_autoNation_vin;
                        this.autoNation_listPrice = this.leasedetails.request?.syndication?.listPrice;
                        this.autoNation_upfits = this.leasedetails.request?.syndication?.upfits;
                        this.Lease_priceDispalyType = this.leasedetails.request?.price_display_type;

                        //Ferrario 
                        this.ferrario_vin = this.leasedetails.request?.is_ferrario_vin;
                        this.ferrario_list_price = this.leasedetails?.ferrario_list_price;
                        this.has_ferrario_dlr_disc = this.leasedetails?.has_ferrario_dlr_disc;

                        this.vin_msrp = this.leasedetails.request?.vin_details.msrp;
                        this.leasemsrpdisclaimer = this.leasedetails.inventory_disclaimer?.msrp_disclaimer;
                        DataHandler.base_msrp = this.msrp;
                        if (this.leaseupfitstype == 'L' && this.leaseupfitsdisclaimer != '') {
                            DataHandler.msrp_disclaimer = this.leaseupfitsdisclaimer;
                        } else {
                            DataHandler.msrp_disclaimer = this.leasemsrpdisclaimer;
                        }

                        this.discounttotal = this.leasedetails.payload_calculation?.discount_amount;
                        this.dlr_accessories = this.leasedetails?.dlr_accessories;

                        if (this.leasedetails?.payload_taxes?.feedetails?.taxes?.length != undefined)
                            this.leasetaxdetails = this.leasedetails?.payload_taxes?.feedetails?.taxes;
                        else
                            this.leasetaxdetails = null;

                        this.leasemonthlytaxes = this.leasedetails?.payload_taxes?.feedetails?.taxes?.monthly_tax_details;
                        this.leaseupfronttaxes = this.leasedetails?.payload_taxes?.feedetails?.taxes?.upfront_tax_details;
                        DataHandler.leasefeesdetails = this.leaseupfrontfees = this.leasedetails?.payload_fees?.fees_list;
                        this.leaseserviceprotection = this.leasedetails.payload_service_protection?.service_protection_list;

                        if (this.leasedetails?.payload_service_protection?.service_protection_list != "") {
                            this.leaseserviceprotection = this.leasedetails?.payload_service_protection?.service_protection_list;
                            DataHandler.leaseServiceValue = this.leasedetails?.payload_service_protection?.total_sp;
                        }
                        else
                            this.leaseserviceprotection = [];

                        DataHandler.leaseserviceprotection = this.leaseserviceprotection;
                        DataHandler.leasetaxes = this.leasedetails.payload_autofi_taxes_fees?.tax_total;
                        DataHandler.lease_payload_autofi_taxes_fees = this.leasedetails.payload_autofi_taxes_fees?.fee_list;
                        DataHandler.leasefees = this.leasedetails?.payload_autofi_taxes_fees?.fee_total;
                        DataHandler.leaseTaxRate = this.leasedetails?.payload_autofi_taxes_fees?.tax_rate;
                        DataHandler.leasemonthlytaxes = this.leasedetails.payload_taxes?.monthly_taxes;

                        let oldMopar = DataHandler.moparid.split(",");
                        if (oldMopar?.length > 0) {
                            for (let i = 0; i < this.leasedetails.payload_mopar_accessries?.accessories?.length; i++) {
                                let checkOld = false;
                                for (let j = 0; j < oldMopar?.length; j++) {
                                    if (this.leasedetails.payload_mopar_accessries?.accessories[i].part_no == oldMopar[j]) {
                                        checkOld = true;
                                    }
                                }
                                if (!checkOld) {
                                    this.leasedetails.payload_mopar_accessries.accessories[i].checked = true;
                                }
                            }
                        }
                        DataHandler.lease_payload_mopar_accessries = this.payload_mopar_accessries = this.leasedetails.payload_mopar_accessries?.accessories;
                        this.mopar_accessries_total = this.leasedetails.payload_mopar_accessries?.total_accesseries_cost;
                        DataHandler.inc_access_flag = this.leasedetails.request?.inc_access_calc;
                        this.eventEmitterService.fnUpdatemoparFlag();

                        this.leasetfdisclaimertext = this.leasedetails.taxs_and_fee_disclaimer_text?.tax_and_fee_lease_disclaimer?.replaceAll('Darcars', "DARCARS");

                        this.leasetfdisclaimerlabel = this.leasedetails.footer_disclaimer_text?.lease_label;
                        this.leasetfdisclaimertextwithouttaxesandfee = this.leasedetails.footer_disclaimer_text?.lease_disclaimer?.replaceAll('Darcars', "DARCARS");
                        this.taxesEnable = this.leasedetails.payload_tax_and_fees_status;

                        this.feesEnable = this.leasedetails.payload_enable_fees;
                        this.leasepaymentmode = '';
                        DataHandler.payload_tax_payment_mode = this.leasedetails.payload_tax_payment_mode;
                        if (this.leasedetails.payload_tax_payment_mode == "due_upfront" && this.leasedetails.payload_taxes.isFeePaidInlease == "No")
                            this.leasepaymentmode = "Upfront Fees"
                        else if (this.leasedetails.payload_tax_payment_mode == "due_upfront" && this.leasedetails.payload_taxes.isFeePaidInlease == "Yes")
                            this.leasepaymentmode = "dealer_fee_in_lease";
                        else if (this.leasedetails.payload_tax_payment_mode == "in_lease" && this.leasedetails.payload_taxes?.in_lease_payment_mode == "dealer_fee_in_lease" && this.leasedetails.payload_taxes.isFeePaidInlease == "Yes")
                            this.leasepaymentmode = "dealer_fee_in_lease";
                        else if (this.leasedetails.payload_tax_payment_mode == "in_lease" && this.leasedetails.payload_taxes?.in_lease_payment_mode == "Standard" && this.leasedetails.payload_taxes.isFeePaidInlease == "Yes")
                            this.leasepaymentmode = "dealer_fee_in_lease";
                        else if (this.leasedetails.payload_tax_payment_mode == "in_lease")
                            this.leasepaymentmode = this.leasedetails.payload_taxes?.in_lease_payment_mode;

                        this.leasetaxfeestotal = 0;

                        if (this.leasedetails?.payload_taxes?.tax_payment_mode == 'in_lease') {
                            var taxandfees = (this.leasedetails?.payload_taxes?.feedetails?.taxes?.monthly_tax_total
                                + this.leasedetails?.payload_taxes?.feedetails?.taxes?.upfront_tax_total +
                                this.leasedetails?.total_fee);

                            this.observableService.setleasetaxandfees(taxandfees);
                        }

                        if (this.leasedetails?.payload_taxes?.tax_payment_mode == 'due_upfront') {
                            var feesandtax = this.leasedetails?.total_taxs_and_fees
                            this.observableService.setleasetaxandfees(feesandtax)
                        }

                        if (this.taxesEnable == 'Y') {
                            for (let i = 0; i < this.leasetaxdetails?.length; i++) {
                                this.leasetaxfeestotal = this.leasetaxfeestotal + Number(this.leasetaxdetails[i].Amount);
                            }

                            for (let i = 0; i < this.leasemonthlytaxes?.length; i++) {
                                this.leasetaxfeestotal = this.leasetaxfeestotal + Number(this.leasemonthlytaxes[i].Amount);
                            }

                            for (let i = 0; i < this.leaseupfronttaxes?.length; i++) {
                                this.leasetaxfeestotal = this.leasetaxfeestotal + Number(this.leaseupfronttaxes[i].Amount);
                            }
                        }

                        if (this.feesEnable == 'Y') {
                            for (let i = 0; i < this.leaseupfrontfees?.length; i++) {
                                this.leasetaxfeestotal = this.leasetaxfeestotal + Number(this.leaseupfrontfees[i].Amount);
                            }
                        }

                        this.leasedueatsigningval = DataHandler.leasedueatsigning = this.leasedetails.payload_taxes?.subfees?.toString().replace(',', '');

                        if (this.taxesEnable == 'Y' || this.feesEnable == 'Y') {
                            this.observableService.setleasedueatsigning(this.leasedueatsigningval)
                        }

                        for (let i = 0; i < this.leaseserviceprotection?.length; i++) {
                            this.leasedueatsigningval = parseFloat(this.leasedueatsigningval) + parseFloat(this.leaseserviceprotection[i].Amount);
                        }

                        this.snpTotal = 0;
                        if (this.leaseserviceprotection?.length > 0) {
                            for (let i = 0; i < this.leaseserviceprotection?.length; i++) {
                                this.snpTotal = this.snpTotal + Number(this.leaseserviceprotection[i].Amount);
                            }
                        }
                        this.monthlycostSandPTotal = Number(this.leasetaxfeestotal) + Number(this.snpTotal) + Number(this.monthlycost.toString().replace(',', ''));

                        if (this.leasedetails.payload_taxes?.monthly_payment_with_taxes != undefined && this.leasedetails.payload_taxes?.monthly_payment_with_taxes != 0) {
                            this.leaseAmountForDisplay = this.leasemonthlytaxesval = DataHandler.leasemonthlypaymentwithtaxes = Number(this.leasedetails.payload_taxes?.monthly_payment_with_taxes.toString().replaceAll(',', ''));
                        } else if (DataHandler.custom_plan_added == 0) {
                            if (this.leaseserviceprotection?.length > 0) {
                                //this.leaseAmountForDisplay = this.leaseAmountForDisplay + this.snpTotal;
                                DataHandler.monthlyLeaseValue = this.leaseAmountForDisplay
                                
                            }
                        } else if (DataHandler.custom_plan_added == 1) {
                            if (this.leaseserviceprotection?.length > 0) {
                                if (this.leasetaxfeestotal > 0) {
                                    if (this.leasepaymentmode != 'Upfront Fees') {
                                        this.leaseAmountForDisplay = this.leaseAmountForDisplay + this.snpTotal + this.leasetaxfeestotal;
                                        DataHandler.monthlyLeaseValue = this.leaseAmountForDisplay
                                    }
                                    if (this.leasedetails.payload_tax_payment_mode == 'due_upfront') {
                                        this.leaseAmountForDisplay = this.monthlycost;
                                        DataHandler.monthlyLeaseValue = this.leaseAmountForDisplay
                                    }

                                }
                            }
                        }
                        this.observableService.setleaseMonthlyPayment(this.leaseAmountForDisplay);

                        if (this.leaseupfitamount == 0) {
                            this.leaseupfitflag = 0;
                        }
                        else {
                            this.leaseupfitflag = 1;

                        } DataHandler.objActivePaymentData

                        this.leaserange = DataHandler.leaserange

                        DataHandler.list_upfit_flag = this.leaseupfitflag;
                        // capturing available tiers for lease
                        this.leaserangearr = [];
                        DataHandler.leaserange_length = this.leasedetails.payload_calculation?.available_tiers_options.length;
                        DataHandler.leaserange_length = DataHandler.leaserange_length >= 5 ? 4 : DataHandler.leaserange_length;
                        var txt: any;
                        for (let i = 0; i < this.leasedetails.payload_calculation?.available_tiers_options?.length; i++) {
                            if (i == 0)
                                txt = "Excellent";
                            else if (i == 1)
                                txt = "Very Good";
                            else if (i == 2)
                                txt = "Good";
                            else if (i == 3)
                                txt = "Fair";
                            else if (i == 4)
                                continue;
                            if (this.leaserange !== undefined && this.leaserange[i] !== undefined) {
                                this.leaserangearr.push({ code: this.leaserange[i]?.code, low: this.leaserange[i]?.ficoLow, high: this.leaserange[i]?.ficoHigh, txtdisp: txt });
                            }
                        }

                        //capturing discount data 
                        this.discountdata = [];
                        for (let i = 0; i < this.leasedetails.payload_incentives?.discount_list_array?.length; i++) {
                            this.discountdata.push({ discount_name: this.leasedetails.payload_incentives.discount_list_array[i].discount_name, discount_amount: this.leasedetails.payload_incentives.discount_list_array[i].discount_amount, discount_disclaimer: this.leasedetails.payload_incentives.discount_list_array[i].dis_disclaimer });
                        }

                        if (this.leasedetails.payload_calculation?.trade_value == null) {
                            this.leasetradein = '0';
                            this.financetradein = '0';
                            this.cashtradein = '0';
                        }
                        else
                            this.leasetradein = formatNumber(this.leasedetails.payload_calculation?.trade_value, this.locale, '1.0-0');

                        this.listingdata = this.leasedetails.payload_incentives?.allmanmoney;
                        if (DataHandler.paymenttype == 'Lease' && DataHandler.leasestate != '0') {
                            if (this.leasemonthlytaxesval != undefined && this.leasemonthlytaxesval != 0)
                                this.eventEmitterService.popupateheader(this.leasemonthlytaxesval);
                            else
                                this.eventEmitterService.popupateheader(this.monthlycost);
                        }

                        if (DataHandler.leasestate == '0') {
                            this.defaultterm = Number(this.leasedetails.payload_calculation?.default_term);
                            this.observableService.setLeaseTermList(this.leasedetails.payload_calculation?.terms_list);
                            this.observableService.setSelectedLeaseTerm(this.defaultterm)
                            DataHandler.leasedafaultterm = this.defaultterm;
                        } // first time load it with default
                        else // second time load what is coming in the payload request
                            this.defaultterm = Number(this.leasedetails.request?.terms);

                        /* 
                         * Payment lease details to store while submitting lead 
                        */

                        DataHandler.msrp = this.msrp;
                        DataHandler.leasecapitalcost = this.capitalizedcost;
                        DataHandler.leasemonthlycost = this.monthlycost;
                        DataHandler.leasemonthly = this.leasedetails.payload_calculation?.monthly_payment;
                        DataHandler.leaseincentive = this.leasedetails.payload_calculation?.incentives;
                        DataHandler.leaseselectedallmanmoney = this.leasedetails.payload_incentives?.selected_allmanmoney;
                        DataHandler.leaseselectedconditionaloffer = this.leasedetails.payload_incentives?.selected_conditional_offer;
                        DataHandler.leaseselectinventory = this.leasedetails.payload_incentives?.incentivesbonuscashlist;
                        let incentiveIds = [];
                        for (let i in this.listingdata) {
                            const programId = this.listingdata[i].programId;
                            const value = this.check_enabled_lease(programId, 1);
                            const noneligible_check = this.check_noneligible_lease(programId, 1);

                            if (value === 1 && noneligible_check === 0) {
                                this.incentivetotal += this.listingdata[i].amount;
                            }

                            // Check if programId is already included in incentivedata
                            const exists = this.incentivedata.some(item => item.programId === programId);

                            if (!exists) {
                                this.incentivedata.push({
                                    programId: programId,
                                    programName: this.listingdata[i].programName,
                                    programRules: this.listingdata[i].programRules,
                                    amount: this.listingdata[i].amount,
                                    checked: 1,
                                    programNumber: this.listingdata[i].programNumber
                                });
                            }
                            if (DataHandler.leasestate == '0') {
                                incentiveIds.push(this.listingdata[i].programId);
                            }
                            this.progs[this.listingdata[i].programId] = this.listingdata[i].programName;
                        }

                        // section to extract the select inventory bonus cash file 
                        this.listingdata = this.leasedetails.payload_incentives?.incentivesbonuscashlist;
                        for (let i in this.listingdata) {
                            this.incentivetotal = this.incentivetotal + this.listingdata[i].discount;
                            if (!incentiveIds.includes(this.listingdata[i].programId)) {
                                this.incentivedata.push({ programId: this.listingdata[i].program_id, programName: this.listingdata[i].name, programRules: this.listingdata[i].disclaimer, amount: this.listingdata[i].discount, checked: -1, programNumber: this.listingdata[i].programNumber });
                            }
                            if (DataHandler.leasestate == '0') {
                                incentiveIds.push(this.listingdata[i].program_id);
                            }
                            this.progs[this.listingdata[i].program_id] = this.listingdata[i].name;
                        }
                        DataHandler.leaseIncentivedata = this.incentivedata;
                        this.listingdata = this.leasedetails.payload_incentives?.conditional_offers_group;
                        var arRebetProgramID = [];
                        var vRebetProgramID = this.leasedetails.request?.vRebetProgramID;
                        if (vRebetProgramID != undefined && vRebetProgramID != '') {
                            arRebetProgramID = vRebetProgramID.split(',');
                        }

                        for (let i in this.listingdata) {
                            for (let j in this.listingdata[i]) {
                                var value: number = this.check_enabled_lease(this.listingdata[i][j].programId, 2);

                                if (this.alstDesc == 'alstpop') {
                                    if (DataHandler.leasestate == '0' && i != 'Eshop Only available On-Line') { //unchecking all the conditional offers for 1st time
                                        value = 0;
                                    } else if (DataHandler.leasestate == '0' && i == 'Eshop Only available On-Line') {

                                        value = 1;
                                        incentiveIds.push(this.listingdata[i][j].programId);
                                    }
                                } else {
                                    if (DataHandler.leasestate == '0' && DataHandler.pagetype == '') { //unchecking all the conditional offers for 1st time
                                        value = 0;
                                    }
                                }

                                if (DataHandler.leasestate == '0' && i == 'Eshop Only available On-Line') {
                                    DataHandler.eshopLeaseConditionalOffer.push(this.listingdata[i][j]);
                                }

                                var noneligible_check: number = this.check_noneligible_lease(this.listingdata[i][j].programId, 2);
                                if (DataHandler.leasestate == '0' && (this.listingdata[i][j].programId == "9999999999")) {
                                    value = 1;
                                    incentiveIds.push(this.listingdata[i][j].programId);
                                }

                                if (DataHandler.leasestate == '0' && (i == 'Chrysler Capital' || i == 'Stellantis Preferred Lender')) {
                                    if (this.leasedetails?.apply_ev_hybrid_incentive == 'Y') {
                                        value = 1;
                                        incentiveIds.push(this.listingdata[i][j].programId);
                                    }
                                }

                                if (DataHandler.leasestate == '0' && arRebetProgramID?.length > 0) {
                                    for (let m in arRebetProgramID) {
                                        if (arRebetProgramID[m] == this.listingdata[i][j].programId) {
                                            value = 1;
                                            incentiveIds.push(this.listingdata[i][j].programId);
                                        }
                                    }
                                }
                                //private offer check
                                if (this.listingdata[i][j].programNumber == DataHandler.privateofferID && DataHandler.private_Offer_Status == true) {
                                    value = 1;
                                    incentiveIds.push(this.listingdata[i][j].programId);
                                }
                                //subvented and non subvented check

                                let isleasechecked: boolean = false;
                                for (let i = 0; i < this.conditionaldata?.length; i++) {
                                    if (this.conditionaldata[i].checked == true) {
                                        isleasechecked = true;
                                    }

                                }


                                setTimeout(() => {
                                    this.conditionaltotal = this.conditionalLeaseDataToShow.reduce((acc: any, group: any) => {

                                        const groupTotal = group.data.reduce((groupAcc: any, program: any) => {


                                            if (program.isChecked && !program.noeligible) {

                                                groupAcc += program.amount;
                                            }
                                            return groupAcc;
                                        }, 0);

                                        return acc + groupTotal;
                                    }, 0);
                                }, 10);
                                this.cdr.detectChanges();



                                if (DataHandler.leaseselectedconditionaloffer && Object.keys(DataHandler.leaseselectedconditionaloffer)?.length > 0) {
                                    let found = false;
                                    for (const key in DataHandler.leaseselectedconditionaloffer) {
                                        if (DataHandler.leaseselectedconditionaloffer.hasOwnProperty(key)) {
                                            const item = DataHandler.leaseselectedconditionaloffer[key];

                                            if (item.programId === this.listingdata[i][j].programId) {
                                                value = 0;

                                                if ((this.leasedetails?.apply_ev_hybrid_incentive == 'Y' && this.listingdata[i][j].programName.includes("EV")) || this.listingdata[i][j].programName.includes("Employee Price Discount")) {

                                                    value = 1;

                                                }

                                                if (!incentiveIds.includes(this.listingdata[i][j].programId)) {
                                                    incentiveIds.push(this.listingdata[i][j].programId);

                                                }
                                                found = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (!found) {
                                        value = 0;

                                    }
                                } else {
                                    value = 0;

                                }
                                if (DataHandler.is_all_conditional_offer_check && value == 0) {
                                    value = 1;
                                    incentiveIds.push(this.listingdata[i][j].programId);
                                }
                                this.conditionaldata.push({ group: i, programId: this.listingdata[i][j].programId, programName: this.listingdata[i][j].programName, programRules: this.listingdata[i][j].programRules, amount: this.listingdata[i][j].amount, checked: value, isChecked: value, programNumber: this.listingdata[i][j].programNumber });
                                this.progs[this.listingdata[i][j].programId] = this.listingdata[i][j].programName;
                            }
                        }
                        if (DataHandler.leasestate == '0') {
                            if(this.leasedetails.payload_calculation?.dp_percentage != '' && this.leasedetails.payload_calculation?.dp_percentage != undefined && this.leasedetails.payload_calculation?.dp_percentage !=null){
                              this.leasedownpaymentper = DataHandler.dpPercentage = Number(this.leasedetails.payload_calculation?.dp_percentage);
                            }
                            else{
                              this.leasedownpaymentper = Number(DataHandler.dpPercentage);
                            }
                          } else {
                            if(this.leasedetails.payload_calculation?.dp_percentage != '' && this.leasedetails.payload_calculation?.dp_percentage != undefined && this.leasedetails.payload_calculation?.dp_percentage !=null){
                              this.leasedownpaymentper = DataHandler.dpPercentage =  Number(this.leasedetails.payload_calculation?.dp_percentage);
                            }
                            else{
                              this.leasedownpaymentper = Number(DataHandler.dpPercentage);
                            }
                          }

                        if (this.msrp_strikeoff_enable == 'Y' && this.leaseupfitflag == 1  && !this.downPaymentChanged) {
                            this.msrp = this.msrp;
                            var leasedownpayment = this.msrp - (this.msrp * this.leasedownpaymentper/100);
                            var finaldownpayment = this.msrp - leasedownpayment;
                            this.leasedownpayment = finaldownpayment;
                        } else if (this.msrp_strikeoff_enable == 'Y' && this.leaseupfitflag == 1) {
                            this.msrp = this.msrp;
                        }
                        this.checkeligibilityLease(this.leasedetails.payload_stackability_incentives?.eligible);

                        this.lease_lock = 0;
                        this.totallease = this.incentivetotal + this.conditionaltotal + this.discounttotal;

                        DataHandler.totallease = this.totallease;
                        this.cdr.detectChanges();

                        if (DataHandler.leasestate == '0') {
                            DataHandler.leaseincentiveIds = incentiveIds.toString();
                        }

                        var capitalizedcost = 0;
                        if (this.viewoffer == 0 && !this.has_vauto_dlr_disc) {
                            capitalizedcost = this.capitalizedcost?.replace(',', '');
                        } else if (this.viewoffer == 1 && !this.has_vauto_dlr_disc) {
                            capitalizedcost = this.capitalizedcostxdiscount;
                        } else if (this.has_vauto_dlr_disc) {
                            capitalizedcost = this.capitalizedcost?.replace(',', '');
                        }
                        var amount = this.checkLeaseValue();
                        var msrp = 0;
                        var list_price = 0;
                        if (this.has_ferrario_dlr_disc && this.ferrario_list_price != '') {
                            list_price = this.ferrario_list_price;
                            msrp = this.vin_msrp;
                        }else if (this.is_autoNation_vin == 'Y' && this.autoNation_listPrice != '' && this.autoNation_listPrice != undefined && this.autoNation_listPrice != null && this.msrp_vin_details != this.autoNation_listPrice){
                            list_price = this.autoNation_listPrice
                         } 
                        else if (this.has_vauto_dlr_disc && this.vauto_list_price != '') {
                            msrp = this.vin_msrp;
                            list_price = this.vauto_list_price;
                        } else if (this.max_list_price != '' && this.max_list_price != undefined) {
                            list_price = this.max_list_price;
                            msrp = this.vin_msrp;
                        } else if (this.leaseupfitflag == 0) {
                            if (this.max_list_price != '' && this.max_list_price != undefined) {
                                msrp = this.vin_msrp;
                            } else if (this.max_list_price == '' || this.max_list_price == undefined) {
                                msrp = this.msrp;
                            }
                        } else if (this.leaseupfitflag == 1 && this.leaseupfitstype == 'L' && !this.has_max_digital_dlr_disc && !this.has_vauto_dlr_disc) {
                            msrp = this.msrp_vin_details;
                            list_price = this.msrp;
                        } else if (this.leaseupfitflag == 1 && this.leaseupfitstype == 'U' && !this.has_max_digital_dlr_disc && !this.has_vauto_dlr_disc) {
                            msrp = this.msrp_vin_details;
                            list_price = this.msrp;
                        } else if (this.leaseupfitflag != 0) {
                            msrp = this.msrp_vin_details;
                        }
                        else if(DataHandler.is_autonation_vin == 'Y' && this.autoNation_listPrice != undefined && this.autoNation_listPrice != '' && this.leasedetails.request?.price_display_type == 'L' ){
                            list_price = this.autoNation_listPrice;
                        }
                        if(list_price != 0  && list_price != null){
                             var Lprice = 0
                            if(list_price == msrp){
                                Lprice = 0
                            }else{
                                Lprice = list_price
                            }
                        console.log("leaselistPrice:",Lprice,this.msrp)
                        this.observableService.setLeaseListPrice(Lprice)
                        }else{
                            this.observableService.setLeaseListPrice('');
                        }

                        if((this.leaseupfitflag == 1 || this.discounttotal > 0)  && !this.has_max_digital_dlr_disc && !this.has_vauto_dlr_disc && this.msrp != this.msrp_vin_details  && !(this.is_autoNation_vin == 'Y' && this.autoNation_listPrice != '' && this.autoNation_listPrice != undefined && this.autoNation_listPrice != null && this.msrp_vin_details != this.autoNation_listPrice)){
                             console.log("DATleaselistPrice:",this.msrp)  
                            this.observableService.setLeaseListPrice(this.msrp)
                        }
                        this.leasetradein = this.leasetradein.trim();
                        if (DataHandler.leasestate == '0') {
                            if (list_price != 0) {
                                DataHandler.minimumleasedownpayment = Math.round(Number(list_price) * Number(DataHandler.minimumPercentage) / 100);
                                this.leasedownpayment = Number(list_price) * Number(DataHandler.dpPercentage) / 100;
                            } else {
                                this.leasedownpayment = (Number(msrp) * Number(DataHandler.dpPercentage) / 100);
                                DataHandler.minimumleasedownpayment = Math.round(Number(msrp) * Number(DataHandler.minimumPercentage) / 100);
                            }
                        }
                        DataHandler.leasedownpay = this.leasedownpayment_disp = this.leasedownpayment = this.leasedownpayment ? formatNumber(this.leasedownpayment, this.locale, '1.0-0') : 0;
                        //console.log("leasedownpayment", DataHandler.leasedownpay);

                        if (DataHandler.leasestate == '0') { // call the lease calculator again  
                            var downPaymentForApi = this.leasedownpayment?.toString().replace(",", "");
                            DataHandler.prevdownlease = downPaymentForApi;
                            if (DataHandler.autofiopen == 1 && !this.isLeaseLoadedAutofi) {
                                downPaymentForApi = DataHandler.leasedownpayment?.toString().replace(",", "");
                                this.leasetradein = DataHandler.leasetradein?.toString().replace(",", "");
                                this.defualtmileage = DataHandler.leasemileage;
                                this.isLeaseLoadedAutofi = true;
                                this.defaultterm = DataHandler.leasedafaultterm;
                                this.leasetier = DataHandler.leasetier;
                            } else {
                                DataHandler.leasetradein = (this.leasetradein)?.replace(",", "");
                               // DataHandler.leasedownpayment = this.leasedownpayment;
                                DataHandler.leasemileage = this.defualtmileage;
                                DataHandler.leasetier = this.leasetier;
                                DataHandler.eshopLeaseConditionalOffer = this.conditionaldata;
                            }
                        }
                        if(DataHandler.leasedownpayment == '' || DataHandler.leasedownpayment == null|| DataHandler.leasedownpayment ==undefined)
                            DataHandler.leasedownpayment =this.leasedownpayment?.toString().replace(",", "");

                        if (DataHandler.leasestate != '0') {
                            this.lease_lock = 1;
                        }

                        this.openConditionalOffersDialogLease(this.hideConditionalOffter, this.leasedetails.payload_stackability_incentives?.eligible);
                        //left panel update

                        if (DataHandler.objActivePaymentData.activeTab == 'lease' && DataHandler.leasestate == '1') {
                            if (this.leasedetails.status == 200) {
                            } else {

                            }
                        }



                        if (DataHandler.leasestate == '0' && this.leasedetails !== null) {
                            const duplicatesincentiveIds = incentiveIds.map(String);
                            this.lease_insentiveids = Array.from(new Set(duplicatesincentiveIds));
                            DataHandler.leasestate = '1'
                            
                            this.dispatchLeaseDetailsAPICall(DataHandler.zipcode,DataHandler.leasedownpayment, this.leasetradein?.toString().replaceAll(',', ''), this.defaultterm, this.defualtmileage, this.lease_insentiveids.toString(), '1', '', '', 'N', DataHandler.leasetier, this.lenderCode);
                        }
                        setTimeout(() => {
                            this.isChipListDisabled = false
                        }, 2000);
                    }

                }, error: (error) => {
                    // Do nothing
                    this.observableService.setLeaseResponseStatus(false)

                }
            });
    }
    getFinanceDetails() {
        DataHandler.isPaymentCalculatorInitialized = true;
        this.store
            .pipe(select(getFinanceDetailsState), takeUntil(this.unsubscribefinance$), //unsubscribefinance
                distinctUntilChanged((prev, curr) => JSON.stringify(prev.financeDetails) === JSON.stringify(curr.financeDetails))
            ).subscribe({
                next: (data) => {

                    this.financedetails = JSON.parse(JSON.stringify(data.financeDetails));;

                    if (this.financedetails != null) {
                        console.log("finance:",this.financedetails)
                        if (this.financedetails.status != '200') {
                            this.finance_listprice = this.financedetails?.msrp;
                            this.finance_msrp = this.financedetails?.vin_details?.msrp;
                            this.observableService.setfinanceResponseStatus(false);
                            // setTimeout(()=>{
                            //   if(this.leaseResponseAvailable){
                            //   //this.observableService.setSelectedPaymentType('lease')
                            //   }else{
                            //     //this.observableService.setSelectedPaymentType('cash')
                            //   }
                            // },3000)
                            
                        }

                        if (this.financedetails.status == '200') {
                            if (!DataHandler.callonce && DataHandler.vehicle_type == 'new') {
                               // DataHandler.minimumPercentage = this.financedetails?.payload_calculation?.dp_percentage
                                var defaultSelect = this.financedetails?.payload_payment_setting?.default_payment_mode
                                //this.observableService.setSelectedPaymentType(defaultSelect)
                                DataHandler.callonce = true
                            }
                            this.observableService.setfinanceResponseStatus(true)
                            if (DataHandler.showPrivateOffer == true) {
                                if (DataHandler.private_Offer_Status == true) {
                                    if (Object.keys(this.financedetails.payload_incentives.e_shop_private_offers)?.length > 0) {
                                        DataHandler.which_private_offer_popup = 1;
                                        this.eventEmitterService.fnOpenPrivateOffer();
                                        DataHandler.open_private_offer_pop = 1;
                                        DataHandler.showPrivateOffer = false;
                                    }
                                }
                            }
                        }
                this.dat_financeupfitsdisclaimer = this.financedetails.request?.list_price_disclaimer;

              //  if(!DataHandler.aprchanged){
                        this.minimumDownPercent = DataHandler.minimumPercentage

                        this.lender_program_name_subvented = ''
                        this.lender_programType_subvented = ''
                        this.apr_rate_subvented = ''
                        DataHandler.subventedProgramStatus = this.subventedProgramStatus = false
                        this.lender_program_name_nonsubvented = ''
                        this.lender_programType_nonsubvented = ''
                        this.apr_rate_nonsubvented = ''
                        this.nonSubventedProgramStatus = false
                        this.lease_lender_program_name_dealerdefine = ''
                        this.lease_apr_rate_dealerdefine = ''
                        this.dealerAprProgramStatus = ''
                        this.lenderProgramDetails = this.financedetails.payload_calculation?.LenderProgramDetails;
                        
                     /*   console.log("this.lowestType"+this.lowestType)
                        console.log("Datahandler.lowestType"+DataHandler.lowestType)
                        console.log("response",this.financedetails?.request?.lowest_type , this.financedetails?.request?.apr_rate)*/
                        if(this.lowestType =='' || this.lowestType == null || this.lowestType == undefined){
                            if(DataHandler.lowestType !='' && DataHandler.lowestType != ''){
                                    this.lowestType = DataHandler.lowestType;
                            }else{
                                if(this.lenderProgramDetails.length>0){
                                    this.lenderProgramDetails[0].checked = true;
                                    this.lowestType = DataHandler.lowestType = this.lenderProgramDetails[0].programType+"_"+this.lenderProgramDetails[0].value;
                                }
                            }
                            

                        }/*else if(this.lowestType !='' && this.lowestType != null){
                            this.lowestType =   DataHandler.lowestType = this.financedetails?.request?.lowest_type+"_"+this.financedetails?.request?.apr_rate;
                        }*/
                        var valueChecked = false;
                        //console.log("this.lowestType"+this.lowestType)
                       for (let i = 0; i < this.lenderProgramDetails.length; i++) {                      
                            var lType = this.lenderProgramDetails[i].programType+'_'+this.lenderProgramDetails[i].value;
                           /* console.log("lType",lType.trim().toLowerCase())
                            console.log("lowercase",this.lowestType.toLowerCase())*/
                            if(this.lowestType.toLowerCase() == lType.trim().toLowerCase() ){
                                this.lenderProgramDetails[i].checked = true
                                valueChecked = true;
                              //  console.log("inside")
                            }
                            else{
                                this.lenderProgramDetails[i].checked = false
                            }                                
                       }
                     //  console.log("valueChecked",valueChecked)
                       if(!valueChecked){
                         if(this.lenderProgramDetails.length>0){
                                this.lowestType = DataHandler.lowestType = this.lenderProgramDetails[0].programType+"_"+this.lenderProgramDetails[0].value;
                                this.lenderProgramDetails[0].checked = true;
                            }
                       }
                        //console.log("this.lowestType"+this.lowestType)
                       /* for (let i = 0; i < this.financedetails.payload_calculation?.LenderProgramDetails?.length; i++) {


                            if (this.financedetails.payload_calculation?.LenderProgramDetails[i].programType === 'Subvented Retail Finance') {
                                this.lender_program_name_subvented = this.financedetails.payload_calculation?.LenderProgramDetails[i].name;
                                this.lender_programType_subvented = this.financedetails.payload_calculation?.LenderProgramDetails[i].programType;
                                this.apr_rate_subvented = this.financedetails.payload_calculation?.LenderProgramDetails[i].value;
                                DataHandler.subventedProgramStatus = this.subventedProgramStatus = true
                            }


                            if (this.financedetails.payload_calculation?.LenderProgramDetails[i].programType === 'Non-subvented Finance') {
                                this.lender_program_name_nonsubvented = this.financedetails.payload_calculation?.LenderProgramDetails[i].name;
                                this.lender_programType_nonsubvented = this.financedetails.payload_calculation?.LenderProgramDetails[i].programType;
                                this.apr_rate_nonsubvented = this.financedetails.payload_calculation?.LenderProgramDetails[i].value;
                                this.nonSubventedProgramStatus = true
                            }


                            if (this.financedetails.payload_calculation?.LenderProgramDetails[i].programType === 'Estimated APR') {
                                this.lease_lender_program_name_dealerdefine = this.financedetails.payload_calculation?.LenderProgramDetails[i].name;
                                this.lease_lender_programType_dealerdefine = this.financedetails.payload_calculation?.LenderProgramDetails[i].programType;
                                this.lease_apr_rate_dealerdefine = this.financedetails.payload_calculation?.LenderProgramDetails[i].value;
                                this.dealerAprProgramStatus = true
                            }

                        }*/

                        /*if(DataHandler.financestate == '0'){
                            if(this.financedetails.payload_calculation?.lowest_type == 'Subvented Retail Finance' || this.financedetails.payload_calculation?.lowest_type == 'lowest_apr'){
                                this.lowestType = DataHandler.lowestType = 'lowest_apr'
                            }else if(this.financedetails?.payload_calculation?.lowest_type == "Non-subvented Finance" || this.financedetails?.payload_calculation?.lowest_type == "lowest_price"){
                                this.lowestType = DataHandler.lowestType = 'lowest_price'
                            }else if(this.financedetails?.payload_calculation?.lowest_type == "Estimated APR" || this.financedetails?.payload_calculation?.lowest_type == "dealer_price"){
                                this.lowestType = DataHandler.lowestType = 'dealer_price'
                            }
                         
                        }else{
                             this.lowestType = this.financedetails?.request?.lowest_type
                        }*/
                  //  }
                        const taxFess = (this.financedetails?.total_taxs_and_fees != 0) ? this.financedetails?.total_taxs_and_fees?.replace(",", ""):0;
                        this.observableService.setfinancetaxandfees(taxFess);
                        this.financeflag = 1;
                        this.hideConditionalOffter = this.financedetails?.hide_conditional_offter;
                        this.msrp_finance = this.financedetails.request?.msrp;
                        DataHandler.dealer_AprRate = this.financedetails.payload_calculation?.dealer_AprRate;
                        if (DataHandler.dealer_AprRate == true) {
                            this.dealersetting_APRRate = true;
                            this.sfsorccap_APRRate = false;
                        }
                        else if (DataHandler.dealer_AprRate == false) {
                            this.dealersetting_APRRate = false;
                            this.sfsorccap_APRRate = true;
                        }
                        DataHandler.oem_model_code = this.financedetails.request?.vin_details?.oem_model_code;
                        DataHandler.base_msrp = this.msrp_finance;
                        this.financeincentivetotal = 0;
                        this.msrp_vin_details_finance = this.financedetails.request?.vin_details.msrp;
                        this.financeconditionaltotal = 0;

                        if (DataHandler.financestate == '0') { // first time load it with default
                            this.defaultfinanceterm = this.financedetails.payload_calculation?.default_term;
                        }
                        else // second time load what is coming in the payload request
                            this.defaultfinanceterm = this.financedetails.request?.terms;


                        this.financeapr = this.financedetails.payload_calculation?.default_apr_rate;
                        if (DataHandler.aprRateType == 'defaultapr') {
                            this.financeaprthirdparty = this.financeaprthirdparty == '' ? this.financedetails.payload_calculation?.apr_rate : this.financeaprthirdparty;
                            DataHandler.financeapr = this.financeapr;
                        }

                        if (this.vehicle_type == 'new') {
                            DataHandler.financeapr = this.financeapr = this.financedetails.payload_calculation?.apr_rate;
                        }

                        //subvented & non-subvented
                        DataHandler.subventedProgramStatus = this.subventedProgramStatus = this.financedetails.subventedProgramStatus;
                        this.nonSubventedProgramStatus = this.financedetails.nonSubventedProgramStatus;
                        // if (this.isNonSubvented || DataHandler.isNonSubvented) {
                        //     DataHandler.isNonSubvented = false;
                        // } else if ((this.subventedProgramStatus && this.nonSubventedProgramStatus && DataHandler.financestate == '0') || (this.subventedProgramStatus && !this.nonSubventedProgramStatus && DataHandler.financestate == '0')) {
                        //     DataHandler.lowestType = 'lowest_apr';
                        // } else if (!this.subventedProgramStatus && this.nonSubventedProgramStatus && DataHandler.financestate == '0') {
                        //     DataHandler.lowestType = 'lowest_price';
                        // }
                        // if (this.isTermChanged == 'yes') {
                        //     if (!this.subventedProgramStatus || !this.nonSubventedProgramStatus) {
                        //         if (this.subventedProgramStatus && !this.nonSubventedProgramStatus) {
                        //             DataHandler.lowestType = 'lowest_apr';
                        //         } else if (!this.subventedProgramStatus && this.nonSubventedProgramStatus) {
                        //             DataHandler.lowestType = 'lowest_price';
                        //         }
                        //     }
                        // }
                        // this.lowestType = DataHandler.lowestType;
                        DataHandler.termdurationfinance = this.financedetails.payload_calculation?.terms_list;
                        this.observableService.setFinanceTermList(this.financedetails.payload_calculation?.terms_list)
                        this.observableService.setSelectedFinanceTerm(this.defaultfinanceterm);
                        // DataHandler.financedafaultterm = this.defaultfinanceterm;
                        this.financecapitalizedcost = this.financedetails.payload_calculation?.adjusted_cost;
                        this.financecapitalizedcostxdiscount = Number(this.financedetails.payload_calculation?.adjusted_cost.replace(',', '')) + Number(this.financedetails.payload_calculation?.discount_amount);
                        this.financemonthlycost = (this.financedetails.payload_calculation?.monthly_payment)?.split("-")[0].replace(',', '');

                        this.financeupfits = this.financedetails.payload_upfits?.upfit_list;
                        this.financeupfitsdisclaimer = this.financedetails.payload_upfits?.upfit_list[0]?.disclaimer;
                        this.financeupfitstype = this.financedetails.payload_upfits?.upfit_list_type;
                        this.financeupfitslabel = this.financedetails.payload_upfits?.listprice_label;
                        this.financeupfitamount = this.financedetails.payload_upfits?.upfit_list_amount;
                        this.finance_ferrario_list_price = this.financedetails?.ferrario_list_price;
                        this.finance_has_ferrario_dlr_disc = this.financedetails?.has_ferrario_dlr_disc;
                        this.finance_vauto_list_price = this.financedetails?.vauto_list_price;

                        // Autonation Finance
                        this.is_autoNationFinance_vin = this.financedetails.request?.is_autoNation_vin;
                        this.autoNation_FinancelistPrice = this.financedetails.request?.syndication?.listPrice;
                        this.autoNationFinance_upfits = this.financedetails.request?.syndication?.upfits;
                        this.finance_priceDispalyType = this.financedetails.request?.price_display_type;
                         this.autoNationFinance_listPrice = this.financedetails.request?.syndication?.listPrice;
                        this.finance_homenet_list_price = this.financedetails?.homenet_list_price;
                        //Homenet
                        this.homenet_incentive_check = this.financedetails.request?.homenet_incentive_check;
                        this.homenet_dealer_discount_check = this.financedetails.request?.homenet_dealer_discount_check;
                        this.homenet_cache = this.financedetails.request?.homenet_cache;
                        this.is_homenet_vin = this.financedetails.request?.is_homenet_vin;
                        this.is_homenet_vin_finance = this.financedetails.request?.is_homenet_vin
                        this.homenet_market_adjustment_cost = this.financedetails?.payload_upfits?.
                            upfit_list_amount;
                        this.is_homenet_incentives = this.financedetails.payload_calculation?.inc_HomeNet_incentive
                        //this.homenet_market_adjustment_cost_finance = this.financedetails?.payload_upfits?.
                        //upfit_list_amount;//this.finance_homenet_list_price?.toString().replace(",", "") - this.msrp_finance?.toString().replace(",", "");
                        this.finance_has_homenet_dlr_disc = false;
                        if (this.finance_homenet_list_price != undefined && this.finance_homenet_list_price != '') {
                            DataHandler.finance_has_homenet_dlr_disc = this.finance_has_homenet_dlr_disc = true;
                        }
                        this.finance_vauto_upfit = this.financedetails?.vauto_upfit;
                        if(this.finance_vauto_upfit != '' && this.finance_vauto_upfit != 0){
                            this.financeupfitamount = this.finance_vauto_upfit
                        }
                        this.finance_vauto_price_wo_incentive = this.financedetails?.vauto_price_wo_incentive;

                        this.finance_has_vauto_dlr_disc = false;
                        if (this.finance_vauto_list_price != undefined && this.finance_vauto_list_price != '') {
                            DataHandler.finance_has_vauto_dlr_disc = this.finance_has_vauto_dlr_disc = true;
                        }
                        this.finance_msrp_strikeoff_enable = this.financedetails.request?.is_msrp_strikeoff_enable;
                        this.finance_has_max_digital_dlr_disc = this.financedetails?.has_max_digital_dlr_disc;
                        this.finance_max_list_price = this.financedetails?.max_list_price;
                        this.finance_has_max_digital_dlr_disc = false;
                        if (this.finance_max_list_price != undefined && this.finance_max_list_price != '') {
                            DataHandler.finance_has_max_digital_dlr_disc = this.finance_has_max_digital_dlr_disc = true;
                        }
                        this.finance_vin_msrp = this.financedetails.request?.vin_details.msrp;
                        this.dealer_price_finance = this.financedetails.request?.vin_details.msrp;
                        DataHandler.hideEstimator = this.hideEstimator = this.dealer_price_finance === null || this.dealer_price_finance <= 5000 ? true : false;
                        this.observableService.updateCalc(DataHandler.hideEstimator);
                        this.financemsrpdisclaimer = this.financedetails.inventory_disclaimer?.msrp_disclaimer;
                        if (this.financeupfitstype == 'L' && this.financeupfitsdisclaimer != '') {
                            DataHandler.msrp_disclaimer = this.financeupfitsdisclaimer;
                        } else {
                            DataHandler.msrp_disclaimer = this.financemsrpdisclaimer;
                        }
                        DataHandler.inc_access_flag = this.financedetails.request?.inc_access_calc;
                        this.eventEmitterService.fnUpdatemoparFlag();
                        this.financediscounttotal = this.financedetails.payload_calculation?.discount_amount;


                        this.finance_dlr_accessories = this.financedetails?.dlr_accessories;
                        if (this.financedetails?.payload_taxes?.feedetails?.taxes?.length != undefined)
                            this.financetaxdetails = this.financedetails?.payload_taxes?.feedetails?.taxes;
                        else
                            this.financetaxdetails = null;

                        DataHandler.financefeesdetails = this.financefeesdetails = this.financedetails?.payload_fees?.fees_list;

                        if (this.financedetails?.payload_service_protection?.service_protection_list != "")
                            this.financeserviceprotection = this.financedetails?.payload_service_protection?.service_protection_list;
                        else
                            this.financeserviceprotection = [];

                        DataHandler.financeserviceprotection = this.financeserviceprotection;
                        let oldMopar = DataHandler.moparid.split(",");
                        if (oldMopar?.length > 0) {
                            for (let i = 0; i < this.financedetails.payload_mopar_accessries?.accessories?.length; i++) {
                                let checkOld = false;
                                for (let j = 0; j < oldMopar?.length; j++) {
                                    if (this.financedetails.payload_mopar_accessries?.accessories[i].part_no == oldMopar[j]) {
                                        checkOld = true;
                                    }
                                }
                                if (!checkOld) {
                                    this.financedetails.payload_mopar_accessries.accessories[i].checked = true;
                                }
                            }
                        }
                        DataHandler.finance_payload_mopar_accessries = this.finance_payload_mopar_accessries = this.financedetails.payload_mopar_accessries?.accessories;
                        this.finance_mopar_accessries_total = this.financedetails.payload_mopar_accessries?.total_accesseries_cost;

                        this.financedisclaimertext = this.financedetails.taxs_and_fee_disclaimer_text?.tax_and_fee_finance_disclaimer?.replaceAll('Darcars', "DARCARS");
                        this.financedisclaimerlabel = this.financedetails.footer_disclaimer_text?.finance_label;
                        this.financedisclaimertextwithouttaxesandfee = this.financedetails.footer_disclaimer_text?.finance_disclaimer?.replaceAll('Darcars', "DARCARS");
                        this.financetaxfeestotal = 0;

                        this.taxesFinEnable = this.financedetails.payload_tax_and_fees_status;
                        this.feesFinEnable = this.financedetails.payload_enable_fees;
                        // if (this.taxesFinEnable == 'Y') {
                        //     for (let i = 0; i < this.financetaxdetails?.length; i++) {
                        //         this.financetaxfeestotal = this.financetaxfeestotal + Number(this.financetaxdetails[i].Amount);
                        //     }
                        // }

                        // if (this.feesFinEnable == 'Y') {
                        //     for (let i = 0; i < this.financefeesdetails?.length; i++) {
                        //         this.financetaxfeestotal = this.financetaxfeestotal + Number(this.financefeesdetails[i].Amount);
                        //     }
                        // }
                        this.financetaxfeestotal = (this.financedetails?.total_taxs_and_fees !=0)? Math.round(this.financedetails?.total_taxs_and_fees?.replace(",", "")):0;

                        this.snpFTotal = 0;
                        if (this.financetaxfeestotal > 0) {
                            for (let i = 0; i < this.financeserviceprotection?.length; i++) {
                                this.snpFTotal = this.snpFTotal + Number(this.financeserviceprotection[i].Amount);
                                this.financetaxfeestotal = Math.round(this.financetaxfeestotal);
                            }
                        }
                        if(DataHandler.vehicle_type == 'used'){
                            DataHandler.financetaxes = this.financedetails?.total_tax; 
                            DataHandler.financefees = this.financedetails?.total_fee;   
                        }else{
                            DataHandler.financetaxes = this.financedetails.payload_autofi_taxes_fees?.tax_total;
                            DataHandler.financefees = this.financedetails?.payload_autofi_taxes_fees?.fee_total;
                        }
                        
                        DataHandler.finance_payload_autofi_taxes_fees = this.financedetails.payload_autofi_taxes_fees?.fee_list;
                        this.financedueatsigningval = DataHandler.financedueatsigning = this.financedetails.payload_taxes?.subfees;
                        if (this.taxesFinEnable == 'Y' || this.feesFinEnable == 'Y') {
                            this.observableService.setfinancedueatsigning(this.financedueatsigningval)
                        }
                        if (this.financeserviceprotection?.length > 0) {
                            for (let i = 0; i < this.financeserviceprotection?.length; i++) {
                                this.snpFTotal = this.snpFTotal + Number(this.financeserviceprotection[i].Amount);
                                this.financedueatSandP = parseFloat(this.financedownpayment?.toString().replace(",", "")) + parseFloat(this.financedetails?.total_taxs_and_fees?.toString().replace(",", "")) + parseFloat(this.financedetails?.payload_service_protection?.total_sp);
                                this.financedueatSandP = Math.round(this.financedueatSandP);
                            }
                        }

                        DataHandler.financemonthlytaxes = this.financedetails.payload_taxes?.monthly_taxes;
                        DataHandler.financemonthlypaymentwithtaxes = this.financedetails.payload_taxes?.monthly_payment_with_taxes;

                        if (this.financeupfitamount == 0 || this.financeupfitamount == '' || this.financeupfitamount == undefined) {
                            this.financeupfitflag = 0;
                        } else {
                            this.financeupfitflag = 1;

                        }
                        DataHandler.list_upfit_flag = this.financeupfitflag;
                        // capturing available tiers for finance
                        this.financerange = DataHandler.financerange
                        this.financerangearr = [];
                        //if (DataHandler.make_url != "ALFA") {
                        DataHandler.financerange_length = this.financedetails.payload_calculation?.available_tiers_options.length;
                        var txt: any;
                        for (let i = 0; i < this.financedetails.payload_calculation?.available_tiers_options.length; i++) {
                            if (i == 0)
                                txt = "Excellent";
                            else if ((i > 0) && (i <= 3))
                                txt = "Very Good";
                            else if (i == 4)
                                continue;
                            if (this.financerange[i] != undefined) {
                                this.financerangearr.push({ code: this.financerange[i]?.code, low: this.financerange[i]?.ficoLow, high: this.financerange[i]?.ficoHigh, txtdisp: txt });
                            }
                        }

                        //capturing discount data
                        this.financediscountdata = [];
                        for (let i = 0; i < this.financedetails.payload_incentives?.discount_list_array.length; i++) {
                            this.financediscountdata.push({ discount_name: this.financedetails.payload_incentives.discount_list_array[i].discount_name, discount_amount: this.financedetails.payload_incentives.discount_list_array[i].discount_amount, discount_disclaimer: this.financedetails.payload_incentives.discount_list_array[i].dis_disclaimer });
                        }

                        if (this.financedetails.payload_calculation?.trade_value == null && this.financedetails.payload_calculation != undefined) {
                            this.leasetradein = '0';
                            this.financetradein = '0';
                            this.cashtradein = '0';
                        }
                        else
                            this.financetradein = formatNumber(this.financedetails.payload_calculation?.trade_value, this.locale, '1.0-0');

                        if (DataHandler.paymenttype == 'Finance' && DataHandler.financestate != '0') {
                            this.eventEmitterService.popupateheader(this.financemonthlycost);
                        }
                        /* 
                         * Payment lease details to store while submitting lead 
                        */
                        DataHandler.msrp = this.msrp_finance;
                        DataHandler.financecapitalcost = this.financecapitalizedcost;
                        DataHandler.financemonthlycost = this.financemonthlycost;
                        this.financeamountwithSandP = DataHandler.financemonthlycost;
                        this.financeamountwithSandP_taxesandfeedisable = DataHandler.financemonthlycost;
                        DataHandler.financemonthly = this.financedetails.payload_calculation?.monthly_payment;

                        // if (this.financeserviceprotection?.length > 0) {
                        //     for (let i = 0; i < this.financeserviceprotection?.length; i++) {
                        //         this.financeamountwithSandP = parseFloat(this.financeamountwithSandP) + parseFloat(this.financeserviceprotection[i].Amount)
                        //     }

                        // }
                        if (this.financeserviceprotection?.length > 0 && (this.custome_added_plan == 1)) {
                            this.financeamountwithSandP = DataHandler.financemonthlycost;
                        }
                        if (this.financeserviceprotection?.length > 0 && (this.custome_added_plan == 1)) {
                            this.financeamountwithSandP = DataHandler.financemonthlycost;
                            for (let i = 0; i < this.financeserviceprotection?.length; i++) {
                                this.financeamountwithSandP_taxesandfeedisable = parseFloat(this.financeamountwithSandP_taxesandfeedisable) + parseFloat(this.financeserviceprotection[i].Amount)
                            }
                        }
                        this.observableService.setfinanceMonthlyPayment(this.financemonthlycost);
                        DataHandler.financeincentive = this.financedetails.payload_calculation?.incentives;
                        DataHandler.financeselectedallmanmoney = this.financedetails.payload_incentives?.selected_allmanmoney;
                        DataHandler.financeselectedconditionaloffer = this.financedetails.payload_incentives?.selected_conditional_offer;
                        DataHandler.financeselectinventory = this.financedetails.payload_incentives?.incentivesbonuscashlist;
                        let financeIncentiveReset = false;
                        if (this.financeIncentiveReset) {
                            financeIncentiveReset = true;
                            this.financeIncentiveReset = false;
                        }

                        var incentiveFinanceIds = [];
                        var incentiveFinanceIdsNew = [];
                        this.listingdata = this.financedetails.payload_incentives?.allmanmoney;
                        var newarr: any = this.listingdata;
                        var oldarr: any = this.financeincentivedata;
                        var newarr1 = [];
                        var oldarr1 = [];
                        if (newarr != null) {
                            newarr1 = Object.keys(newarr).map(key => (newarr[key]));
                        }
                        if (oldarr != null) {
                            oldarr1 = Object.keys(oldarr).map(key => (oldarr[key]));
                        }

                        if (this.listingdata?.length == 0 || newarr1.length != oldarr1.length || financeIncentiveReset) {
                            this.financeincentivedataToShow = [];
                            this.financeincentivedata = [];
                            financeIncentiveReset = true;
                        }
                        for (let i in this.listingdata) {
                            var value: number = this.check_enabled_finance(this.listingdata[i].programId, 1);
                            var noneligible_check: number = this.check_noneligible_finance(this.listingdata[i].programId, 1);
                            if (value == 1 && noneligible_check == 0 || financeIncentiveReset) // if it is present only then we need to consider it for performing total
                                this.financeincentivetotal = this.financeincentivetotal + this.listingdata[i].amount;


                            incentiveFinanceIdsNew.push(this.listingdata[i].programId);
                            if (DataHandler.financestate == '0' || financeIncentiveReset) { // this executes for step 1 only 
                                incentiveFinanceIds.push(this.listingdata[i].programId);
                                this.financeincentivedata.push({ programId: this.listingdata[i].programId, programName: this.listingdata[i].programName, programRules: this.listingdata[i].programRules, amount: this.listingdata[i].amount, checked: 1, programNumber: this.listingdata[i].programNumber });
                            }
                            this.progs[this.listingdata[i].programId] = this.listingdata[i].programName;
                        }
                        this.checkeligibilityFinance(this.financedetails.payload_stackability_incentives?.eligible);
                        // section to extract the select inventory bonus cash file 
                        this.listingdata = this.financedetails.payload_incentives?.incentivesbonuscashlist;
                        if (this.financedetails.payload_calculation?.incentives_bonus_cash_available == true) {
                            for (let i in this.listingdata) {
                                this.financeincentivetotal = this.financeincentivetotal + this.listingdata[i].discount;
                                incentiveFinanceIdsNew.push(this.listingdata[i].programId);
                                if (DataHandler.financestate == '0' || financeIncentiveReset) {
                                    this.financeincentivedata.push({ programId: this.listingdata[i].program_id, programName: this.listingdata[i].name, programRules: this.listingdata[i].disclaimer, amount: this.listingdata[i].discount, checked: -1, programNumber: this.listingdata[i].programNumber });
                                    incentiveFinanceIds.push(this.listingdata[i].program_id);
                                }
                                this.progs[this.listingdata[i].program_id] = this.listingdata[i].name;
                            }
                        }
                        DataHandler.financeincentivedata = this.financeincentivedata;
                        if (DataHandler.financestate == '1') {
                            this.financeincentivedataToShow = this.financeincentivedata;
                        }
                        this.listingdata = this.financedetails.payload_incentives?.conditional_offers_group;
                        var arRebetProgramID = [];
                        var vRebetProgramID = this.financedetails.request?.vRebetProgramID;
                        if (vRebetProgramID != undefined && vRebetProgramID != '') {
                            arRebetProgramID = vRebetProgramID.split(',');
                        }

                        for (let i in this.listingdata) {
                            for (let j in this.listingdata[i]) {

                                var value: number = this.check_enabled_finance(this.listingdata[i][j].programId, 2);
                                if (this.alstDesc == 'alstpop') {
                                    if (DataHandler.financestate == '0' && i != 'Eshop Only available On-Line') { //unchecking all the conditional offers for 1st time
                                        value = 0;
                                    } else if (DataHandler.financestate == '0' && i == 'Eshop Only available On-Line') {
                                        value = 1;
                                        incentiveFinanceIds.push(this.listingdata[i][j].programId);
                                    }
                                   // console.log("1incentiveFinanceIds",incentiveFinanceIds)
                                }
                                else {
                                    if (DataHandler.financestate == '0' && DataHandler.pagetype == '') { //unchecking all the conditional offers for 1st time
                                        value = 0;
                                    }
                                }

                                var noneligible_check: number = this.check_noneligible_finance(this.listingdata[i][j].programId, 2);
                                if (DataHandler.financestate == '0') {
                                    // employee pricing default check
                                    if (this.listingdata[i][j].programId == "9999999999") {
                                        value = 1;
                                        incentiveFinanceIds.push(this.listingdata[i][j].programId);
                                        //console.log("2incentiveFinanceIds",incentiveFinanceIds)
                                    }
                                    

                                    if (i == 'Chrysler Capital' || i == 'Stellantis Preferred Lender') {
                                        if (this.financedetails?.apply_ev_hybrid_incentive == 'Y') {
                                            value = 1;
                                            incentiveFinanceIds.push(this.listingdata[i][j].programId);
                                        }
                                        //console.log("3incentiveFinanceIds",incentiveFinanceIds)
                                    }
                                   

                                    //vAuto default check
                                    if (arRebetProgramID.length > 0) {
                                        for (let m in arRebetProgramID) {
                                            if (arRebetProgramID[m] == this.listingdata[i][j].programId) {
                                                value = 1;
                                                incentiveFinanceIds.push(this.listingdata[i][j].programId);
                                            }
                                        }
                                        //console.log("4incentiveFinanceIds",incentiveFinanceIds)

                                    }
                                    
                                    //private offer check
                                    if (this.listingdata[i][j].programNumber == DataHandler.privateofferID && DataHandler.private_Offer_Status == true) {
                                        value = 1;
                                        incentiveFinanceIds.push(this.listingdata[i][j].programId);
                                       // console.log("5incentiveFinanceIds",incentiveFinanceIds)
                                    }

                                }
                                let isfinancechecked: boolean = false;
                                for (let i = 0; i < this.financeconditionaldata.length; i++) {
                                    if (this.financeconditionaldata[i].checked == true) {
                                        isfinancechecked = true;
                                    }
                                }
                                setTimeout(() => {
                                    this.financeconditionaltotal = this.conditionalFinanceDataToShow.reduce((acc: any, group: any) => {
                                        const groupTotal = group.data.reduce((groupAcc: any, program: any) => {
                                            if (program.isChecked && !program.noeligible) {
                                                groupAcc += program.amount;
                                            }
                                            return groupAcc;
                                        }, 0);
                                        return acc + groupTotal;
                                    }, 0);
                                }, 10);
                                this.cdr.detectChanges();

                                if (DataHandler.financestate == '0' && DataHandler.autofiopen == 1 && !this.isFinanceLoadedAutofi && DataHandler.financeincentiveIds != '') {
                                    let arIncentiveIds = DataHandler.financeincentiveIds.split(',');
                                    for (let m in arIncentiveIds) {
                                        if (arIncentiveIds[m] == this.listingdata[i][j].programId) {
                                            value = 1;
                                            incentiveFinanceIds.push(this.listingdata[i][j].programId);
                                        }
                                    }
                                   // console.log("6incentiveFinanceIds",incentiveFinanceIds)
                                }
                                // if (DataHandler.financeselectedconditionaloffer && Object.keys(DataHandler.financeselectedconditionaloffer).length > 0) {
                                //     let found = false;
                                //     for (const key in DataHandler.financeselectedconditionaloffer) {
                                //         if (DataHandler.financeselectedconditionaloffer.hasOwnProperty(key)) {
                                //             const item = DataHandler.financeselectedconditionaloffer[key];

                                //             if (item.programId === this.listingdata[i][j].programId) {
                                //                 value = 0;

                                //                 if (this.listingdata[i][j].programName.includes("Private")) {
                                //                     value = 1;
                                //                 }

                                //                 if (!incentiveFinanceIds.includes(this.listingdata[i][j].programId)) {
                                //                     incentiveFinanceIds.push(this.listingdata[i][j].programId);
                                //                     console.log("7incentiveFinanceIds",incentiveFinanceIds)

                                //                 }
                                //                 found = true;
                                //                 break;
                                //             }
                                //         }
                                //     }
                                //     if (!found) {
                                //         value = 0;

                                //     }
                                // } else {
                                //     value = 0;

                                // }

                                // if (DataHandler.financestate == '0') {
                                if (DataHandler.is_all_conditional_offer_check && value == 0) {
                                    value = 1;
                                    incentiveFinanceIds.push(this.listingdata[i][j].programId);
                                    //console.log("8incentiveFinanceIds",incentiveFinanceIds)
                                }
                                this.financeconditionaldata.push({ group: i, programId: this.listingdata[i][j].programId, programName: this.listingdata[i][j].programName, programRules: this.listingdata[i][j].programRules, amount: this.listingdata[i][j].amount, checked: value, programNumber: this.listingdata[i][j].programNumber });
                                //   }
                                this.progs[this.listingdata[i][j].programId] = this.listingdata[i][j].programName;
                            }
                        }

                        if (this.financeconditionaldata.length > 0) {
                            DataHandler.eshopFinanceConditionalOffer = this.financeconditionaldata;
                        }

                        // if (DataHandler.financestate == '0') {
                        //     this.financedownpaymentper = Math.ceil(DataHandler.dpFinPercentage);
                        // } else {
                        //     this.financedownpaymentper = Math.ceil(this.financedetails.payload_calculation?.dp_percentage);
                        // }
                        if (DataHandler.financestate == '0') {
                            if(this.financedetails.payload_calculation?.dp_percentage != '' && this.financedetails.payload_calculation?.dp_percentage != undefined && this.financedetails.payload_calculation?.dp_percentage != null ){
                              this.financedownpaymentper = DataHandler.dpFinPercentage =  Number(this.financedetails.payload_calculation?.dp_percentage);
                            }
                            else{
                              this.financedownpaymentper = Number(DataHandler.dpFinPercentage);
                            }
                            
                          } else {
                            if(this.financedetails.payload_calculation?.dp_percentage != '' && this.financedetails.payload_calculation?.dp_percentage != undefined && this.financedetails.payload_calculation?.dp_percentage != null ){
                              this.financedownpaymentper = DataHandler.dpFinPercentage = Number(this.financedetails.payload_calculation?.dp_percentage);
                            }
                            else{
                              this.financedownpaymentper = Number(this.financedetails.payload_calculation?.dp_percentage);
                            }
                          }

                        this.financedownpaymentper = parseFloat(this.financedownpaymentper.toString());
                        console.log("5financedownpaymentper",this.financedownpaymentper)
                        this.finance_lock = 0;
                        if (this.finance_msrp_strikeoff_enable == 'Y' && this.financeupfitflag == 1  && !this.downPaymentChanged) {
                            this.msrp_finance = this.msrp_finance - this.financeincentivetotal - this.financediscounttotal;
                            var financedownpayment = this.msrp_finance - (this.msrp_finance * this.financedownpaymentper/100);
                            var finaldownpayment = this.msrp_finance - financedownpayment;
                            this.financedownpayment = finaldownpayment;
                        } else if (this.finance_msrp_strikeoff_enable == 'Y' && this.financeupfitflag == 1) {
                            this.msrp_finance = this.msrp_finance - this.financeincentivetotal - this.financediscounttotal;
                        }

                        this.totalfinance = this.financeincentivetotal + this.financeconditionaltotal + this.financediscounttotal;
                        DataHandler.totalfinance = this.totalfinance;

                        if (DataHandler.financestate == '0') {
                            DataHandler.financeincentiveIds = incentiveFinanceIds.toString();
                        }

                        var capitalizedcost = 0;
                        if (this.viewoffer == 0 && !this.finance_has_vauto_dlr_disc) {
                            capitalizedcost = this.financecapitalizedcost?.toString().replace(',', '');
                        } else if (this.viewoffer == 1 && !this.finance_has_vauto_dlr_disc) {
                            capitalizedcost = this.financecapitalizedcostxdiscount;
                        } else if (this.finance_has_vauto_dlr_disc) {
                            capitalizedcost = this.financecapitalizedcost?.toString().replace(',', '');
                        }
                        var amount = this.checkFinanceValue();
                        var msrp = 0;
                        var list_price = 0;
                        if (this.finance_homenet_list_price != '' && this.is_homenet_vin_finance == 'Y' && this.finance_homenet_list_price != this.finance_vin_msrp ) {
                            list_price = this.finance_homenet_list_price;
                            msrp = this.finance_vin_msrp;
                        } else if (this.finance_has_ferrario_dlr_disc && this.finance_ferrario_list_price != '') {
                            msrp = this.finance_vin_msrp;
                            list_price = this.finance_ferrario_list_price;
                        } else if (this.is_autoNationFinance_vin == 'Y' && this.autoNation_FinancelistPrice != '' && this.autoNation_FinancelistPrice != undefined && this.autoNation_FinancelistPrice != null && this.msrp_vin_details != this.autoNation_FinancelistPrice){
                            msrp = this.finance_vin_msrp;
                            list_price = this.autoNation_FinancelistPrice;
                        }
                        else if (this.finance_has_vauto_dlr_disc && this.finance_vauto_list_price != '') {
                            msrp = this.finance_vin_msrp;
                            list_price = this.finance_vauto_list_price;
                        } else if (this.finance_max_list_price != '' && this.finance_max_list_price != undefined) {
                            list_price = this.finance_max_list_price;
                            msrp = this.finance_vin_msrp;
                        } else if (this.financeupfitflag == 0) {
                            if (this.finance_max_list_price != '' && this.finance_max_list_price != undefined) {
                                msrp = this.finance_vin_msrp;
                            } else if (this.finance_max_list_price == '' || this.finance_max_list_price == undefined) {
                                msrp = this.msrp_finance;
                            }
                        } else if (this.financeupfitflag == 1 && this.financeupfitstype == 'L' && !this.finance_has_max_digital_dlr_disc && !this.finance_has_vauto_dlr_disc) {
                            msrp = this.msrp_vin_details_finance;
                            list_price = this.msrp_finance;
                        } else if (this.financeupfitflag == 1 && this.financeupfitstype == 'U' && !this.finance_has_max_digital_dlr_disc && !this.finance_has_vauto_dlr_disc) {
                            msrp = this.msrp_vin_details_finance;
                            list_price = this.msrp_finance;
                        } else if (this.financeupfitflag != 0) {
                            msrp = this.msrp_vin_details_finance;
                        }
                        else if(DataHandler.is_autonation_vin == 'Y' && this.autoNationFinance_listPrice != '' && this.autoNationFinance_listPrice != undefined && this.financedetails.request?.price_display_type == 'L'){
                            list_price = this.autoNationFinance_listPrice;
                        }

                        if(list_price != 0  && DataHandler.financestate == '1' ){
                            var Lprice = 0
                            if(list_price == msrp){
                                Lprice = 0
                            }else{
                                Lprice = list_price
                            }
                        console.log("financelistPrice:",Lprice)
                        this.observableService.setFinanceListPrice(Lprice)
                        }else{
                            this.observableService.setFinanceListPrice('') 
                        }
                        if((this.financeupfitflag == 1 || this.financediscounttotal > 0)  && !this.finance_has_homenet_dlr_disc && this.msrp_finance != this.finance_vin_msrp &&!this.finance_has_max_digital_dlr_disc && !this.finance_has_vauto_dlr_disc &&!(this.is_autoNationFinance_vin == 'Y' && this.autoNationFinance_listPrice != '' && this.autoNationFinance_listPrice != undefined && this.autoNationFinance_listPrice != null && this.msrp_vin_details_finance != this.autoNationFinance_listPrice)){
                            console.log("DatfinancelistPrice:",this.msrp_finance)
                            this.observableService.setFinanceListPrice(this.msrp_finance)
                        }
                        this.financetradein = this.financetradein.trim();
                        if (DataHandler.financestate == '0') {
                            if (list_price != 0) {
                                DataHandler.minimumfinancedownpayment = Math.round(Number(list_price) * Number(DataHandler.minimumPercentage) / 100);
                                this.financedownpayment = Number(list_price) * Number(DataHandler.dpFinPercentage) / 100;
                            } else {
                                DataHandler.minimumfinancedownpayment =  Math.round(Number(msrp) * Number(DataHandler.minimumPercentage) / 100);
                                this.financedownpayment = Number(msrp) * Number(DataHandler.dpFinPercentage) / 100;
                            }
                            if (this.isNonSubvented) {
                                this.isNonSubvented = false;
                                this.financedownpayment = DataHandler.financedownpayment.toString().replace(",", "");
                            }

                        } else {
                            this.financedownpayment = Math.round(Number((this.financedetails.payload_calculation?.monthly_payment)?.split("-")[1]));
                           
                            if (this.isNonSubvented) {
                                this.isNonSubvented = false;
                                this.financedownpayment = DataHandler.financedownpayment.toString().replace(",", "");
                            }
                            // if(this.financedownpayment >= DataHandler.minimumfinancedownpayment){
                            //     this.showfinancedownpaymenterror = false
                            // }
                        }
                        DataHandler.financedownpay=this.financedownpayment_disp = this.financedownpayment = this.financedownpayment ? formatNumber(this.financedownpayment, this.locale, '1.0-0') : 0;
                        

                        if (DataHandler.financestate == '0') { // call the finance calculator again || this.termUpdateCallApi
                            var downPaymentForApi = this.financedownpayment?.toString().replace(",", "");
                            DataHandler.prevdownfinance = downPaymentForApi;
                           // DataHandler.financedownpayment = downPaymentForApi
                            if (DataHandler.autofiopen == 1 && !this.isFinanceLoadedAutofi) {
                                downPaymentForApi = DataHandler.financedownpayment?.toString().replace(",", "");
                                this.financetradein = DataHandler.financetradein?.toString().replace(",", "");
                                this.isFinanceLoadedAutofi = true;
                                this.defaultfinanceterm = DataHandler.financedafaultterm;
                                this.financetier = DataHandler.financetier;
                            } else {
                                if (!this.termUpdateCallApi) {
                                    DataHandler.financetradein = (this.financetradein)?.toString().replace(',', '');
                                }

                                DataHandler.financedafaultterm = this.defaultfinanceterm;
                                DataHandler.financetier = this.financetier;
                            }
                            if (this.termUpdateCallApi) {
                                // conditional offer calculation
                                if (this.financeconditionaldata.length > 0) {
                                    for (let i = 0; i < DataHandler.eshopFinanceConditionalOffer.length; i++) {
                                        if (DataHandler.eshopFinanceConditionalOffer[i].checked == 1) {
                                            incentiveFinanceIds.push(DataHandler.eshopFinanceConditionalOffer[i].programId);
                                           // console.log("9incentiveFinanceIds",incentiveFinanceIds)
                                        }
                                    }
                                    this.financeconditionaldata = DataHandler.eshopFinanceConditionalOffer;
                                }
                                //downPaymentForApi = this.financedownpayment = DataHandler.financedownpayment;
                                this.financetradein = DataHandler.financetradein;
                                DataHandler.financeincentiveIds = incentiveFinanceIds.toString();
                                this.termUpdateCallApi = false;
                            }
                            if (this.is_homenet_vin == 'Y') {
                                DataHandler.base_msrp = this.finance_homenet_list_price;
                            }
                        }
                        if(DataHandler.financedownpayment == '' || DataHandler.financedownpayment == null|| DataHandler.financedownpayment ==undefined ||  DataHandler.financedownpayment =='0')
                            DataHandler.financedownpayment =downPaymentForApi;
                       


                        if (DataHandler.financestate != '0') {
                            this.finance_lock = 1;
                        }
                        this.openConditionalOffersDialogFinance(this.hideConditionalOffter, this.financedetails.payload_stackability_incentives?.eligible);
                        //homenet DD and adjusted capital cost calculation
                        if (this.is_homenet_vin) {
                            if (this.homenet_cache == 'Y') {
                                var minusdiscount = this.financedetails.payload_calculation?.discount_amount - this.financeincentivetotal;
                                if (minusdiscount < 0) {
                                    this.financediscounttotal = 0;
                                    this.financecapitalizedcost = this.financecapitalizedcost?.toString().replace(',', ''); //- this.financediscounttotal;

                                } else {
                                    this.financecapitalizedcost = this.financecapitalizedcost?.toString().replace(',', '');
                                }
                                if (this.homenet_dealer_discount_check == 'Y' && this.homenet_incentive_check == 'Y') {
                                    this.finance_has_homenet_dlr_disc = true;
                                    this.financediscounttotal = this.financedetails.payload_calculation?.discount_amount;

                                } else if (this.homenet_dealer_discount_check == 'N' && this.homenet_incentive_check == 'Y') {
                                    this.finance_has_homenet_dlr_disc = false;
                                    this.financediscounttotal = 0;

                                }

                                else if (this.homenet_dealer_discount_check == 'Y' && this.homenet_incentive_check == 'N') {
                                    this.finance_has_homenet_dlr_disc = true;
                                    this.financediscounttotal = this.financedetails.payload_calculation?.discount_amount;
                                    this.financecapitalizedcost = parseInt(this.financecapitalizedcost) - this.financediscounttotal;

                                }
                            } else if (this.homenet_cache == 'N') {
                                this.financecapitalizedcost = parseInt(this.financecapitalizedcost?.toString().replace(',', '')) + parseInt((this.finance_homenet_list_price)) - parseInt(this.msrp_finance);
                            }
                        }
                        capitalizedcost = this.financecapitalizedcost?.toString().replace(",", "");
                        //left panel update
                        if (DataHandler.objActivePaymentData.activeTab == 'finance' && DataHandler.financestate == '1') {
                            if (this.financedetails.status == 200) {
                                // this.fnUpdateLeftPanel('finance', msrp, this.financedownpayment_disp, this.financetradein.replace(",", ""), this.financeconditionaltotal, this.financeincentivetotal, this.financediscounttotal, capitalizedcost, 0, this.defaultfinanceterm, amount, list_price);
                            } else {
                                //this.fnUpdateLeftPanel('finance', this.finance_msrp, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                            }
                        }

                        var downPayment_finance = downPaymentForApi
                        if(DataHandler.financedownpayment != null && DataHandler.financedownpayment!= undefined && DataHandler.financedownpayment != ''){
                            downPayment_finance = DataHandler.financedownpayment
                        }

                        // if(downPayment_finance < DataHandler.minimumfinancedownpayment){
                        //     this.showfinancedownpaymenterror  = true
                        // }else{
                        //         this.showfinancedownpaymenterror = false
                        // }

                        if (DataHandler.financestate == '0') {
                            DataHandler.financestate = '1'
                           // console.log("10incentiveFinanceIds",incentiveFinanceIds)
                            this.dispatchFinanceDetailsAPICall(DataHandler.zipcode, downPayment_finance, this.financetradein?.toString().replaceAll(',', ''), this.defaultfinanceterm, incentiveFinanceIds.toString(), '1', this.customerstate, this.countycity, DataHandler.financetier, this.lenderCode);
                        }
                        setTimeout(() => {
                            this.isChipListDisabledFinance = false;
                        }, 2000);
                    }

                    //ABC
                }, error: (error) => {
                    // Do nothing
                    this.observableService.setfinanceResponseStatus(false)
                }
            });
    }
    getCashDetails() {
        DataHandler.isPaymentCalculatorInitialized = true;
        this.store
            .pipe(select(getCashDetailsState), takeUntil(this.unsubscribecash$),
                distinctUntilChanged((prev, curr) => JSON.stringify(prev.cashDetails) === JSON.stringify(curr.cashDetails))
            ).subscribe({
                next: (data) => {
                    this.cashdetails = data.cashDetails;
                    if (this.cashdetails?.status != '200') {
                        this.observableService.setCashResponseStatus(false); 
                    }

                    if (this.cashdetails !== null) {
                        console.log("cash::",this.cashdetails)
                        if (data.status == '200') {
                            
                            if (DataHandler.showPrivateOffer == true) {
                                if (DataHandler.private_Offer_Status == true) {
                                    if (Object.keys(this.cashdetails.payload_incentives.e_shop_private_offers).length > 0) {
                                        DataHandler.which_private_offer_popup = 1;
                                        this.eventEmitterService.fnOpenPrivateOffer();
                                        DataHandler.open_private_offer_pop = 1;
                                        DataHandler.showPrivateOffer = false;
                                    }
                                }
                            }
                            this.observableService.setCashResponseStatus(true);
                        }

                       

                        this.dat_cashupfitsdisclaimer = this.cashdetails.request?.list_price_disclaimer;
                        this.cashflag = 1;
                        //this.hideConditionalOffter = this.cashdetails?.hide_conditional_offter;
                        this.hideConditionalOffterCash = this.cashdetails?.hide_conditional_offter
                        this.cashincentivetotal = 0;
                        this.msrp_cash = this.cashdetails.request?.msrp;
                        DataHandler.base_msrp = this.msrp_cash;
                        this.cashconditionaltotal = 0;
                        this.msrp_vin_details_cash = this.cashdetails.request?.vin_details.msrp;
                        this.dealer_price_cash = this.cashdetails.request?.vin_details.msrp;
                        this.cashmonthlycost = Number(this.cashdetails.payload_calculation?.adjusted_cost.toString().replace(',', ''));

                        this.cashmonthlycostxdiscount = Number(this.cashdetails.payload_calculation?.adjusted_cost.toString().replace(',', '')) + Number(this.cashdetails.payload_calculation?.discount_amount);
                        this.cashtradein = this.cashdetails.payload_calculation?.trade_value;
                        this.cashamountwithSandPTotal = this.cashdetails.payload_calculation?.sp_monthly_payment;


                        this.cashupfits = this.cashdetails.payload_upfits?.upfit_list;
                        this.cashupfitsdisclaimer = this.cashdetails.payload_upfits?.upfit_list[0]?.disclaimer;
                        this.cashupfitstype = this.cashdetails.payload_upfits?.upfit_list_type;
                        this.cashupfitslabel = this.cashdetails.payload_upfits?.listprice_label;
                        this.cashupfitamount = this.cashdetails.payload_upfits?.upfit_list_amount;
                        this.cash_homenet_list_price = this.cashdetails?.homenet_list_price;
                        this.cash_has_homenet_dlr_disc = this.cashdetails?.has_homenet_dlr_disc;
                        this.cash_ferrario_list_price = this.cashdetails?.ferrario_list_price;
                        this.cash_has_ferrario_dlr_disc = this.cashdetails?.has_ferrario_dlr_disc;
                        // this.cash_vauto_list_price = this.cashdetails?.adprice;
                        //this.cash_vauto_list_price = (this.adprice != undefined || this.adprice != '') ? this.cashdetails?.adprice : this.cashdetails?.vauto_list_price;
                        this.cash_vauto_list_price = (this.adprice && this.adprice.trim() !== '') ? this.cashdetails?.adprice : this.cashdetails?.vauto_list_price;

                        this.cash_vauto_upfit = this.cashdetails?.vauto_upfit;
                        if(this.cash_vauto_upfit != '' && this.cash_vauto_upfit != 0){
                            this.cashupfitamount = this.cash_vauto_upfit
                        }
                        this.cash_vauto_price_wo_incentive = this.cashdetails?.vauto_price_wo_incentive;

                        if (this.cashdetails.request?.price_display_type == 'M') {
                            this.price_display_type = 'M';
                        }
                        else {
                            this.price_display_type = this.cashdetails.request?.price_display_type;
                        }

                        if (this.cashdetails.request?.is_vauto_vin == 'N') {
                            this.is_vauto_vin = 'N';
                        }
                        else {
                            this.is_vauto_vin = this.cashdetails.request?.is_vauto_vin;
                        }

                        

                        // Autonation Cash
                        this.is_autoNationCash_vin = this.cashdetails.request?.is_autoNation_vin;
                        this.autoNation_CashlistPrice = this.cashdetails.request?.syndication?.listPrice;
                        this.autoNationCash_upfits = this.cashdetails.request?.syndication?.upfits;
this.autoNationCash_listPrice = this.cashdetails.request?.syndication?.listPrice;
                        //Homenet
                        this.homenet_incentive_check = this.cashdetails.request?.homenet_incentive_check;
                        this.homenet_dealer_discount_check = this.cashdetails.request?.homenet_dealer_discount_check;
                        this.homenet_cache = this.cashdetails.request?.homenet_cache;
                        this.is_homenet_vin = this.cashdetails.request?.is_homenet_vin;
                        this.is_homenet_incentives = this.cashdetails.payload_calculation?.inc_HomeNet_incentive;
                        this.is_homenet_vin_cash = this.cashdetails.request?.is_homenet_vin
                        this.homenet_market_adjustment_cost = this.cashdetails.payload_upfits?.upfit_list_amount;
                        //this.homenet_market_adjustment_cost_cash = this.cash_homenet_list_price?.toString().replace(",", "") - this.msrp_finance?.toString().replace(",", "");

                        this.cash_has_vauto_dlr_disc = false;
                        if (this.cash_vauto_list_price != undefined && this.cash_vauto_list_price != '') {
                            this.cash_has_vauto_dlr_disc = true;
                        }
                        this.cash_msrp_strikeoff_enable = this.cashdetails.request?.is_msrp_strikeoff_enable;
                        this.cash_has_max_digital_dlr_disc = this.cashdetails?.has_max_digital_dlr_disc;
                        this.cash_max_list_price = this.cashdetails?.max_list_price;
                        if (this.cash_max_list_price != undefined && this.cash_max_list_price != '') {
                            this.cash_has_max_digital_dlr_disc = true;
                        }
                        this.cash_vin_msrp = this.cashdetails.request?.vin_details.msrp;
                        this.cashmsrpdisclaimer = this.cashdetails.inventory_disclaimer?.msrp_disclaimer;
                        if (this.cashupfitstype == 'L' && this.cashupfitsdisclaimer != '') {
                            DataHandler.msrp_disclaimer = this.cashupfitsdisclaimer;
                        } else {
                            DataHandler.msrp_disclaimer = this.cashmsrpdisclaimer;
                        }

                        this.cashdiscounttotal = this.cashdetails.payload_calculation?.discount_amount;
                        this.cash_dlr_accessories = this.cashdetails?.dlr_accessories;

                        this.taxesFinEnable = this.cashdetails.payload_tax_and_fees_status;
                        this.feesFinEnable = this.cashdetails.payload_enable_fees;
                        if (this.cashdetails?.payload_taxes?.feedetails?.taxes?.length != undefined)
                            this.cashtaxdetails = this.cashdetails.payload_taxes?.feedetails?.taxes;
                        else
                            this.cashtaxdetails = null;

                        let oldMopar = DataHandler.moparid.split(",");
                        if (oldMopar.length > 0) {
                            for (let i = 0; i < this.cashdetails.payload_mopar_accessries?.accessories.length; i++) {
                                let checkOld = false;
                                for (let j = 0; j < oldMopar.length; j++) {
                                    if (this.cashdetails.payload_mopar_accessries?.accessories[i].part_no == oldMopar[j]) {
                                        checkOld = true;
                                    }
                                }
                                if (!checkOld) {
                                    this.cashdetails.payload_mopar_accessries.accessories[i].checked = true;
                                }
                            }
                        }
                        this.cash_payload_mopar_accessries = this.cashdetails.payload_mopar_accessries?.accessories;
                        this.cash_mopar_accessries_total = this.cashdetails.payload_mopar_accessries?.total_accesseries_cost;

                        this.cashfeesdetails = this.cashdetails.payload_fees?.fees_list;
                        this.cashserviceprotection = this.cashdetails.payload_service_protection?.service_protection_list;
                        this.cashdisclaimertext = this.cashdetails.taxs_and_fee_disclaimer_text?.tax_and_fee_cash_disclaimer?.replaceAll('Darcars', "DARCARS");
                        this.cashdisclaimertextwithouttaxesandfee = this.cashdetails.footer_disclaimer_text?.cash_disclaimer?.replaceAll('Darcars', "DARCARS");
                        this.cashserviceprotection = this.cashdetails.payload_service_protection?.service_protection_list;
                        DataHandler.inc_access_flag = this.cashdetails.request?.inc_access_calc;
                        this.eventEmitterService.fnUpdatemoparFlag();
                        if (this.cashdetails?.payload_service_protection?.service_protection_list != "")
                            this.cashserviceprotection = this.cashdetails?.payload_service_protection?.service_protection_list;
                        else
                            this.cashserviceprotection = null;

                        this.cashtaxfeestotal = 0;

                        if (this.taxesFinEnable == 'Y') {
                            for (let i = 0; i < this.cashtaxdetails?.length; i++) {
                                this.cashtaxfeestotal = this.cashtaxfeestotal + Number(this.cashtaxdetails[i].Amount);
                            }
                        }

                        if (this.feesFinEnable == 'Y') {
                            for (let i = 0; i < this.cashfeesdetails?.length; i++) {
                                this.cashtaxfeestotal = this.cashtaxfeestotal + Number(this.cashfeesdetails[i].Amount);
                            }
                        }




                        this.snpCTotal = 0;
                        if (this.cashtaxfeestotal > 0) {
                            for (let i = 0; i < this.cashserviceprotection?.length; i++) {
                                this.snpCTotal = this.snpCTotal + Number(this.cashserviceprotection[i].Amount);
                                this.cashtaxfeestotal = this.cashtaxfeestotal;
                            }
                        }
                        this.cashtaxfeestotal =this.cashdetails?.total_taxs_and_fees !=0 ? Math.round(this.cashdetails?.total_taxs_and_fees?.replace(",", "")): 0;

                        if(DataHandler.vehicle_type == 'used'){
                            DataHandler.cashtaxes = this.cashdetails?.total_tax;
                        }else{
                            DataHandler.cashtaxes = this.cashdetails.payload_taxes?.feedetails?.total;
                        }
                        
                        DataHandler.cashfees = this.cashdetails.total_fee;
                        DataHandler.cashdueatsigning = this.cashdetails.payload_taxes?.subfees;
                        DataHandler.cashmonthlytaxes = this.cashdetails.payload_taxes?.monthly_taxes;
                        DataHandler.cashmonthlypaymentwithtaxes = this.cashdetails.payload_taxes?.monthly_payment_with_taxes;

                        if (this.cashupfitamount == 0) {
                            this.cashupfitflag = 0;
                        }
                        else {
                            this.cashupfitflag = 1;

                        }
                        DataHandler.list_upfit_flag = this.cashupfitflag;

                        //capturing discount data 
                        this.cashdiscountdata = [];
                        for (let i = 0; i < this.cashdetails.payload_incentives?.discount_list_array.length; i++) {
                            this.cashdiscountdata.push({ discount_name: this.cashdetails.payload_incentives.discount_list_array[i].discount_name, discount_amount: this.cashdetails.payload_incentives.discount_list_array[i].discount_amount, discount_disclaimer: this.cashdetails.payload_incentives.discount_list_array[i].dis_disclaimer });
                        }

                        if (this.cashdetails.payload_calculation?.trade_value == null) {
                            this.leasetradein = '0';
                            this.financetradein = '0';
                            this.cashtradein = '0';
                        }
                        else
                            this.cashtradein = formatNumber(this.cashdetails.payload_calculation?.trade_value, this.locale, '1.0-0');

                        /* 
                         * Payment lease details to store while submitting lead 
                        */
                        DataHandler.msrp = this.msrp_cash;
                        if (this.cashmonthlycost <= 0 || this.cashmonthlycostxdiscount <= 0) {
                            this.cashmonthlycost = 0;
                            this.cashmonthlycostxdiscount = 0
                        }
                        DataHandler.cashmonthlycost = this.cashmonthlycost;
                        DataHandler.cashtradein = (this.cashtradein).replace(',', '');
                        DataHandler.cashincentive = this.cashdetails.payload_calculation?.incentives;
                        DataHandler.cashselectedallmanmoney = this.cashdetails.payload_incentives?.selected_allmanmoney;
                        DataHandler.cashselectedconditionaloffer = this.cashdetails.payload_incentives?.selected_conditional_offer;
                        DataHandler.cashselectinventory = this.cashdetails.payload_incentives?.incentivesbonuscashlist;

                        var incentiveCashIds = [];
                        this.listingdata = this.cashdetails.payload_incentives?.allmanmoney;
                        //if (this.listingdata.length > 0) {
                        for (let i in this.listingdata) { //allmanmoney
                            var value: number = this.check_enabled_cash(this.listingdata[i].programId, 1);
                            //var noneligible_check: number = this.check_noneligible_cash(this.listingdata[i].programId, 1);

                            if (value == 1) // && noneligible_check == 0
                                this.cashincentivetotal = this.cashincentivetotal + this.listingdata[i].amount;

                            if (DataHandler.cashstate == '1') { // this executes for step 1 only 
                                const programId = this.listingdata[i].programId;
                                // Check if the programId already exists in cashincentivedata
                                const exists = this.cashincentivedata.some(item => item.programId === programId);

                                if (!exists) {
                                    this.cashincentivedata.push({
                                        programId: programId,
                                        programName: this.listingdata[i].programName,
                                        programRules: this.listingdata[i].programRules,
                                        amount: this.listingdata[i].amount,
                                        checked: 1
                                    });
                                }
                            }

                            this.progs[this.listingdata[i].programId] = this.listingdata[i].programName;
                            incentiveCashIds.push(this.listingdata[i].programId);
                        }
                        //}
                        this.checkeligibilityCash(this.cashdetails.payload_stackability_incentives?.eligible);
                        // section to extract the select inventory bonus cash file 
                        this.listingdata = this.cashdetails.payload_incentives?.incentivesbonuscashlist;
                        for (let i in this.listingdata) {
                            this.cashincentivetotal = this.cashincentivetotal + this.listingdata[i].discount;
                            if (DataHandler.cashstate == '0') {
                                this.cashincentivedata.push({ programId: this.listingdata[i].program_id, programName: this.listingdata[i].name, programRules: this.listingdata[i].disclaimer, amount: this.listingdata[i].discount, checked: -1 });
                                incentiveCashIds.push(this.listingdata[i].program_id);
                            }
                            this.progs[this.listingdata[i].program_id] = this.listingdata[i].name;
                        }

                        this.listingdata = this.cashdetails.payload_incentives?.conditional_offers_group;
                        var arRebetProgramID = [];
                        var vRebetProgramID = this.cashdetails.request?.vRebetProgramID;
                        if (vRebetProgramID != undefined && vRebetProgramID != '') {
                            arRebetProgramID = vRebetProgramID.split(',');
                        }

                        for (let i in this.listingdata) {
                            for (let j in this.listingdata[i]) {

                                var value: number = this.check_enabled_cash(this.listingdata[i][j].programId, 2);
                                if (this.alstDesc == 'alstpop') {
                                    if (DataHandler.cashstate == '0' && i != 'Eshop Only available On-Line') { //unchecking all the conditional offers for 1st time
                                        value = 0;
                                    } else if (DataHandler.cashstate == '0' && i == 'Eshop Only available On-Line') {
                                        value = 1;
                                        incentiveCashIds.push(this.listingdata[i][j].programId);
                                    }
                                } else {
                                    if (DataHandler.cashstate == '0' && DataHandler.pagetype == '') { //unchecking all the conditional offers for 1st time
                                        value = 0;
                                    }
                                }

                                if (DataHandler.cashstate == '0' && i == 'Eshop Only available On-Line') {
                                    DataHandler.eshopCashConditionalOffer.push(this.listingdata[i][j]);
                                }

                                var noneligible_check: number = this.check_noneligible_cash(this.listingdata[i][j].programId, 2);
                                if (DataHandler.cashstate == '0' && (this.listingdata[i][j].programId == "9999999999")) {
                                    value = 1;
                                    incentiveCashIds.push(this.listingdata[i][j].programId);
                                }

                                if (DataHandler.cashstate == '0' && (i == 'Chrysler Capital' || i == 'Stellantis Preferred Lender')) {
                                    if (this.cashdetails?.apply_ev_hybrid_incentive == 'Y') {
                                        value = 1;
                                        incentiveCashIds.push(this.listingdata[i][j].programId);
                                    }
                                }

                                if (DataHandler.cashstate == '0' && this.listingdata[i][j].programNumber == DataHandler.privateofferID && DataHandler.private_Offer_Status == true) {
                                    value = 1;
                                    incentiveCashIds.push(this.listingdata[i][j].programId);
                                }

                                if (DataHandler.cashstate == '0' && arRebetProgramID.length > 0) {
                                    for (let m in arRebetProgramID) {
                                        if (arRebetProgramID[m] == this.listingdata[i][j].programId) {
                                            value = 1;
                                            incentiveCashIds.push(this.listingdata[i][j].programId);
                                        }
                                    }
                                }
                                var iscashchecked: boolean = false;
                                for (let i = 0; i < this.cashconditionaldata.length; i++) {
                                    if (this.cashconditionaldata[i].checked == true) {
                                        iscashchecked = true;
                                    }
                                }
                                // if(value == 1 && noneligible_check == 0) {
                                //   this.cashconditionaltotal = (iscashchecked == true) ? this.cashconditionaltotal + this.listingdata[i][j].amount : 0;
                                // }
                                setTimeout(() => {
                                    this.cashconditionaltotal = this.conditionalCashDataToShow.reduce((acc: any, group: any) => {
                                        const groupTotal = group.data.reduce((groupAcc: any, program: any) => {
                                            if (program.isChecked && !program.noeligible) {
                                                groupAcc += program.amount;
                                            }
                                            return groupAcc;
                                        }, 0);
                                        return acc + groupTotal;
                                    }, 0);
                                }, 10);
                                this.cdr.detectChanges();

                                // if (DataHandler.cashselectedconditionaloffer && Object.keys(DataHandler.cashselectedconditionaloffer).length > 0) {
                                //     let found = false;

                                //     for (const key in DataHandler.cashselectedconditionaloffer) {
                                //         if (DataHandler.cashselectedconditionaloffer.hasOwnProperty(key)) {
                                //             const item = DataHandler.cashselectedconditionaloffer[key];

                                //             if (item.programId === this.listingdata[i][j].programId) {
                                //                 value = 0;

                                //                 if (this.listingdata[i][j].programName.includes("Private")) {
                                //                     value = 1;
                                //                 }

                                //                 if (!incentiveCashIds.includes(this.listingdata[i][j].programId)) {
                                //                     incentiveCashIds.push(this.listingdata[i][j].programId);

                                //                 }
                                //                 found = true;
                                //                 break;
                                //             }
                                //         }
                                //     }
                                //     if (!found) {
                                //         value = 0;

                                //     }
                                // } else {
                                //     value = 0;

                                // }
                                //    if (DataHandler.cashstate == '0') {
                                if (DataHandler.is_all_conditional_offer_check && value == 0) {
                                    value = 1;
                                    incentiveCashIds.push(this.listingdata[i][j].programId);
                                }
                                this.cashconditionaldata.push({ group: i, programId: this.listingdata[i][j].programId, programName: this.listingdata[i][j].programName, programRules: this.listingdata[i][j].programRules, amount: this.listingdata[i][j].amount, checked: value });
                                //  }
                                this.progs[this.listingdata[i][j].programId] = this.listingdata[i][j].programName;
                            }
                        }
                        if (this.cash_msrp_strikeoff_enable == 'Y' && this.cashupfitflag == 1) {
                            this.msrp_cash = this.msrp_cash - this.cashincentivetotal - this.cashdiscounttotal;
                        }
                        this.cash_lock = 0;
                        this.totalcash = this.cashincentivetotal + this.cashconditionaltotal + this.cashdiscounttotal;
                        DataHandler.totalcash = this.totalcash;
                        //ABC
                        // var bcIncentive = this.restService.checkBCincentiveAvailable();
                        // if (bcIncentive.length > 0) {
                        //   this.eventEmitterService.fnCheckBCIncentive();
                        // }

                        if (DataHandler.cashstate == '0' && DataHandler.autofiopen == 1 && !this.isCashLoadedAutofi && DataHandler.cashincentiveIds != '') {
                            incentiveCashIds = DataHandler.cashincentiveIds.split(',');
                        } else {
                            DataHandler.cashincentiveIds = incentiveCashIds.toString();
                        }

                        if (DataHandler.cashstate == '0') { // call the cash calculator again
                            DataHandler.cashstate = '1'
                            this.dispatchCashDetailsAPICall(DataHandler.zipcode, this.cashtradein?.toString().replaceAll(',', ''), incentiveCashIds.toString(), '1', this.customerstate, this.countycity, this.lenderCode);
                        }
                        if (DataHandler.cashstate != '0') {
                            this.cash_lock = 1;
                        }
                        this.openConditionalOffersDialogCash(this.hideConditionalOffterCash, this.cashdetails.payload_stackability_incentives?.eligible);
                        //Homenet DD calculation for cash
                        if (this.is_homenet_vin) {
                            if (this.homenet_cache == 'Y') {
                                var cashnegative = this.cashincentivetotal - this.cashdiscounttotal;
                                if (cashnegative < 0) {
                                    this.cashdiscounttotal = 0;
                                }

                                if (this.homenet_dealer_discount_check == 'Y' && this.homenet_incentive_check == 'Y') {
                                    this.cash_has_homenet_dlr_disc = true;
                                    // this.cashdiscounttotal = this.cashdetails.payload_calculation?.discount_amount - this.cashincentivetotal;
                                    this.cashdiscounttotal = this.cashdetails.payload_calculation?.discount_amount;

                                    // this.cashmonthlycost = (this.cashdetails.payload_calculation?.adjusted_cost.toString().replace(',', '')) - this.cashdiscounttotal;
                                    this.cashmonthlycost = (this.cashdetails.payload_calculation?.adjusted_cost.toString().replace(',', ''));
                                } else if (this.homenet_dealer_discount_check == 'N' && this.homenet_incentive_check == 'Y') {
                                    this.cash_has_homenet_dlr_disc = false;
                                    this.cashdiscounttotal = 0;
                                } else if (this.homenet_dealer_discount_check == 'Y' && this.homenet_incentive_check == 'N') {
                                    this.cash_has_homenet_dlr_disc = true;
                                    this.cashdiscounttotal = this.cashdetails.payload_calculation?.discount_amount;
                                    this.cashmonthlycost = this.cashmonthlycost - this.cashdiscounttotal;
                                }
                            } else if (this.homenet_cache == 'N') {
                                this.cashmonthlycost = this.cashmonthlycost //+ this.homenet_market_adjustment_cost_cash;
                            }
                        }
                        this.observableService.setcashPayment(this.cashmonthlycost)

                        if((this.cashupfitflag == 1 || this.cashdiscounttotal > 0)  &&  !this.cash_has_homenet_dlr_disc && this.msrp_cash != this.vin_msrp &&!this.cash_has_max_digital_dlr_disc && !this.cash_has_vauto_dlr_disc && this.cash_homenet_list_price == '' &&   !(this.is_autoNationCash_vin == 'Y' && this.autoNationCash_listPrice != '' && this.autoNationCash_listPrice != null && this.autoNationCash_listPrice != undefined && this.msrp_vin_details_cash != this.autoNationCash_listPrice)){
                                    console.log("datcashlistPrice",this.msrp_cash)
                                this.observableService.setCashListPrice(this.msrp_cash)
                            }
                        //left panel update
                        if (DataHandler.cashstate == '1') {
                            if (this.cashdetails.status == 200) {
                                var capitalizedcost = 0;
                                var amount = 0;
                                if (this.viewoffer == 0 && !this.cash_has_vauto_dlr_disc) {
                                    amount = this.cashmonthlycost;

                                    if (this.cashserviceprotection?.length > 0) {
                                        this.cashmonthlycost = Number(this.cashamountwithSandPTotal);
                                        amount = this.cashmonthlycost;
                                    }

                                } else if (this.viewoffer == 1 && !this.cash_has_vauto_dlr_disc) {
                                    amount = this.cashmonthlycostxdiscount;

                                    if (this.cashserviceprotection?.length > 0) {
                                        this.cashmonthlycostxdiscount = Number(this.cashamountwithSandPTotal);
                                        amount = this.cashmonthlycostxdiscount;
                                    }

                                } else if (this.cashserviceprotection?.length > 0) {
                                    amount = this.cashmonthlycost;
                                    if (this.cashserviceprotection?.length > 0) {
                                        this.cashmonthlycost = Number(this.cashamountwithSandPTotal);
                                        amount = this.cashmonthlycost;
                                    }
                                } else {
                                    amount = this.cashmonthlycost;
                                }
                                this.observableService.setcashPayment(this.cashmonthlycost)
                                var msrp = 0;
                                var list_price = 0;
                                if (this.cash_homenet_list_price != '') {
                                    msrp = this.cash_vin_msrp;
                                    list_price = this.cash_homenet_list_price;
                                } else if (this.cash_has_ferrario_dlr_disc && this.cash_ferrario_list_price != '') {
                                    msrp = this.cash_vin_msrp;
                                    list_price = this.cash_ferrario_list_price;
                                } else if (this.cash_has_vauto_dlr_disc && this.cash_vauto_list_price != '') {
                                    msrp = this.cash_vin_msrp;
                                    //  if (this.msrp_vin_details_cash != this.cash_vauto_price_wo_incentive) {
                                    list_price = this.cash_vauto_list_price;
                                    //  }

                                } else if (this.cash_max_list_price != '' && this.cash_max_list_price != undefined) {
                                    list_price = this.cash_max_list_price;
                                    msrp = this.cash_vin_msrp;
                                } else if (this.cashupfitflag == 0) {
                                    if (this.cash_max_list_price != '' && this.cash_max_list_price != undefined) {
                                        msrp = this.cash_vin_msrp;
                                    } else if (this.cash_max_list_price == '' || this.cash_max_list_price == undefined) {
                                        msrp = this.msrp_cash;
                                    }
                                } else if (this.cashupfitflag == 1 && this.cashupfitstype == 'L' && !this.cash_has_max_digital_dlr_disc && !this.cash_has_vauto_dlr_disc) {
                                    msrp = this.msrp_vin_details_cash;
                                    list_price = this.msrp_cash;
                                } else if (this.cashupfitflag == 1 && this.cashupfitstype == 'U' && !this.cash_has_max_digital_dlr_disc && !this.cash_has_vauto_dlr_disc) {
                                    msrp = this.msrp_vin_details_cash;
                                    list_price = this.msrp_cash;
                                } else if (this.cashupfitflag != 0) {
                                    msrp = this.msrp_vin_details_cash;
                                }
                                
                                if (this.is_autoNationCash_vin == 'Y' && this.autoNation_CashlistPrice != 0 && this.autoNation_CashlistPrice != undefined && this.autoNation_CashlistPrice != null && this.msrp_vin_details != this.autoNation_CashlistPrice){
                                    msrp = this.finance_vin_msrp;
                                    list_price = this.autoNation_CashlistPrice;
                                    //console.log("list:",list_price)
                                }
                                 //console.log("Plist:",this.is_autoNationCash_vin,this.autoNation_CashlistPrice,this.msrp_vin_details)
                                //console.log("clist:",list_price)
                                if(list_price != 0 && msrp != list_price){
                                console.log("cashlistPrice",list_price,this.msrp_cash)
                                this.observableService.setCashListPrice(list_price)
                                }else{
                                    this.observableService.setCashListPrice('');
                                }

                                if((this.cashupfitflag == 1 || this.cashdiscounttotal > 0)  &&  !this.cash_has_homenet_dlr_disc && this.msrp_cash != this.vin_msrp &&!this.cash_has_max_digital_dlr_disc && !this.cash_has_vauto_dlr_disc && this.cash_homenet_list_price == '' &&   !(this.is_autoNationCash_vin == 'Y' && this.autoNationCash_listPrice != '' && this.autoNationCash_listPrice != null && this.autoNationCash_listPrice != undefined && this.msrp_vin_details_cash != this.autoNationCash_listPrice)){
                                    console.log("datcashlistPrice",this.msrp_cash)
                                this.observableService.setCashListPrice(this.msrp_cash)
                                }
                                
                                this.cashtradein = this.cashtradein.trim();
                                //ABC
                                //this.fnUpdateLeftPanel('cash', msrp, 0, this.cashtradein.replace(",", ""), this.cashconditionaltotal, this.cashincentivetotal, this.cashdiscounttotal, capitalizedcost, 0, 0, amount, list_price);
                            } else {
                                //this.fnUpdateLeftPanel('cash', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                            }

                        }
                    }

                }, error: (error) => {
                    // Do nothing
                }
            });
    }





    public dispatchLeaseDetailsAPICall(
        zipcode: string,
        downpayment: any,
        tradein: string,
        term: string,
        mileage: string,
        ids: any,
        step: any,
        state: string,
        county: string,
        iscustomzip: string,
        tier: string,
        lender_code: string
    ) {
        // var state: any, county: any, zipcode: any, iscustomzip: any;
        if (step == '0') {
            DataHandler.leasestate = '0'
            DataHandler.conditionalLeaseDataToShow = []
            this.conditionalLeaseDataToShow = [];
            this.incentivedata = [];
            DataHandler.leaseincentiveIds = [];
            DataHandler.eshopLeaseConditionalOffer = [];
            this.conditionaldata = []
          //  this.conditional
            DataHandler.leaseselectedconditionaloffer = []
            this.lease_insentiveids = [];    
        }
        if (DataHandler.customerzipcode != undefined) {
            this.customerzipcode = DataHandler.customerzipcode
        }
        if (this.customerzipcode !== "") {
            state = DataHandler.customerstate;
            county = DataHandler.countycity;
            zipcode = DataHandler.customerzipcode;
            iscustomzip = "Y";
        } else {
            state = "";
            county = "";
            zipcode = zipcode;
            iscustomzip = "N";
        }
        let leaseDetailsPayload: leaseDatails = {
            vin: DataHandler.vin,
            dealercode: DataHandler.dealercode,
            zipcode: zipcode,
            msrp: !this.isValueEmpty(DataHandler.base_msrp)
                ? parseInt(DataHandler.base_msrp)
                : Number('0'),
            transactionType: 'lease',
            tier: tier,
            loading: step,
            tradein: !this.isValueEmpty(tradein) ? parseInt(tradein) : 0,
            prevtradein: DataHandler.prevtradeinlease,
            term: term,
            mileage: mileage,
            down: downpayment,//!this.isValueEmpty(downpayment) ? parseInt(downpayment) : 0,
            prevdown: DataHandler.prevdownlease,
            selectedIds: ids,
            is_widget: 'Y',
            dealer_discount_available: 'true', // DataHandler.dealerdiscount hardcoding will replace
            user_service_a_protection: DataHandler.serviceleaseIds,
            customer_state: state,
            customer_county_city: county,
            is_customer_zipcode: iscustomzip,
            current_session: DataHandler.current_session,
            get_down_pay_from_ui: DataHandler.get_down_pay_from_ui,
            sltMoparAcc: DataHandler.moparid,
            lender_code: 'US-169'
        };
        if(this.vehicle_type != 'used'){
        this.store.dispatch(leaseDetailAction({ payload: leaseDetailsPayload }));
        }
    }

    public dispatchFinanceDetailsAPICall(
        zipcode: string,
        //internetprice: any,
        downpayment: any,
        tradein: any,
        // additional_discount: any,
        terms: any,
        ids: any,
        step: any,
        state: string,
        county: string,
        tier: string,
        lender_code?: string

    ) {
        var iscustomzip: any;
        if (step == '0') {
            DataHandler.financestate = '0'
        }
        if (DataHandler.customerzipcode != undefined) {
            this.customerzipcode = DataHandler.customerzipcode
        }
        if (this.customerzipcode !== "") {
            state = DataHandler.customerstate;
            county = DataHandler.countycity;
            zipcode = DataHandler.customerzipcode;
            iscustomzip = "Y";
        } else {
            state = "";
            county = "";
            zipcode = zipcode;
            iscustomzip = "N";
        }
        let financeDetailsPayload: financeDetail = {
            vin: this.vin,
            msrp: DataHandler.base_msrp,
            dealer_code: Number(this.dealercode),
            dealercode: Number(this.dealercode),
            zipcode: parseInt(zipcode),
            tradein: !this.isValueEmpty(tradein) ? parseInt(tradein) : 0,
            additional_discount: DataHandler.financeadditiondiscount,
            terms: parseInt(terms),
            down: !this.isValueEmpty(downpayment) ? parseInt(downpayment) : 0,
            internetprice: Number(this.dealerprice),
            selectedIds: ids,
            customer_state: state,
            customer_county_city: county,
            is_customer_zipcode: iscustomzip,
            apr_rate: this.financeapr,
            initial_load: step,
            apr_rate_type: this.financeapr,
            transactionType: 'F',
            is_widget: 'Y',
            dealer_discount_available: DataHandler.dealerdiscount,
            user_service_a_protection: DataHandler.servicefinanceIds,
            lender_code: 'US-169',
            sltMoparAcc: DataHandler.moparid,
            tier: tier,
            lowest_type:DataHandler.lowestType
        };
        this.store.dispatch(
            financeDetailAction({ payload: financeDetailsPayload })
        );


    }
    public dispatchCashDetailsAPICall(
        zipcode: string,
        tradein: any,
        //additional_discount: any,
        ids: any,
        step: any,
        state: string,
        county: string,
        lender_code: 'US-169',
        // is_widget?: string,
        // down?: number,
        // tiers?: string,
        // msrp?: number,
        // internetprice?: any,
    ) {
        var iscustomzip: any
        if (step == '0') {
            DataHandler.cashstate = '0'
        }
        if (DataHandler.customerzipcode != undefined) {
            this.customerzipcode = DataHandler.customerzipcode
        }
        if (this.customerzipcode !== "") {
            state = DataHandler.customerstate;
            county = DataHandler.countycity;
            zipcode = DataHandler.customerzipcode;
            iscustomzip = "Y";
        } else {
            state = "";
            county = "";
            zipcode = zipcode;
            iscustomzip = "N";
        }
        const payloadData: cashDetails = {
            vin: this.vin,
            dealer_code: parseInt(this.dealercode),
            dealercode: this.dealercode,
            zipcode: parseInt(zipcode),
            tradein: parseInt(DataHandler.cashtradein),
            additional_discount: DataHandler.cashadditiondiscount,
            internetprice: Number(this.dealerprice),
            selectedIds: ids,
            customer_state: state,
            customer_county_city: county,
            is_customer_zipcode: iscustomzip,
            initial_load: step,
            dealer_discount_available: DataHandler.dealerdiscount,
            user_service_a_protection: DataHandler.servicecashIds,
            sltMoparAcc: DataHandler.moparid,
            transactionType: 'cash',
            is_widget: 'Y',
            lender_code: 'US-169',

        };
        this.store.dispatch(cashDetailAction({ payload: payloadData }));
    }

    isValueEmpty(val: any): any {
        if (
            val === 'undefined' ||
            val === 'null' ||
            val === '0' ||
            val === undefined ||
            val === null ||
            val === 0 ||
            val === '' ||
            val === '∞' ||
            val === '$0'
        ) {
            return true;
        }
        return false;
    }

    paymentSelctionChange($event: any) {
        this.observableService.setSelectedPaymentType($event)
    }

    check_enabled_lease(programId: number, type: number): number {

        // if (type == 2) {
        //   return 0;
        // }
        var temp;
        if (type == 1) {

            temp = this.leasedetails.payload_incentives.selected_allmanmoney;


        }
        else if (type == 2)
            temp = this.leasedetails.payload_incentives.selected_conditional_offer;


        for (let i in temp) {

            var program: number = temp[i].programId;
            if (program == programId) {
                return 1;
            }
            if (temp[i].programName.includes('EV') || temp[i].programName.includes('Private')) {
                return 1;
            }

        }
        if ((this.leasedetails.payload_incentives.selected_allmanmoney.length == 0) && (type == 1))
            return -1;

        return 0;
    }

    check_enabled_finance(programId: number, type: number): number {
        let temp;
        if (type == 1) {
            temp = this.financedetails.payload_incentives.selected_allmanmoney;
            for (let attrname in this.financedetails.payload_incentives.incentivesbonuscashlist) {
                temp[attrname] = this.financedetails.payload_incentives.incentivesbonuscashlist[attrname];
                temp[attrname].programId = this.financedetails.payload_incentives.incentivesbonuscashlist[attrname].program_id;
            }
        } else if (type == 2) {
            temp = this.financedetails.payload_incentives.selected_conditional_offer;
        }
        for (let i in temp) {
            let program: number = temp[i].programId;
            if (program == programId) {
                return 1;
            }
            if (temp[i].programName.includes('Private')) {
                return 1;
            }
        }
        if ((this.financedetails.payload_incentives.selected_allmanmoney.length == 0) && (type == 1))
            return -1;

        return 0;
    }

    check_enabled_cash(programId: number, type: number): number {
        var temp;
        if (type == 1)
            temp = this.cashdetails.payload_incentives.selected_allmanmoney;
        else if (type == 2)
            temp = this.cashdetails.payload_incentives.selected_conditional_offer;

        for (let i in temp) {
            let program: number = temp[i].programId;
            if (program == programId) {
                return 1;
            }
            if (temp[i].programName.includes('Private')) {
                return 1;
            }
        }
        if ((this.cashdetails.payload_incentives.selected_allmanmoney.length == 0) && (type == 1))
            return -1;

        return 0;
    }

    check_noneligible_lease(programId: number, type: number): number {
        var temp;
        if (type == 1)
            temp = this.leasedetails.payload_allmanmoney_stackability?.noneligible;
        else
            temp = this.leasedetails.payload_stackability_incentives?.noneligible;

        for (let i in temp) {
            var program: number = temp[i];
            if (programId == 9999999999) { // programId == 9999999999 this condition is made to bypass employee pricing stackability
                return 0;
            }
            if (program == programId) {
                return 1;
            }
        }
        return 0;
    }

    check_noneligible_finance(programId: number, type: number): number {
        var temp;
        if (type == 1)
            temp = this.financedetails.payload_allmanmoney_stackability?.noneligible;
        else
            temp = this.financedetails.payload_stackability_incentives?.noneligible;

        for (let i in temp) {
            var program: number = temp[i];
            if (programId == 9999999999) { // programId == 9999999999 this condition is made to bypass employee pricing stackability
                return 0;
            }
            if (program == programId) {
                return 1;
            }
        }
        return 0;
    }

    check_noneligible_cash(programId: number, type: number): number {
        var temp;
        if (type == 1)
            temp = this.cashdetails.payload_allmanmoney_stackability?.noneligible;
        else
            temp = this.cashdetails.payload_stackability_incentives?.noneligible;

        for (let i in temp) {
            var program: number = temp[i];
            if (programId == 9999999999) { // programId == 9999999999 this condition is made to bypass employee pricing stackability
                return 0;
            }
            if (program == programId) {
                return 1;
            }
        }
        return 0;
    }


    dropdownToggle(input: any, val: any, discountType: string, discountValue: string, prClass: string, autofi: any = '') {
        let expandStatus: string = '';
        let pageTextTaxFees: string = '';
        let pageTextTaxFeesauto: string = '';
        if (val == 0)
            return;

        input.previousElementSibling.classList.toggle("payOpt__bill--dropdown--open");
        if (input.classList.contains("closeIt")) {
            $('.' + prClass).removeClass("closeIt");
            // jQuery.noConflict();
            // (function($) {
            // $('.' + prClass).removeClass("closeIt");
            // })(jQuery);


            expandStatus = "open";
            if (prClass == 'DueDropdown_drop') {
                if (autofi == 'autofi') {
                    MerkleHandler.merkleexecutor('due-at-signing-open', '', discountType);
                }
            }
            if (prClass == 'taxfeeLDropdown_drop') {
                if (autofi == 'autofi') {
                    MerkleHandler.merkleexecutor('taxes-fee-open', '', discountType);
                }
            }
            if (prClass == 'taxfeeFDropdown_drop') {
                if (autofi == 'autofi') {
                    MerkleHandler.merkleexecutor('taxes-fee-open', '', discountType);
                }
            }
            if (prClass == 'monthlyTaxLDropdown_drop') {
                if (autofi == 'autofi') {
                    // MerkleHandler.merkleexecutor('Estimated-Monthly-Taxes-open','',discountType);
                }
            }
            if (prClass == 'upTaxLDropdown_drop') {
                if (autofi == 'autofi') {
                    // MerkleHandler.merkleexecutor('Estimated-Upfront-Taxes-open','',discountType);
                }
            }
            if (prClass == 'upFeeLDropdown_drop') {
                if (autofi == 'autofi') {
                    // MerkleHandler.merkleexecutor('Upfront-Fees-open','',discountType);
                }
            }
            if (prClass == 'cashdnDropdown_drop') {
                if (autofi == 'autofi') {
                    MerkleHandler.merkleexecutor('cashdown-open', '', discountType);
                }
            }

        } else {
            $('.' + prClass).addClass("closeIt");
            // jQuery.noConflict();
            // (function($) {
            // $('.' + prClass).addClass("closeIt");
            // })(jQuery);

            expandStatus = "close";
            if (input == 'DueDropdown') {
                if (autofi == 'autofi') {
                    MerkleHandler.merkleexecutor('due-at-signing-close', '', discountType);
                }
            }

            if (input == 'taxfeeLDropdown_drop') {
                if (autofi == 'autofi') {
                    MerkleHandler.merkleexecutor('taxes-fee-close', '', discountType);
                }
            }
            if (prClass == 'taxfeeFDropdown_drop') {
                if (autofi == 'autofi') {
                    MerkleHandler.merkleexecutor('taxes-fee-close', '', discountType);
                }
            }
            if (prClass == 'monthlyTaxLDropdown_drop') {
                if (autofi == 'autofi') {
                    // MerkleHandler.merkleexecutor('Estimated-Monthly-Taxes-close','',discountType);
                }
            }
            if (prClass == 'upTaxLDropdown_drop') {
                if (autofi == 'autofi') {
                    // MerkleHandler.merkleexecutor('Estimated-Upfront-Taxes-close','',discountType);
                }
            }
            if (prClass == 'upFeeLDropdown_drop') {
                if (autofi == 'autofi') {
                    // MerkleHandler.merkleexecutor('Upfront-Fees-close','',discountType);
                }
            }
            if (prClass == 'cashdnDropdown_drop') {
                if (autofi == 'autofi') {
                    MerkleHandler.merkleexecutor('cashdown-close', '', discountType);
                }
            }
        }

        if (discountValue == "incentive" || discountValue == "conditional-offer" || discountValue == "dealer-discount") {
            if (discountValue == "conditional-offer") {
                if (autofi == 'autofi') {
                    MerkleHandler.merkleexecutor('review-payment-option-discountsautofi', '', discountType + "calc" + ':' + "explore-" + discountValue + "s" + ':' + expandStatus);
                } else {
                    MerkleHandler.merkleexecutor('review-payment-option-discounts', '', discountType + ':' + discountValue + ':' + expandStatus);
                }
            } else {
                if (autofi == 'autofi') {
                    MerkleHandler.merkleexecutor('review-payment-option-discountsautofi', '', discountType + "calc" + ':' + discountValue + "s" + ':' + expandStatus);
                } else {
                    MerkleHandler.merkleexecutor('review-payment-option-discounts', '', discountType + ':' + discountValue + ':' + expandStatus);
                }
            }

        } else if (val == 2) {
            pageTextTaxFees = "inwidget:" + discountType + ":" + expandStatus;
            if (autofi != 'autofi') {
                MerkleHandler.merkleexecutor('tax-and-fees', 2, pageTextTaxFees);
            }
        } else {
            if (discountValue == 'Monthly') {
                discountValue = "Monthly-Service-and-Protection-Plans";
            } else if (discountValue == 'Flat') {
                discountValue = "Service-and-Protection-Plans";
            } else if (discountValue == "dealer_fee_in_lease") {
                discountValue = "Monthly Fees";
            } else if (discountValue == "Standard") {
                discountValue = "Upfront Fees";
            }

            if (discountValue) {
                discountValue = discountValue.toString().replace(" ", "-");
                if (discountValue == 'Monthly-Taxes') {
                    discountValue = 'Estimated-Monthly-Taxes'
                }
                if (discountValue == 'Monthly-Fees') {
                    discountValue = 'Monthly-fees'
                }
                if (discountValue == 'Upfront-Taxes') {
                    discountValue = 'Estimated-Upfront-Taxes'
                }
                pageTextTaxFees = "inwidget:" + this.make + ":" + discountType + ":" + discountValue + "-" + expandStatus;
                pageTextTaxFeesauto = "inwidget:" + this.make + ":" + discountType + "calc:" + discountValue + "-" + expandStatus;
                if (autofi == 'autofi') {
                    MerkleHandler.merkleexecutor('tax-and-fees-autofi', '', pageTextTaxFeesauto);
                } else if (autofi != 'autofi') {
                    MerkleHandler.merkleexecutor('tax-and-fees', '', pageTextTaxFees);
                }

            }
        }
    }

    updatePaymentCalcualtor() {
        DataHandler.updateleasecalulation = true
        this.getLeaseDetails()
    }


    onCheckboxChange_lease(obj: any, ty: any = 1, tierclick: any = 0, groupName: any = '', ex: any = '', autofi: any = '', type: string = '') {
        if (type === 'creditRating') {
            const selectedTier = this.leaserangearr.find((tier: any) => tier.code === obj);
            const combinedString = `Tier ${selectedTier.code} (${selectedTier.low}-${selectedTier.high}) - ${selectedTier.txtdisp}`;
            this.adobe_sdg_event('interaction-click', { type: type, value: combinedString });
        } else if (type && type.trim() !== '') {
            this.adobe_sdg_event('interaction-click', { type: type, value: obj });
        }

        if (obj == '') {
            this.leasetradein = DataHandler.leasetradein;
            this.leasedownpayment = DataHandler.leasedownpayment;
            //console.log("obj is empty", DataHandler.leasedownpayment);
            this.defualtmileage = DataHandler.leasemileage;
            this.defaultterm = DataHandler.leasedafaultterm;
            this.leasetier = DataHandler.leasetier;
        }
        let downpay: any, tradein: any;
        let ids: Array<any> = [];
        //Downpayment calculation
        if (groupName == 'downpay') {
            DataHandler.prevdownlease = this.leasedownpayment.toString().replaceAll(',', '');
            DataHandler.get_down_pay_from_ui = '0';
            obj = obj.target.value
            //downpay = obj.replace(',', '');
            downpay = (typeof obj === 'string' ? obj.replace(',', '') : obj) ?? obj;
            
            if(downpay == '' || downpay == null || downpay == undefined){
                downpay = '0'
            }
           // console.log("hlo",downpay);
            if(downpay < DataHandler.minimumleasedownpayment){
                this.showleasedownpaymenterror = true 
                this.showfinancedownpaymenterror = true 
                downpay = DataHandler.minimumleasedownpayment
               // console.log("hlo");
            }
        } else {
            if (typeof this.leasedownpayment === 'string') {
                downpay = this.leasedownpayment.replace(',', '');
            } else {
                downpay = this.leasedownpayment;
            }
            if (groupName == 'tradein') {
                DataHandler.get_down_pay_from_ui = '0';
            } else if (groupName == 'tradein-ui') {
                DataHandler.get_down_pay_from_ui = '0';
            }

        }
       // console.log(downpay,DataHandler.minimumleasedownpayment)
        // if(downpay < DataHandler.minimumleasedownpayment){
        //     this.showleasedownpaymenterror = true  
        // }else{
        //     this.showleasedownpaymenterror = false
        // }

        //Tradein calculation
        if (groupName == 'tradein') {
            if (typeof this.leasetradein === 'string') {
                DataHandler.prevtradeinlease = this.leasetradein.replace(',', '');
            } else {
                DataHandler.prevtradeinlease = this.leasetradein;
            }
            obj = obj.target.value
            tradein = (typeof obj === 'string' ? obj.replace(',', '').trim() : obj) ?? obj;
            //tradein = obj.replace(',', '').trim();
            if (tradein == '') {
                tradein = '0';
            }
        } else {
            if (typeof this.leasetradein === 'string') {
                tradein = this.leasetradein.replace(',', '');
            } else {
                tradein = this.leasetradein;
            }
        }
        this.financetradein = tradein;
        this.cashtradein = tradein;

        if (tierclick == 1) {
            DataHandler.leasetier = this.leasetier = obj;
            for (let i = 0; i < this.financerangearr.length; i++) {
                if (this.financerangearr[i].code == this.leasetier) {
                    DataHandler.financetier = this.financetier = this.leasetier;
                }
            }
            if (autofi == 'autofi') {
                MerkleHandler.merkleexecutor('payment-option-credit-range-autofi', 'lease', this.leasetier);
            } else {
                MerkleHandler.merkleexecutor('payment-option-credit-range', 'lease', this.leasetier);
            }

        }

        // conditional offer calculation
        if (this.conditionaldata.length > 0) {
            for (let i = 0; i < this.conditionaldata.length; i++) {
                if (this.conditionaldata[i].checked == 1) {
                    ids.push(this.conditionaldata[i].programId);
                }
            }
        }
        DataHandler.eshopLeaseConditionalOffer = this.conditionaldata;
        //Incentive calculation
        if (this.incentivedata.length > 0) {
            for (let i = 0; i < this.incentivedata.length; i++) {
                if (this.incentivedata[i].checked == 1) {
                    ids.push(this.incentivedata[i].programId);
                }
            }
        }

        //Mopar calculation
        if (groupName == 'mopar') {
            for (let i = 0; i < this.payload_mopar_accessries.length; i++) {
                if (ex == this.payload_mopar_accessries[i].part_no) {
                    this.payload_mopar_accessries[i].checked = !obj.selected;
                }
            }
            let moparelement = [];
            let moparKey = 0;
            for (let j = 0; j < this.payload_mopar_accessries.length; j++) {
                if (this.payload_mopar_accessries[j].checked == undefined || !this.payload_mopar_accessries[j].checked) {
                    moparelement[moparKey] = this.payload_mopar_accessries[j].part_no;
                    moparKey++;
                }
            }
            DataHandler.moparid = moparelement.join(',');
        }

        const prevValueLease = this.defaultterm;
        if (ty == 2) {
            const selectedValue = obj;
            if ((prevValueLease === selectedValue) || selectedValue === undefined || this.defaultterm === undefined || this.defaultterm === '') {
                return;
            }
            this.isChipListDisabled = true; 
            this.defaultterm = selectedValue;
            DataHandler.leasedafaultterm = this.defaultterm;
            this.observableService.setSelectedLeaseTerm(selectedValue);
            if (autofi == 'autofi') {
                MerkleHandler.merkleexecutor('payment-option-term-duration-autofi', 'lease', this.defaultterm);
            } else {
                MerkleHandler.merkleexecutor('payment-option-term-duration', 'lease', this.defaultterm);
            }

            if (DataHandler.custom_plan_added == 0) {
                DataHandler.leaseRefresh = true;
                if (this.defaultterm !== undefined) {
                    this.observableService.getLeasePlane();
                }
            }

        }
        if (ty == 3) {
    
            this.defualtmileage = obj.value;
            if (autofi == 'autofi') {
                MerkleHandler.merkleexecutor('payment-option-annual-mileage-autofi', 'lease', this.defualtmileage);
            } else {
                MerkleHandler.merkleexecutor('payment-option-annual-mileage', 'lease', this.defualtmileage);
            }
        }
        DataHandler.leaseincentiveIds = ids.toString();
        if (groupName == 'downpay') {
            this.downPaymentChanged = true;
            this.leasedownpayment_disp =   this.leasedownpayment = DataHandler.leasedownpayment = this.financedownpayment = DataHandler.financedownpayment = downpay;
        } else {    
            this.leasedownpayment = this.leasedownpayment_disp = DataHandler.leasedownpayment = DataHandler.financedownpayment = downpay;
        }
       // downpay = (typeof obj === 'string' ? downpay.replace(',', '').trim() : downpay) ?? downpay;
        DataHandler.leasetradein = DataHandler.financetradein = DataHandler.cashtradein = tradein;
        DataHandler.leasemileage = this.defualtmileage;
        if (ex == 'term') {
            DataHandler.programtype = ''
            //this.eventEmitterService.fnUpdateTerm();
            setTimeout(() => {
                this.dispatchLeaseDetailsAPICall(this.zipcode, downpay, tradein, this.defaultterm, this.defualtmileage, '', '0', this.customerstate, this.countycity, 'Y', DataHandler.leasetier, this.lenderCode);
            }, 2000);
        } else {
            const remove_duplicatesincentiveIds = ids.map(String);
            const remove_lease_insentiveids = Array.from(new Set(remove_duplicatesincentiveIds));
            var x = '1';
            if (DataHandler.private_Offer_Status == true && this.private_offer_refresh == false) x = '0';
            this.dispatchLeaseDetailsAPICall(this.zipcode, downpay, tradein, this.defaultterm, this.defualtmileage, remove_lease_insentiveids.toString(), x, this.customerstate, this.countycity, 'Y', DataHandler.leasetier, this.lenderCode);
            this.private_offer_refresh = true;
        }
        if (groupName == 'downpay' || groupName == 'tradein' || groupName == 'credit') {
            if (this.incentiveUserSelected) {
                this.onCheckboxChange_finance('', 3, 0, 'tradein-ui');
            } else {
                this.onCheckboxChange_finance('', 1, 0, 'tradein-ui');
            }
        }
        if (groupName == 'tradein') {
            this.onCheckboxChange_cash('');
        }
    }

    onCheckboxChange_finance(obj: any, ty: any = 1, tierclick: any = 0, groupName: any = '', ex: any = '', autofi: any = '', type: string = '') {
        if (type === 'creditRating') {
            const selectElement = obj;
            const selectedValue = selectElement;
            const selectedTier = this.leaserangearr.find((tier: any) => tier.code === selectedValue);
            const combinedString = `Tier ${selectedTier.code} (${selectedTier.low}-${selectedTier.high}) - ${selectedTier.txtdisp}`;
            this.adobe_sdg_event('interaction-click', { type: type, value: combinedString });
        } else if (type && type.trim() !== '') {
            this.adobe_sdg_event('interaction-click', { type: type, value: obj });
        }
        if (obj == '') {
            if(DataHandler.financedownpayment != undefined && DataHandler.financedownpayment != null ){
                this.financedownpayment =  DataHandler.financedownpayment;
            }
            //this.financedownpayment =  DataHandler.financedownpayment;
            this.financetradein = DataHandler.financetradein;
            this.defaultfinanceterm = DataHandler.financedafaultterm;
            this.financetier = DataHandler.financetier;
            this.financeconditionaldata = DataHandler.eshopFinanceConditionalOffer;
        }

        var downpay: any, tradein: any;
        var ids: Array<any> = [];
        if (ex == 'sp') {
            this.isTermChanged = 'yes';
        }

        //Downpayment calculation
        if (groupName == 'downpay') {
            DataHandler.fin_get_down_pay_from_ui = '0';
            DataHandler.prevdownfinance = this.financedownpayment.toString().replaceAll(',', '');
            obj = obj.target.value
            downpay = (typeof obj === 'string' ? obj.replace(',', '') : obj) ?? obj;
            if(downpay == '' || downpay == undefined || downpay == null){
                downpay = '0'
            }
            if(downpay < DataHandler.minimumfinancedownpayment){
                this.showfinancedownpaymenterror  = true
                this.showleasedownpaymenterror = true 
                downpay = DataHandler.minimumfinancedownpayment
            }
            DataHandler.financedownpayment = downpay
            
           
        } else {
            if (typeof this.financedownpayment === 'string') {
                downpay = this.financedownpayment.replace(',', '');
            } else {
                downpay = this.financedownpayment;
            }
            if (groupName == 'tradein') {
                DataHandler.fin_get_down_pay_from_ui = '0';
            } else if (groupName == 'tradein-ui') {
                DataHandler.fin_get_down_pay_from_ui = '0';
            }
        }

        // if(downpay < DataHandler.minimumfinancedownpayment){
        //         this.showfinancedownpaymenterror  = true
        // }else{
        //       this.showfinancedownpaymenterror = false
        // }

        //Tradein calculation
        if (groupName == 'tradein') {
            if (typeof this.financetradein === 'string') {
                DataHandler.prevtradeinfinance = this.financetradein.replace(',', '');
            } else {
                DataHandler.prevtradeinfinance = this.financetradein;
            }
            //tradein = obj.replace(',', '').trim();
            obj = obj.target.value
            tradein = (typeof obj === 'string' ? obj.replace(',', '').trim() : obj) ?? obj;
            if (tradein == '') {
                tradein = '0';
            }
        } else {
            if (typeof this.financetradein === 'string') {
                tradein = this.financetradein.replace(',', '');
            } else {
                tradein = this.financetradein;
            }
        }
        this.leasetradein = tradein;
        this.cashtradein = tradein;

        if (tierclick == 1) {
            DataHandler.leasetier = this.leasetier = DataHandler.financetier = this.financetier = obj;
            if (autofi == 'autofi') {
                MerkleHandler.merkleexecutor('payment-option-credit-range-autofi', 'finance', this.financetier);
            } else {
                MerkleHandler.merkleexecutor('payment-option-credit-range', 'finance', this.financetier);
            }
        }

        // conditional offer calculation
        if (this.financeconditionaldata.length > 0) {
            for (let i = 0; i < this.financeconditionaldata.length; i++) {
                if (this.financeconditionaldata[i].checked == 1) {
                    ids.push(this.financeconditionaldata[i].programId);
                }
            }
        }
        DataHandler.eshopFinanceConditionalOffer = this.financeconditionaldata;
        //Incentive calculation
        if (this.financeincentivedata.length > 0) {
            for (let i = 0; i < this.financeincentivedata.length; i++) {
                if (this.financeincentivedata[i].checked == 1) {
                    ids.push(this.financeincentivedata[i].programId);
                }
            }
        }
        const prevValue = this.defaultfinanceterm;
        
        if (ty == 2) {
            const selectedValue = obj;
            if ((prevValue === selectedValue) || selectedValue === undefined || this.defaultfinanceterm === undefined || this.defaultfinanceterm === '') {
                return;
            }
            this.isChipListDisabledFinance = true;
            this.defaultfinanceterm = selectedValue;
            DataHandler.financedafaultterm = this.defaultfinanceterm;
            
            if (autofi == 'autofi') {
                MerkleHandler.merkleexecutor('payment-option-term-duration-autofi', 'finance', this.defaultfinanceterm);
            } else {
                MerkleHandler.merkleexecutor('payment-option-term-duration', 'finance', this.defaultfinanceterm);
            }
            if (DataHandler.custom_plan_added == 0) {
                DataHandler.financeRefresh = true;
                if (this.defaultfinanceterm !== undefined) {
                    this.observableService.getFinancePlane();
                }
            }
            DataHandler.aprchanged = false 
            this.lowestType = DataHandler.lowestType =''
            DataHandler.financeapr = '';
        }

        if (ty == 3) {
            this.incentiveUserSelected = true;
        } else {
            this.incentiveUserSelected = false;
        }

        //Mopar calculation
        if (groupName == 'mopar') {
            for (let i = 0; i < this.payload_mopar_accessries.length; i++) {
                if (ex == this.payload_mopar_accessries[i].part_no) {
                    this.payload_mopar_accessries[i].checked = !obj.selected;
                }
            }
            let moparelement = [];
            let moparKey = 0;
            for (let j = 0; j < this.payload_mopar_accessries.length; j++) {
                if (this.payload_mopar_accessries[j].checked == undefined || !this.payload_mopar_accessries[j].checked) {
                    moparelement[moparKey] = this.payload_mopar_accessries[j].part_no;
                    moparKey++;
                }
            }
            DataHandler.moparid = moparelement.join(',');
        }

        DataHandler.financeincentiveIds = ids.toString();
        if (groupName == 'downpay') {
            this.downPaymentChanged = true;
            this.financedownpayment_disp = this.financedownpayment = DataHandler.financedownpayment = this.leasedownpayment = DataHandler.leasedownpayment = downpay;
        } else {
            this.financedownpayment_disp = this.financedownpayment = DataHandler.financedownpayment = downpay;
        }
        DataHandler.leasetradein = DataHandler.financetradein = DataHandler.cashtradein = tradein;
        if (ex == 'term') {
            this.termUpdateCallApi = true;
        }
        if (ex == 'term') {
            DataHandler.conditionalFinanceDataToShow = []
             this.conditionalFinanceDataToShow = []
       // this.financeincentivedata = []
            this.financeconditionaldata = []
            this.eventEmitterService.fnUpdateTerm();
            setTimeout(() => {
                DataHandler.financestate = '0'
                this.dispatchFinanceDetailsAPICall(this.zipcode, downpay, tradein, this.defaultfinanceterm, '', '0', this.customerstate, this.countycity, DataHandler.financetier, this.lenderCode);
            }, 1000);
        } else {
            if (this.is_homenet_vin == 'Y') {
                DataHandler.base_msrp = this.finance_homenet_list_price;
            }
            this.dispatchFinanceDetailsAPICall(this.zipcode, downpay, tradein, this.defaultfinanceterm, ids.toString(), '1', this.customerstate, this.countycity, DataHandler.financetier, this.lenderCode);
        }
        if (groupName == 'downpay' || groupName == 'tradein' || groupName == 'credit') {
            this.onCheckboxChange_lease('', 1, 0, 'tradein-ui');
        }
        if (groupName == 'tradein') {
            this.onCheckboxChange_cash('');
        }
    }

    radioAprRateChange(event: any) {
        let selected_radio = event.value;
        if (selected_radio !== undefined && selected_radio !== null) {
            if (selected_radio === 'defaultapr') {
                DataHandler.aprRateType = 'defaultapr';
                DataHandler.financeapr = this.financeapr;
                /*  DataHandler.financeaprtype = 'default';
                  DataHandler.lowestType = 'defaultapr';*/
            }
            if (selected_radio === 'thirdpartyapr') {
                DataHandler.aprRateType = 'thirdpartyapr';
                DataHandler.financeapr = this.financeaprthirdparty;
            }
            
            this.onCheckboxChange_finance('');
        }
    }
    thirdpartyaprChange(event: KeyboardEvent): void {
        DataHandler.aprRateType = 'thirdpartyapr';
        DataHandler.financeapr = this.financeaprthirdparty = (event.target as HTMLInputElement).value;
        this.onCheckboxChange_finance('');
    }
    onCheckboxChange_cash(obj: any = '', groupName: any = '', ex: any = '', type: string = '') {
        if (type && type.trim() !== '') {
            this.adobe_sdg_event('interaction-click', { type: type, value: obj.value });
        }

        if (obj == '') {
            this.cashtradein = DataHandler.cashtradein;
        }
        var ids: Array<any> = [];
        var tradein;

        //Tradein calculation
        if (groupName == 'tradein') {
            obj = obj.target.value
            tradein = (typeof obj === 'string' ? obj.replace(',', '').trim() : obj) ?? obj;
            //tradein = obj.currentTarget?.value.replace(',', '').trim();
            if (tradein == '') {
                tradein = '0';
            }
        } else {
            if (typeof this.cashtradein === 'string') {
                tradein = this.cashtradein.replace(',', '');
            } else {
                tradein = this.cashtradein;
            }
        }
        this.leasetradein = tradein;
        this.financetradein = tradein;
        DataHandler.leasetradein = DataHandler.financetradein = DataHandler.cashtradein = tradein;

        // conditional offer calculation
        if (this.cashconditionaldata.length > 0) {
            for (let i = 0; i < this.cashconditionaldata.length; i++) {
                if (this.cashconditionaldata[i].checked == 1) {
                    ids.push(this.cashconditionaldata[i].programId);
                }
            }
        }
        //Incentive calculation
        if (this.cashincentivedata.length > 0) {
            for (let i = 0; i < this.cashincentivedata.length; i++) {
                if (this.cashincentivedata[i].checked == 1) {
                    ids.push(this.cashincentivedata[i].programId);
                }
            }
        }

        //Mopar calculation
        if (groupName == 'mopar') {
            for (let i = 0; i < this.payload_mopar_accessries.length; i++) {
                if (ex == this.payload_mopar_accessries[i].part_no) {
                    this.payload_mopar_accessries[i].checked = !obj.target.checked;
                }
            }
            let moparelement = [];
            let moparKey = 0;
            for (let j = 0; j < this.payload_mopar_accessries.length; j++) {
                if (this.payload_mopar_accessries[j].checked == undefined || !this.payload_mopar_accessries[j].checked) {
                    moparelement[moparKey] = this.payload_mopar_accessries[j].part_no;
                    moparKey++;
                }
            }
            DataHandler.moparid = moparelement.join(',');
        }
        this.dispatchCashDetailsAPICall(this.zipcode, tradein, ids.toString(), '1', this.customerstate, this.countycity, this.lenderCode);
        if (groupName == 'tradein') {
            this.onCheckboxChange_lease('', 1, 0, 'tradein-ui');
            if (this.incentiveUserSelected) {
                this.onCheckboxChange_finance('', 3, 0, 'tradein-ui');
            } else {
                this.onCheckboxChange_finance('', 1, 0, 'tradein-ui');
            }
        }
    }

    submittodealer(obj: string, autofi: any = '') {
        if (autofi == 'autofi') {
            MerkleHandler.merkleexecutor('view-available-offers-from-your-dealer-autofi', '', obj);
        } else {
            MerkleHandler.merkleexecutor('view-available-offers-from-your-dealer', '', obj);
        }

        this.eventEmitterService.opensubmitButton(2);
    }

    estimatepopupFn(type: string) {
        if (type == 'zip') {
            DataHandler.isClickZipCode = true;
        }
        else {
            DataHandler.isClickZipCode = false;
        }
        // this.eventEmitterService.fnPageStatebetter('');
        // setTimeout(() => {
        //   this.eventEmitterService.fnPageStatebetter('betterEstimate');
        // },100);
        DataHandler.initialprequal = true;
        this.eventEmitterService.openestimatepopup();
    }

    track(event: any, autofi: any = '', lableAutofi = '') {
        let label;
        if (event == '') {
            label = lableAutofi;
        } else {
            label = event?.tab?.textLabel;
        }
        if (label.toLowerCase() != DataHandler.objActivePaymentData.activeTab) {
            if (autofi == 'autofi') {
                this.eventEmitterService.fnupdatemaincalc(label);
                MerkleHandler.merkleexecutor('auto' + label);
            } else {
                MerkleHandler.merkleexecutor(label);
            }
            DataHandler.paymenttype = label;
            GoogleAnalyticsHandler.googleAnalyticsExecutor(label);
            DataHandler.objActivePaymentData.activeTab = label.toLowerCase();
            //this.activeTab = DataHandler.objActivePaymentData.activeTab;
            if (DataHandler.paymenttype.toLowerCase() == 'lease') {
                this.onCheckboxChange_lease('', 1, 0, 'tradein-ui');

                // if (DataHandler.autofiopen != 1) {
                //   this.eventEmitterService.togglefrompaymenttab('lease');
                // }

                if (this.LeaseGoalGAFirstTime == 0) {
                    GoogleAnalyticsHandler.googleAnalyticsExecutor('LeasePayment-GaGoal');
                    this.ga4Service.submit_to_api('LeasePayment', '', '', '', '', '', '').subscribe((response) => { });
                    this.ga4dealerService.submit_to_api_ga4dealer('LeasePayment').subscribe((response: any) => {});
                    this.ga4dealerService.fire_asc_events('LeasePayment').subscribe((response: any) => { });
                    this.LeaseGoalGAFirstTime = 1;
                }
            } else if (DataHandler.paymenttype.toLowerCase() == 'finance') {
                if (this.incentiveUserSelected) {
                    this.onCheckboxChange_finance('', 3, 0, 'tradein-ui');
                } else {
                    this.onCheckboxChange_finance('', 1, 0, 'tradein-ui');
                }
                if (this.FinanceGoalGAFirstTime == 0) {
                    GoogleAnalyticsHandler.googleAnalyticsExecutor('FinancePayment-GaGoal');
                    this.ga4Service.submit_to_api('FinancePayment', '', '', '', '', '', '').subscribe((response) => { });
                    this.ga4dealerService.submit_to_api_ga4dealer('FinancePayment').subscribe((response: any) => {});
                    this.ga4dealerService.fire_asc_events('FinancePayment').subscribe((response: any) => { });
                    this.FinanceGoalGAFirstTime = 1;
                }
                // if (DataHandler.autofiopen != 1) {
                //   this.eventEmitterService.togglefrompaymenttab('finance');
                // }
            } else if (DataHandler.paymenttype.toLowerCase() == 'cash') {
                ;
                // if (DataHandler.autofiopen != 1) {
                //   this.eventEmitterService.togglefrompaymenttab('cash');
                // }
                this.onCheckboxChange_cash('');
                if (this.CashGoalGAFirstTime == 0) {
                    GoogleAnalyticsHandler.googleAnalyticsExecutor('CashPayment-GaGoal');
                    this.ga4Service.submit_to_api('CashPayment', '', '', '', '', '', '').subscribe((response) => { });
                    this.ga4dealerService.submit_to_api_ga4dealer('CashPayment').subscribe((response: any) => {})
                    this.ga4dealerService.fire_asc_events('CashPayment').subscribe((response: any) => { })
                    this.CashGoalGAFirstTime = 1;
                }
            }
        }
        setTimeout(() => {
            ShiftDigitalHandler.shiftdigitalexecutorpaymentcalc('Payment Calc Interaction tab');
        }, 2000);
    }

    openApplyForCredit(paymentType: any) {
        this.eventEmitterService.fnOpenApplyForCredit();
    }

    checkLeaseValue() {
        var leaseValue = 0;
        if (this.leasemonthlytaxesval != undefined && this.leasemonthlytaxesval != 0) {
            leaseValue = this.leasemonthlytaxesval?.toString().replace(',', '');
            if (this.leaseAmountForDisplay <= 0) {
                leaseValue = 0;
            }
        } else if (this.leasemonthlytaxesval == undefined || this.leasemonthlytaxesval == 0) {
            leaseValue = this.monthlycost?.toString().replace(',', '');
            if (this.leaseAmountForDisplay <= 0) {
                leaseValue = 0;
            }
        }
        //DataHandler.monthlyLeaseValue = leaseValue
        this.observableService.setleaseMonthlyPayment(leaseValue);
        return leaseValue;
    }

    checkFinanceValue() {
        var leaseValue = 0;
        if (this.financeflag == 1) {
            leaseValue = this.financeamountwithSandP?.toString().replace(',', '');
        }
        return leaseValue;
    }
    leasetabga4() {
        this.paymentType = 'lease';
        this.adobe_sdg_event('interaction-click', { type: 'paymentEstimationTypeClick', value: 'lease' });
        this.ga4Service.submit_to_api('LeasePayment', '', '', '', '', '', '').subscribe((response) => { });
        this.ga4dealerService.submit_to_api_ga4dealer('LeasePayment').subscribe((response: any) => {});
        this.ga4dealerService.fire_asc_events('LeasePayment').subscribe((response: any) => { });
    }
    financetabga4() {        
        this.paymentType = 'finance';
        this.adobe_sdg_event('interaction-click', { type: 'paymentEstimationTypeClick', value: 'finance' });
        this.ga4Service.submit_to_api('FinancePayment', '', '', '', '', '', '').subscribe((response) => { });
        this.ga4dealerService.submit_to_api_ga4dealer('FinancePayment').subscribe((response: any) => {});
        this.ga4dealerService.fire_asc_events('FinancePayment').subscribe((response: any) => { });
    }
    cashtabga4() {
        this.paymentType = 'cash';
        this.adobe_sdg_event('interaction-click', { type: 'paymentEstimationTypeClick', value: 'cash' });
        this.ga4Service.submit_to_api('CashPayment', '', '', '', '', '', '').subscribe((response) => { });
        this.ga4dealerService.submit_to_api_ga4dealer('CashPayment').subscribe((response: any) => {})
        this.ga4dealerService.fire_asc_events('CashPayment').subscribe((response: any) => { })
    }
    updateProgramtype(obj: any, prgVal: any) {
        //DataHandler.programtype = prgVal;
        DataHandler.programtype = prgVal
        //console.log("P"+DataHandler.programtype,prgVal)
       
       
        this.termUpdateCallApi = true;
        if (prgVal == 'Subvented Lease') {
          this.isNonSubvented = true;
         // console.log(" call 14:lease");
    
         this.dispatchLeaseDetailsAPICall(DataHandler.zipcode, this.leasedownpayment, this.leasetradein?.toString().replaceAll(',', ''), this.defaultterm, this.defualtmileage, '', '0', this.customerstate, this.countycity, 'Y', DataHandler.leasetier, this.lenderCode);
        } else if(prgVal == 'Non-subvented Lease'){
          //console.log(" call 15:lease");
          this.dispatchLeaseDetailsAPICall(DataHandler.zipcode, this.leasedownpayment, this.leasetradein?.toString().replaceAll(',', ''), this.defaultterm, this.defualtmileage, '', '0', this.customerstate, this.countycity, 'Y', DataHandler.leasetier, this.lenderCode);
        }
    }
    updatePaymentSNS(obj: any, prVal: any, apr: any) {
        DataHandler.aprchanged = true
       // DataHandler.lowestType = prVal;
        this.lowestType =DataHandler.lowestType =  prVal+"_"+apr;
       // console.log("this.lowestType",this.lowestType)
        var downpay, tradein, terms;
        var ids: Array<any> = [];
        downpay = this.financedownpayment.toString().replace(',', '');
        tradein = this.financetradein.replace(',', '');
        var terms = this.defaultfinanceterm;
        this.financeIncentiveReset = true;

        DataHandler.conditionalFinanceDataToShow = []
        this.conditionalFinanceDataToShow = []
       // this.financeincentivedata = []
        this.financeconditionaldata = []

        // conditional offer calculation
        if (this.financeconditionaldata?.length > 0) {
            for (let i = 0; i < this.financeconditionaldata.length; i++) {
                if (this.financeconditionaldata[i].checked == 1) {
                    ids.push(this.financeconditionaldata[i].programId);
                }
            }
        }

        //Incentive calculation
        if (this.financeincentivedata?.length > 0) {
            for (let i = 0; i < this.financeincentivedata.length; i++) {
                if (this.financeincentivedata[i].checked == 1) {
                    ids.push(this.financeincentivedata[i].programId);
                }
            }
        }

        DataHandler.financeapr = apr
        /*let lowestTypeValue= DataHandler.lowestType.split('_')
        let lowestType = lowestTypeValue[0]
        let lowestAprRate  = lowestTypeValue[1]
        if(lowestType.toLowerCase() == 'subvented retail finance'){
            lowestType ='lowest_apr'
        }else if(lowestType.toLowerCase() == 'non-subvented finance'){
            lowestType = 'lowest_price'
        }else if(lowestType.toLowerCase() == 'estimated apr'){
            lowestType='dealer_price'
        }
        DataHandler.actualLowestType = lowestType;
        DataHandler.actualFinanceRate = lowestAprRate*/

        this.termUpdateCallApi = true;
        DataHandler.isAprChange = true
        if (prVal == 'lowest_price' || prVal == 'dealer_price') {
            this.dispatchFinanceDetailsAPICall(this.zipcode, downpay, tradein, terms, '', '0', this.customerstate, this.countycity, DataHandler.financetier, this.lenderCode);
        } else {
            this.dispatchFinanceDetailsAPICall(this.zipcode, downpay, tradein, terms, '', '0', this.customerstate, this.countycity, DataHandler.financetier, this.lenderCode);
        }
    }


    updateFinanceForPrivate() {
        DataHandler.financestate = '0'
        this.dispatchFinanceDetailsAPICall(this.zipcode, 0, 0, 0, '', '0', '', '', DataHandler.financetier, this.lenderCode);
    }

    updateCashForPrivate() {
        this.dispatchCashDetailsAPICall(this.zipcode, 0, '', '0', '', '', this.lenderCode);
    }

    openConditionalOffersDialogLease(hideConditionalOffter: any, noeligible: any) {
        // will log the entire data object
        this.hideConditionalOffter = hideConditionalOffter;
        var conditionalDataNew: any = {};
        for (let i = 0; i < this.conditionaldata.length; i++) {
            if (conditionalDataNew[this.conditionaldata[i].group] == undefined) {
                conditionalDataNew[this.conditionaldata[i].group] = [];
            }
            conditionalDataNew[this.conditionaldata[i].group].push(this.conditionaldata[i]);
        }

        let i = 0;
        let k: keyof typeof conditionalDataNew;
        for (k in conditionalDataNew) {
            // Remove duplicates based on programId
            const uniqueData = conditionalDataNew[k].filter((item: any, index: number, self: any[]) =>
                index === self.findIndex((t: any) => (
                    t.programId === item.programId
                ))
            );
            this.conditionalLeaseDataToShow[i] = [];
            this.conditionalLeaseDataToShow[i]['name'] = k;
            this.conditionalLeaseDataToShow[i]['data'] = uniqueData;
            i++;
        }
        this.conditionalLeaseDataToShow.forEach((group: any) => {
            group.data.forEach((item: any) => {
                for (i = 0; i < this.stack?.length; i++) {
                    if (item.includes(this.stack?.eligible[i].value)) {
                        this.customStrike = false;
                    } else {
                        this.customStrike = true;
                    }
                }
            });
        });
        DataHandler.conditionalLeaseDataToShow = this.conditionalLeaseDataToShow;

        if (noeligible != undefined) {
            this.checkeligibilityLease(noeligible);
        }
    }

    openConditionalOffersDialogFinance(hideConditionalOffter: any, noeligible: any) {
        // will log the entire data object
        this.hideConditionalOffter = hideConditionalOffter;
        var conditionalDataNew: any = {};
        for (let i = 0; i < this.financeconditionaldata?.length; i++) {
            if (this.financeconditionaldata[i].checked == 1) {
                this.financeconditionaldata[i].isChecked = true;
            } else {
                this.financeconditionaldata[i].isChecked = false;
                this.financeconditionaldata[i].noeligible = false;
            }
            if (conditionalDataNew[this.financeconditionaldata[i].group] == undefined) {
                conditionalDataNew[this.financeconditionaldata[i].group] = [];
            }
            conditionalDataNew[this.financeconditionaldata[i].group].push(this.financeconditionaldata[i]);

        }

        let i = 0;
        let k: keyof typeof conditionalDataNew;
        for (k in conditionalDataNew) {
            // Remove duplicates based on programId
            const uniqueData = conditionalDataNew[k].filter((item: any, index: number, self: any[]) =>
                index === self.findIndex((t: any) => (
                    t.programId === item.programId
                ))
            );
            this.conditionalFinanceDataToShow[i] = [];

            this.conditionalFinanceDataToShow[i]['name'] = k;

            this.conditionalFinanceDataToShow[i]['data'] = uniqueData;


            i++;
        };
        DataHandler.conditionalFinanceDataToShow = this.conditionalFinanceDataToShow;
        if (noeligible != undefined) {
            this.checkeligibilityFinance(noeligible);
        }
    }

    openConditionalOffersDialogCash(hideConditionalOffter: any, noeligible: any) {
        // will log the entire data object
        this.hideConditionalOffterCash = hideConditionalOffter;
        var conditionalDataNew: any = {};
        for (let i = 0; i < this.cashconditionaldata?.length; i++) {
            if (this.cashconditionaldata[i].checked == 1) {
                this.cashconditionaldata[i].isChecked = true;
            } else {
                this.cashconditionaldata[i].isChecked = false;
                this.cashconditionaldata[i].noeligible = false;
            }
            if (conditionalDataNew[this.cashconditionaldata[i].group] == undefined) {
                conditionalDataNew[this.cashconditionaldata[i].group] = [];
            }
            conditionalDataNew[this.cashconditionaldata[i].group].push(this.cashconditionaldata[i]);
        }
        let i = 0;
        let k: keyof typeof conditionalDataNew;


        for (k in conditionalDataNew) {
            // Remove duplicates based on programId
            const uniqueData = conditionalDataNew[k].filter((item: any, index: number, self: any[]) =>
                index === self.findIndex((t: any) => (
                    t.programId === item.programId
                ))
            );
            this.conditionalCashDataToShow[i] = [];

            this.conditionalCashDataToShow[i]['name'] = k;
            this.conditionalCashDataToShow[i]['data'] = uniqueData;
            i++;
        };

        if (noeligible != undefined) {
            this.checkeligibilityCash(noeligible);
        }
    }

    checkeligibilityLease(noeligible: any) {
        var arr;
        if (typeof noeligible === 'object') {
            arr = Object.keys(noeligible).map(key => (noeligible[key]));
        } else {
            arr = noeligible;
        }


        if (this.conditionalLeaseDataToShow?.length > 0) {
            for (let i = 0; i < this.conditionalLeaseDataToShow?.length; i++) {
                for (let j = 0; j < this.conditionalLeaseDataToShow[i].data?.length; j++) {

                    if (arr?.length > 0) {
                        var idx = arr.indexOf(this.conditionalLeaseDataToShow[i].data[j].programId.toString());
                        if (idx != -1 || this.conditionalLeaseDataToShow[i].data[j].programId == 9999999999) {
                            this.conditionalLeaseDataToShow[i].data[j].noeligible = false;
                        } else if (this.conditionalLeaseDataToShow[i].data[j].checked) {
                            if (DataHandler.leaseConditionalOfferChecked) {
                                DataHandler.leaseConditionalOfferChecked = false;
                            } else {
                                this.conditionalLeaseDataToShow[i].data[j].noeligible = true;
                            }
                        }
                    } else if (this.conditionalLeaseDataToShow[i].data[j].programId == 9999999999) {
                        this.conditionalLeaseDataToShow[i].data[j].noeligible = false;
                    } else if (this.conditionalLeaseDataToShow[i].data[j].checked) {
                        if (DataHandler.leaseConditionalOfferChecked) {
                            DataHandler.leaseConditionalOfferChecked = false;
                        } else {
                            this.conditionalLeaseDataToShow[i].data[j].noeligible = true;
                        }
                    } else {
                        this.conditionalLeaseDataToShow[i].data[j].noeligible = false;
                    }
                }
            }
            DataHandler.conditionalLeaseDataToShow = this.conditionalLeaseDataToShow;
        }

    }

    checkeligibilityFinance(noeligible: any) {
        var arr;
        if (typeof noeligible === 'object') {
            arr = Object.keys(noeligible).map(key => (noeligible[key]));
        } else {
            arr = noeligible;
        }
        if (this.conditionalFinanceDataToShow?.length > 0) {
            for (let i = 0; i < this.conditionalFinanceDataToShow?.length; i++) {
                for (let j = 0; j < this.conditionalFinanceDataToShow[i].data?.length; j++) {
                    if (arr?.length > 0) {
                        var idx = arr.indexOf(this.conditionalFinanceDataToShow[i].data[j].programId.toString());
                        if (idx != -1 || this.conditionalFinanceDataToShow[i].data[j].programId == 9999999999) {
                            this.conditionalFinanceDataToShow[i].data[j].noeligible = false;
                        } else if (this.conditionalFinanceDataToShow[i].data[j].checked) {
                            if (DataHandler.financeConditionalOfferChecked) {
                                DataHandler.financeConditionalOfferChecked = false;
                            } else {
                                this.conditionalFinanceDataToShow[i].data[j].noeligible = true;
                            }

                        }
                    } else if (this.conditionalFinanceDataToShow[i].data[j].programId == 9999999999) {
                        this.conditionalFinanceDataToShow[i].data[j].noeligible = false;
                    } else if (this.conditionalFinanceDataToShow[i].data[j].checked) {
                        if (DataHandler.financeConditionalOfferChecked) {
                            DataHandler.financeConditionalOfferChecked = false;
                        } else {
                            this.conditionalFinanceDataToShow[i].data[j].noeligible = true;
                        }
                    } else {
                        this.conditionalFinanceDataToShow[i].data[j].noeligible = false;
                    }
                }
            }
            DataHandler.conditionalFinanceDataToShow = this.conditionalFinanceDataToShow;
        }
    }

    checkeligibilityCash(noeligible: any) {
        var arr;
        if (typeof noeligible === 'object') {
            arr = Object.keys(noeligible).map(key => (noeligible[key]));
        } else {
            arr = noeligible;
        }
        if (this.conditionalCashDataToShow?.length > 0) {
            for (let i = 0; i < this.conditionalCashDataToShow?.length; i++) {
                for (let j = 0; j < this.conditionalCashDataToShow[i].data?.length; j++) {
                    if (arr?.length > 0) {
                        var idx = arr.indexOf(this.conditionalCashDataToShow[i].data[j].programId.toString());
                        if (idx != -1 || this.conditionalCashDataToShow[i].data[j].programId == 9999999999) {
                            this.conditionalCashDataToShow[i].data[j].noeligible = false;
                        } else if (this.conditionalCashDataToShow[i].data[j].checked) {
                            if (DataHandler.cashConditionalOfferChecked) {
                                DataHandler.cashConditionalOfferChecked = false;
                            } else {
                                this.conditionalCashDataToShow[i].data[j].noeligible = true;
                            }
                        }
                    } else if (this.conditionalCashDataToShow[i].data[j].programId == 9999999999) {
                        this.conditionalCashDataToShow[i].data[j].noeligible = false;
                    } else if (this.conditionalCashDataToShow[i].data[j].checked) {
                        if (DataHandler.cashConditionalOfferChecked) {
                            DataHandler.cashConditionalOfferChecked = false;
                        } else {
                            this.conditionalCashDataToShow[i].data[j].noeligible = true;
                        }
                    } else {
                        this.conditionalCashDataToShow[i].data[j].noeligible = false;
                    }
                }
            }
        }
    }

    conditionalCheckLease(obj: any, programId: any) {
        clearTimeout(this.timeout);
        var isChecked = obj.target.checked;
        let sdgCalled = false;
        if (isChecked)
            DataHandler.leaseConditionalOfferChecked = true;
        for (let i = 0; i < this.conditionaldata?.length; i++) {
            if (this.conditionaldata[i].programId == programId) {
                if (isChecked) {
                    ShiftDigitalHandler.shiftdigitalexecutor('offer add');
                    MerkleHandler.merkleexecutor('leasecheck', '', this.conditionaldata[i].group);
                    this.conditionaldata[i].checked = 1;
                    this.conditionaldata[i].isChecked = true;
                } else {
                    this.conditionaldata[i].checked = 0;
                    this.conditionaldata[i].isChecked = false;
                    this.conditionaldata[i].noeligible = false;
                    MerkleHandler.merkleexecutor('leaseuncheck', '', this.conditionaldata[i].group);
                }
                 if(!sdgCalled){
                    this.adobe_sdg_event('interaction-click', { type:"conditionalOfferClick" ,programId:programId, checked: isChecked, programName: this.conditionaldata[i].group  });
                    sdgCalled = true;
                }
            }
        }
        this.timeout = setTimeout(() => {
            this.onCheckboxChange_lease('', 1, 0, 'tradein-ui');
           // this.openConditionalOffersDialogLease(this.hideConditionalOffter, this.leasedetails.payload_stackability_incentives?.eligible);
        }, 2000);
        this.cdr.detectChanges();
    }

    conditionalCheckFinance(obj: any, programId: any) {
        clearTimeout(this.timeout);
        var isChecked = obj.target.checked;
        let sdgCalled = false;
        if (isChecked)
            DataHandler.financeConditionalOfferChecked = true;
        for (let i = 0; i < this.financeconditionaldata?.length; i++) {
            if (this.financeconditionaldata[i].programId == programId) {
                if (isChecked) {
                    ShiftDigitalHandler.shiftdigitalexecutor('offer add');
                    MerkleHandler.merkleexecutor('financecheck', '', this.financeconditionaldata[i].group);
                    this.financeconditionaldata[i].checked = 1;
                } else {
                    this.financeconditionaldata[i].checked = 0;
                    MerkleHandler.merkleexecutor('financeuncheck', '', this.financeconditionaldata[i].group);
                }
               if(!sdgCalled){
                    this.adobe_sdg_event('interaction-click', { type:"conditionalOfferClick" ,programId:programId, checked: isChecked, programName: this.financeconditionaldata[i].group  });
                    sdgCalled = true;
                }
            }
        }
        this.timeout = setTimeout(() => {
            this.onCheckboxChange_finance('', 1, 0, 'tradein-ui');
           // this.openConditionalOffersDialogFinance(this.hideConditionalOffter, this.financedetails.payload_stackability_incentives?.eligible)
        }, 2000);
    }

    conditionalCheckCash(obj: any, programId: any) {
        clearTimeout(this.timeout);
        var isChecked = obj.target.checked;
        var uncheck: boolean = false;
       let sdgCalled = false;
        if (isChecked)
            DataHandler.cashConditionalOfferChecked = true;
        for (let i = 0; i < this.cashconditionaldata?.length; i++) {
            if (this.cashconditionaldata[i].programId == programId) {
                if (isChecked) {
                    ShiftDigitalHandler.shiftdigitalexecutor('offer add');
                    MerkleHandler.merkleexecutor('cashcheck', '', this.cashconditionaldata[i].group);
                    this.cashconditionaldata[i].checked = 1;
                } else {
                    this.cashconditionaldata[i].checked = 0;
                    MerkleHandler.merkleexecutor('cashuncheck', '', this.cashconditionaldata[i].group);
                }
                if(!sdgCalled){
                    this.adobe_sdg_event('interaction-click', { type:"conditionalOfferClick" ,programId:programId, checked: isChecked, programName: this.cashconditionaldata[i].group  });
                    sdgCalled = true;
                }
                
            }
        }
        this.timeout = setTimeout(() => {
            this.onCheckboxChange_cash();
            this.openConditionalOffersDialogCash(this.hideConditionalOffterCash, this.cashdetails.payload_stackability_incentives?.eligible)
        }, 2000);
    }

    incentiveCheckLease(obj: any, programId: any) {
        clearTimeout(this.timeout);
        var isChecked = obj.target.checked;
        for (let i = 0; i < this.incentivedata?.length; i++) {
            if (this.incentivedata[i].programId == programId) {
                if (isChecked) {
                    this.incentivedata[i].checked = 1;
                    ShiftDigitalHandler.shiftdigitalexecutor('offer add');
                } else {
                    this.incentivedata[i].checked = 0;
                }
            }
        }
        this.timeout = setTimeout(() => {
            this.onCheckboxChange_lease('', 1, 0, 'tradein-ui');
        }, 2000);
    }

    incentiveCheckFinance(obj: any, programId: any) {
        clearTimeout(this.timeout);
        var isChecked = obj.target.checked;
        for (let i = 0; i < this.financeincentivedata?.length; i++) {
            if (this.financeincentivedata[i].programId == programId) {
                if (isChecked) {
                    this.financeincentivedata[i].checked = 1;
                    ShiftDigitalHandler.shiftdigitalexecutor('offer add');
                } else {
                    this.financeincentivedata[i].checked = 0;
                }
            }
        }
        this.timeout = setTimeout(() => {
            this.onCheckboxChange_finance('', 1, 0, 'tradein-ui');
        }, 2000);
    }

    incentiveCheckCash(obj: any, programId: any) {
        clearTimeout(this.timeout);
        var isChecked = obj.target.checked;
        for (let i = 0; i < this.cashincentivedata?.length; i++) {
            if (this.cashincentivedata[i].programId == programId) {
                if (isChecked) {
                    this.cashincentivedata[i].checked = 1;
                    ShiftDigitalHandler.shiftdigitalexecutor('offer add');
                } else {
                    this.cashincentivedata[i].checked = 0;
                }
            }
        }
        this.timeout = setTimeout(() => {
            this.onCheckboxChange_cash();
        }, 2000);
    }

    toggleDescriptionlease() {
        this.showFullDescriptionlease = !this.showFullDescriptionlease;
        this.adobe_sdg_event('interaction-click', {
            type: this.showFullDescriptionlease ? 'show-less' : 'show-more',
            value: this.showFullDescriptionlease ? 'show-less' : 'show-more',
        });
    }

    toggleDescriptionfinance() {
        this.showFullDescriptionfinance = !this.showFullDescriptionfinance;
        this.adobe_sdg_event('interaction-click', {
            type: this.showFullDescriptionlease ? 'show-less' : 'show-more',
            value: this.showFullDescriptionlease ? 'show-less' : 'show-more',
        });
    }

    toggleDescriptioncash() {
        this.showFullDescriptioncash = !this.showFullDescriptioncash;
        this.adobe_sdg_event('interaction-click', {
            type: this.showFullDescriptionlease ? 'show-less' : 'show-more',
            value: this.showFullDescriptionlease ? 'show-less' : 'show-more',
        });
    }

    Msrptooltip(data: any) {
        if (data == 'lease') {
            MerkleHandler.merkleexecutor('msrptooltiplease');
        } else if (data == 'finance') {
            MerkleHandler.merkleexecutor('msrptooltipfinance');
        }
    }
    merklemsrp() {
        MerkleHandler.merkleexecutor('merklemsrp');
    }

    fnSliceDisclaimer(prDisclaimer: any, prType: any) {
        let disclaimer = prDisclaimer;
        if (disclaimer != undefined) {
            if (prType == 'lease' || prType == 'finance') {
                let arDisclaimer = disclaimer.split(', ');
                disclaimer = arDisclaimer[0] + ' ' + arDisclaimer[1];
            } else if (prType == 'cash') {
                let arDisclaimer = disclaimer.split(', ');
                disclaimer = arDisclaimer[0];
            }
        }
        return disclaimer;
    }
    closePopup() {
        DataHandler.aprchanged = false
        this.observableService.closePaymentCalculator();
        this.sharedService.setPaymentCalculatorState(false);
        //DataHandler.dialogRef.close();
    }
}
