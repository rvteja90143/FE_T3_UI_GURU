export class DataHandler {
    public static ft_id : any = ''
    public static ip_address : any
    public static fj_visitor_id : any
     public static is_autonation_vin : any;
    public static aprchanged = false
    public static sourceType : any = ''
    public static initialClose : any
    public static dialogClose = true
    public static hint_comments = ''
    public static programtype = ''
    public static prequalIframeurl:any
    public static prequalComment : any;
    public static defaultPayment : any
    public static minimumPercentage : any;
    public static minimumleasedownpayment : any
    public static minimumfinancedownpayment : any
    public static callonce : boolean = false
    public static isAprChange: boolean = false
    public static isTermChanged: boolean = false
    public static finance_rate_interest_used: any;
    public static financeapr_used: any;
    public static financeaprtype: any;
    public static financeaprrate: any;
    public static dealerprice: any;
    public static leaseRefresh = false;
    public static financeRefresh = false;
    public static isNonSubvented: boolean = false

    //DMS
    public static is_dms_enabled: any
    public static dms_Data: any;
    public static resonse_DATA: any;
    public static iframeAnalyticsData: any;
    public static is_dms_document_submited: any = '';

    //Comment
    public static is_commnet_box_enable :any;
    // public static LatestCommentValue : any = '';

    public static homedeliverycheck_submitform: boolean = false;
    public static tradein_type: any;
    public static photoGalleryImages: any
    public static noAccessories = false;
    public static termscondtioncheckbox: boolean = false;
    public static countycitylist: any
    public static updateleasecalulation = false
    public static customerzipcode: any
    public static constomerstate: any
    public static customercounty: any
    public static ngAfterleasecall = false
    public static initialleasecall = false
    public static monthlyLeaseValue = 0;
    public static leasestate = '0';
    public static financestate = '0';
    public static cashstate = '0';
    public static customerstate: any;
    public static countycity: any;
    public static showPrivateOffer: boolean = true;
    public static initialprequal: boolean = false;
    public static dealer_AprRate: boolean = false;
    public static editedZipcode_Prequalify: string = "";
    public static customPlane: any;
    public static previousleaseterm: any;
    public static previousfinanceterm: any;
    public static leaseServiceContract: boolean = false
    public static financeServiceContract: boolean = false
    public static cashServiceContract: boolean = false
    public static customer_zip_code: any;
    public static private_offer_email: any = '';
    public static showpopup: any = 1;
    public static inwidget_initial_popup: any = 'D';
    public static customize_testdrive: any;
    public static Vehicle_delivery: any;
    public static employee_pricing_advertise: any;
    public static isClickZipCode: boolean = false;
    public static open_private_offer_pop: any;
    public static which_private_offer_popup: any = 2;
    public static private_Offer_Status: boolean = false;
    public static privateofferID: any;
    public static currentSession_PrivateOffer: any;
    public static dealer_phone: any;
    public static form: any;
    public static dealerstate: any;
    public static myfix: boolean = false;
    public static leaseterms: any;
    public static financeterms: any;
    public static cashterms: any;
    public static termdurationlease: any;
    public static termdurationfinance: any;   //need to remove this hardcode value once payment setup
    public static servicepricelease: any;
    public static servicepricefinance: any;
    public static servicepricecash: any;
    public static s_p_leasepercentage: any;
    public static s_p_financepercentage: any
    public static s_p_cashpercentage: any
    public static eprice_button_text: any;
    public static appreciate_text: any;
    public static price: any = 'True';
    public static creditAppState: any;
    public static shiftdigitaladdontype: any;
    public static shiftdigitaladdoname: any;
    public static shiftdigitalaccessoroesaddontype: any;
    public static shiftdigitalaccessoroesaddoname: any;
    public static moparid: any;
    public static shifttradeinstart: any = 0;
    public static shiftdigitalkbb: any = 0;
    public static shiftdigitalbb: any = 0;
    public static testdrivesubmit: any = 0;
    public static make_url: any = 'CDJRF';
    public static vehicleInventoryStatusCode: any = null;
    public static iframePageNames : any;
    public static optioncode: any;
    public static tier: any = 't3';
    public static actualtier: any;
    public static vin: any = null;
    public static dealer: any = null;
    public static dealerName: any = null;
    public static dealerzip: any = null;
    public static dealerdiscount: any = "false";
    public static showdelivery: any = 1;
    public static tier3dealaerName: any = null;
    public static tier3providerName: any = null;
    public static tier3_dealerState: any = null;
    public static tier3_dealerZipcode: any = null;
    public static tier3_trafficType: any = null;
    public static page: string = "";

    /*This is global and not be reset */
    public static firstname: string = "";
    public static lastname: string = "";
    public static email: string = "";
    public static phone: string = "";
    public static zipcode: string = "";
    public static googleAnalyticIsSubmitted: any = {};
    public static gridVal: any;
    public static gridText: string;
    /*This is global and not be reset */

    public static alstDesc: string = "";
    public static dt: any;
    public static msrp: any = null;
    public static make: any = null;
    public static model: any = null;
    public static year: any = null;
    public static trim: any = null;
    public static testdrive: any = null;
    public static creditflag: any = null;
    public static creditflag_set: any = 0;
    public static paymenttype: any = null;
    public static leasemileage: any = null;
    public static leasecapitalcost: any = null;
    public static leasemonthlycost: any = null;
    public static leasemonthly: any = null;
    public static leasedownpayment: any = null;
    public static leasetradein: any = null;
    public static leasedafaultterm: any;
    public static leaseselectedallmanmoney: any = null;
    public static leaseselectinventory: any = null;
    public static leaseincentive: any = 0;
    public static leaseselectedconditionaloffer: any = {};
    public static leasetaxes: any = null;
    public static leasefees: any = null;
    public static leasedueatsigning: any = null;
    public static leasemonthlytaxes: any = null;
    public static leasemonthlypaymentwithtaxes: any = null;
    public static leaserange: any = null;
    public static leaserange_length: any = null;
    public static leasedownpay: any = null;
    public static financedownpay: any = null;
    public static financecapitalcost: any = null;
    public static financemonthlycost: any = null;
    public static financemonthly: any = null;
    public static financedownpayment: any = null;
    public static financetradein: any = null;
    public static financedafaultterm: any;
    public static financeselectedallmanmoney: any = null;
    public static financeselectinventory: any = null;
    public static financeincentive: any = 0;
    public static financeselectedconditionaloffer: any = {};
    public static financetaxes: any = null;
    public static financefees: any = null;
    public static financedueatsigning: any = null;
    public static financemonthlytaxes: any = null;
    public static financemonthlypaymentwithtaxes: any = null;
    public static financerange: any = null;
    public static financerange_length: any = null;
    public static cashmonthlycost: any = null;
    public static cashtradein: any = '0';
    public static cashselectedallmanmoney: any = null;
    public static cashselectedconditionaloffer: any = null;
    public static cashincentive: any = 0;
    public static cashselectinventory: any = null;
    public static servicecashIds: any;
    public static servicecash: any;
    public static cashtaxes: any = null;
    public static cashfees: any = null;
    public static cashdueatsigning: any = null;
    public static cashmonthlytaxes: any = null;
    public static cashmonthlypaymentwithtaxes: any = null;
    public static totallease: any = 0;
    public static totalfinance: any = 0;
    public static totalcash: any = 0;
    public static tradeinmake: any = null;
    public static tradeinmodel: any = null;
    public static tradeinyear: any = null;
    public static tradeinseries: any = null;
    public static tradeinoptions: any = null;
    public static tradeinstyle: any = null;
    public static tradeinzip: any = null;
    public static tradeinmileage: any = null;
    public static tradeincondition: any = null;
    public static tradeinvalue: any = null;
    public static tradeinadjvalue: any = null;
    public static scheduledelivery: any = null;
    public static submitdealer: any = null;
    public static applycredit: any = null;
    public static servicetoggle: any = '';
    public static servicelease: any = {};
    public static serviceleaseIds: any = {};
    public static servicefinance: any = {};
    public static servicefinanceIds: any = {};
    public static accessories: any = {};
    public static selected_Accessories: any;
    public static dealerinfo: any = null;
    public static merkleloader = 1;
    public static merklevistor = 1;
    public static getGlobalVisitorsIds: any = "";
    public static serviceflag = "lease";
    public static reviewflag = "lease";
    public static deliverychanges = 0; // to check if there are any delivery changes made globally
    public static labels: any = [];
    public static labelsf: any = [];
    public static labelsc: any = [];
    public static viewoffer: any = 1;
    public static form_submitted = 0;
    public static digitalData: any;
    public static dataLayer: any;
    public static ShiftdigitalData: any;
    public static couponData: any;
    public static currentSubmitType: any = '';
    public static eshopLeaseConditionalOffer: any = [];
    public static eshopFinanceConditionalOffer: any = [];
    public static eshopCashConditionalOffer: any = [];
    public static googleAnalyticsData: any = [];
    public static disclaimerAge: string = '18 years';
    public static api_url: string = '';
    public static paypalClientId: string;
    public static reserveCurrency: string;
    public static reserveAmount: any;
    public static heroImage: string;
    public static oreIdForReservation: string;
    public static orderIdForReservation: string;
    public static paypalEnvironment: string;
    public static encfirstname: string = "";
    public static enclastname: string = "";
    public static encemail: string = "";
    public static encphone: string = "";
    public static paypalPageNAme: string = "";
    public static paypalPayerData: any = {};
    public static paypalPageType: string = '';
    public static current_session: string = '';
    public static sdSessionId: any = '';
    public static display_vehicle_name: string = '';
    public static isReserveButtonEnable: string = 'N';
    public static paypalOnboardingStatus: string = '0';
    public static reservationPrivacyLink: string = "";
    public static reservationTermLink: string = "";
    public static msrp_disclaimer: string = "";
    public static base_msrp: string = "0";
    public static hideEstimator: any;
    public static payPalPurchaseUnit: any = {};
    public static list_upfit_flag: string = "";
    public static showroomTimingFilter: any;
    public static customize_reservation: any;
    public static adobeSDGdata: any;
    public static adobeSDGgetGlobalVisitorsIds: any = "";
    public static AdobeSDGScriptLoader: any = 0;
    public static selected_id : any = '';
    public static group_selected_accessories='featured';
    public static check_accessoies_load : boolean = false;
    public static journey_id : any;
    public static SDGEvents: any = {
        pageLoad: {
            pageType: "build-your-deal",
            pageName: "build-your-deal:vehicle-details",
            zipCode: "",
            make: "",
            model: "",
            year: "",
            trim: "",
            vin: "",
            dealerCode: "",
            site: "dealer"
        },
        formStart: {
            formDescription: "",
            formType: "",
            displayType: "",
            displayFormat: "",
            linkDetails: "",
            tradeInProvider: ""
        },
        formSubmit: {
            formDescription: "",
            formType: "",
            displayType: "",
            displayFormat: "",
            leadId: "",
            linkDetails: "",
            hashedEmail: "",
            tradeInProvider: ""
        },
        interactionClick: {
            site: "dealer",
            type: "nav",
            page: "build-your-deal:vehicle-details",
            location: "",
            description: "",
            name: ""
        },
        errorDisplay: {
            message: "",
            type: ""
        },
        isFloatingCalcClick: false
    };
    // public static dat_dealer_info: any;

    /*this is for prequal form*/
    public static maxLoanAmount: any;
    public static maxMonthlyPayment: any;
    public static prequaltop: any;
    public static prequalbottom: any;
    public static prequal_zipcode: string = "";
    public static prequal_address: string = "";
    public static prequal_apt: string = "";
    public static prequal_city: string = "";
    public static prequal_state: string = "";
    public static prequal_preTaxMonthlyIncome: string = "";
    /*this is for prequal form*/
    public static lowestType: string = "";
    public static manual_env: string = "";
    public static dealer_cta: any = {};
    public static closeReserve: boolean = false;
    public static leadSubmission: any = []; //prevent multiple lead
    public static privateofferamount: string = "";
    public static certificatecode: string = "";
    public static offerexpire: string = "";
    public static editZip: string = "";
    public static objActivePaymentData: any = {};
    public static get_down_pay_from_ui = "0";
    public static fin_get_down_pay_from_ui = "0";
    public static custom_plan_added = 0;
    public static inc_access_flag = true;
    public static initial_popup_isdelay: any =0;
    public static is_lead_form_open: boolean = false;
    public static customize_accessories: any;
    public static extraParameter: string = '';
    public static display_label: any;
    public static accessoriesduplicate: any = 0;
    public static SandPData: any;
    public static SandPDataFinance: any;
    public static accessoriesInfo: any;

    //autofi start///
    public static showautofi = 0;
    public static enableautofi: any;
    public static autofi_co_phone: any;
    public static lease_Milage: any;
    public static autofidisable: any;
    public static autoFi_af_code: any;
    public static financetier: any;
    public static subventedProgramStatus: any;
    public static financefeesdetails: any;
    public static leasefeesdetails: any;
    public static payload_tax_payment_mode: any;
    public static financeserviceprotection: any;
    public static lease_payload_mopar_accessries: any;
    public static finance_payload_mopar_accessries: any;
    public static leaseserviceprotection: any;
    public static conditionalFinanceDataToShow: any;
    public static conditionalLeaseDataToShow: any;
    public static leaseTaxRate: any;
    public static financeincentivedata: any;
    public static autofiPage: any = '';
    public static autofiStatus: any = '';
    public static leaseIncentivedata: any;
    public static lease_has_vauto_dlr_disc: boolean = false;
    public static lease_has_max_digital_dlr_disc: boolean = false;
    public static finance_has_vauto_dlr_disc: boolean = false;
    public static finance_has_max_digital_dlr_disc: boolean = false;
    public static lease_payload_autofi_taxes_fees: any;
    public static finance_payload_autofi_taxes_fees: any;
    public static autofipayload: any;
    public static financeapr: any = '0';
    public static bodyType: any = 'string';
    public static boyColor: any = 'string';
    public static oem_model_code: any;
    public static leasetier: any;
    public static tradeinpayoff: any;
    public static tradeinamount: any;
    public static leaseincentiveIds: any;
    public static financeincentiveIds: any;
    public static cashincentiveIds: any;
    public static isPaymentCalculatorInitialized: boolean = false;
    public static autofiopen: any = 0;
    //autofi end///
    public static initial_popup_text: any;
    public static prevdownlease: any = 0;
    public static prevdownfinance: any = 0;
    public static prevtradeinlease: any = 0;
    public static prevtradeinfinance: any = 0;
    public static currentDate: any;
    public static primarysstin: any;
    public static Coappliantsstin: any;
    public static leadtrack: any = 0;
    public static dpPercentage: any = 10;
    public static dpFinPercentage: any = 10;
    public static credit_better_estimate: any;
    public static GASource: any = 'Dealer';
    public static vehicle_model: any;
    public static is_all_conditional_offer_check: boolean = false;
    public static leasestatuscode: any;
    public static financestatuscode: any;
    public static mandatory_phone: any;
    public static timeoutInitialPopup: any;
    public static testdrive_disclimer: any;
    public static schedule_delivery_disclimer: any;
    public static ga4_measurement_id: any;
    public static dealer_denverBC: any;
    public static trafficsrc: any;
    public static finance_display_amount: any = 0;
    public static merkleTire: any = 'ORE';
    public static sessionid: any;
    public static dealerrating: any = 0;
    public static eShop_initial_popup: any = 'D';
    public static vehicle_images: any;
    public static popupName: string = 'initial';
    public static topmsrp: any = null;
    public static domain: any;
    public static wishlist: any = '0';
    public static miles: any = '0';
    public static asseturl: any;
    public static vdpenv: any;
    public static GA4_measurement_id: any;
    public static tabswitch: any;
    public static stock_number: any;
    public static pagetype: any = 'vdp';
    public static openbetterpopup: any;
    public static DTR1url: any;
    public static HybrideHP: any;
    public static HybridHPvalue: any;
    public static finance_has_homenet_dlr_disc: boolean = false;
    public static homenet_cache_isset: any;
    public static testValue: string;
    public static isMobileScreen: boolean | undefined;
    public static vehicle_info: any;
    public static drivetype: any;
    public static dealercode: string;
    public static vehicle_type: string;
    public static activeTab: string | undefined;
    public static financeadditiondiscount: any;
    public static cashadditiondiscount: number;
    public static dialogRef: any;
    public static leaseServiceValue: any;
    public static leaseTotalTaxesFees: number;
    public static private_offer_conditionaloffer: boolean;
    public static formSubmitted: boolean;
    public static showroomTimingFilterUsed: any;
    public static aprRateType: any = 'defaultapr';
    public static leaseConditionalOfferChecked: boolean = false;
    public static financeConditionalOfferChecked: boolean = false;
    public static cashConditionalOfferChecked: boolean = false;
    public static actualVehicleType: string;
    public static accessoriesClick :boolean =false;
    public static isWidgetOpen :boolean =false;
    public static paypal_onboarding_status: any;
    public static is_reserve_button_enable: any;
    /*public static actualLowestType : string ='';
    public static actualFinanceRate : string ='';*/
    public static userInteraction :boolean = false;
    public static clearInitialTimer :any =0;
    public static dealerBC:any ='';

    public static reset() {
        console.log('DataVariables_Reset')
        this.dealercode = '';
        this.financeapr = '0'
        this.creditAppState = 'not-open';
        this.vehicleInventoryStatusCode = null;
        this.msrp = null;
        this.vin = null;
        this.dealer = null;
        this.dealerName = null;
        this.dt = null;
        this.make = null;
        this.model = null;
        this.year = null;
        this.trim = null;
        this.testdrive = null;
        this.creditflag = null;
        this.creditflag_set = 0;
        this.showdelivery = 1;
        this.is_all_conditional_offer_check = false;
        this.tradeinmake = null;
        this.tradeinmodel = null;
        this.tradeinyear = null;
        this.tradeinseries = null;
        this.tradeinoptions = null;
        this.tradeinstyle = null;
        this.tradeinzip = null;
        this.tradeinmileage = null;
        this.tradeincondition = null;
        this.tradeinvalue = null;
        this.tradeinadjvalue = null;
        this.paymenttype = null;
        this.leasemileage = null;
        this.leasecapitalcost = null;
        this.leasemonthlycost = null;
        this.leasemonthly = null;
        this.leasedownpayment = null;
        this.leasetradein = null;
        this.leasedafaultterm = null;
        this.leaseincentive = 0;
        this.leaseselectedallmanmoney = {};
        this.leaseselectedconditionaloffer = {};
        this.leaseselectinventory = {};
        this.leasetaxes = null;
        this.leasefees = null;
        this.leasedueatsigning = null;
        this.leasemonthlytaxes = null;
        this.leasemonthlypaymentwithtaxes = null;
        this.leaserange = null;
        this.leaserange_length = null;
        this.financecapitalcost = null;
        this.financemonthlycost = null;
        this.financemonthly = null;
        this.financedownpayment = null;
        this.financetradein = null;
        this.financedafaultterm = null;
        this.financeincentive = 0;
        this.financeselectedallmanmoney = {};
        this.financeselectedconditionaloffer = {};
        this.financeselectinventory = {};
        this.financetaxes = null;
        this.financefees = null;
        this.financedueatsigning = null;
        this.financemonthlytaxes = null;
        this.financemonthlypaymentwithtaxes = null;
        this.financerange = null;
        this.financerange_length = null;
        this.cashmonthlycost = null;
        this.cashtradein = '0';
        this.cashincentive = 0;
        this.cashselectedallmanmoney = {};
        this.cashselectedconditionaloffer = {};
        this.cashselectinventory = {};
        this.cashtaxes = null;
        this.cashfees = null;
        this.cashdueatsigning = null;
        this.cashmonthlytaxes = null;
        this.cashmonthlypaymentwithtaxes = null;
        this.totallease = 0;
        this.totalfinance = 0;
        this.totalcash = 0;
        this.scheduledelivery = null;
        this.submitdealer = null;
        this.applycredit = null;
        this.servicetoggle = '';
        this.servicelease = {};
        this.serviceleaseIds = {};
        this.servicefinance = {};
        this.servicefinanceIds = {};
        this.accessories = {};
        this.dealerinfo = null;
        this.serviceflag = "lease";
        this.reviewflag = "lease";
        this.deliverychanges = 0;
        this.form_submitted = 0;
        this.getGlobalVisitorsIds = "";
        this.currentSubmitType = "";
        this.eshopLeaseConditionalOffer = [];
        this.eshopFinanceConditionalOffer = [];
        this.eshopCashConditionalOffer = [];
        this.googleAnalyticsData = [];
        this.disclaimerAge = '18 years';
        this.api_url = '';
        this.paypalClientId = '';
        this.reserveCurrency = '';
        this.reserveAmount = 0;
        this.heroImage = '';
        this.oreIdForReservation = '';
        this.orderIdForReservation = '';
        this.paypalEnvironment = '';
        this.encfirstname = "";
        this.enclastname = "";
        this.encemail = "";
        this.encphone = "";
        this.paypalPageNAme = "";
        this.paypalPayerData = {};
        this.paypalPageType = '';
        this.current_session = '';
        this.display_vehicle_name = '';
        this.paypalOnboardingStatus = '';
        this.isReserveButtonEnable = '';
        this.reservationPrivacyLink = "";
        this.msrp_disclaimer = "";
        this.base_msrp = "0";
        this.reservationTermLink = "";
        this.payPalPurchaseUnit = {};
        this.customize_testdrive = "";
        this.Vehicle_delivery = "";
        this.employee_pricing_advertise = "";
        this.list_upfit_flag = "";
        this.showroomTimingFilter = "";
        this.customize_reservation = "";
        this.paypal_onboarding_status ="";
        this.is_reserve_button_enable = "";
        this.maxLoanAmount = "";
        this.maxMonthlyPayment = "";
        this.prequaltop = "";
        this.prequalbottom = "";
        this.isClickZipCode = false;
        this.lowestType = "";
        this.manual_env = "";
        this.open_private_offer_pop = 0;
        this.which_private_offer_popup = 2;
        this.private_Offer_Status = false;
        this.privateofferID = "";
        this.currentSession_PrivateOffer = "";
        this.privateofferamount = "";
        this.certificatecode = "";
        this.offerexpire = "";
        this.dealer_phone = "";
        this.form = "";
        this.editZip = "";
        this.objActivePaymentData = {};
        this.fin_get_down_pay_from_ui = "0";
        this.get_down_pay_from_ui = "0";
        this.dealerstate = "";
        this.leaseterms = "";
        this.financeterms = "";
        this.cashterms = "";
        this.custom_plan_added = 0;
        this.termdurationlease = "";
        // this.termdurationfinance = "";
        this.servicepricecash = "";
        this.servicepricefinance = "";
        this.servicepricelease = "";
        this.eprice_button_text = "";
        this.appreciate_text = "";
        this.shiftdigitaladdontype = '';
        this.shiftdigitaladdoname = '';
        this.inc_access_flag = true;
        this.moparid = '';
        this.testdrivesubmit = '';
        this.is_lead_form_open = false;
        this.customize_accessories = '';
        this.display_label = '';
        this.isPaymentCalculatorInitialized = false;
        this.leaseincentiveIds = '';
        this.cashincentiveIds = '';
        this.financeincentiveIds = '';
        this.enableautofi = '';
        this.autofiopen = 0;
        this.initial_popup_text = '';
        this.prevdownlease = 0;
        this.prevdownfinance = 0;
        this.prevtradeinlease = 0;
        this.prevtradeinfinance = 0;
        this.currentDate = '';
        this.dpPercentage = '';
        this.dpFinPercentage = '';
        this.trafficsrc = '';
        this.dealer_denverBC = '';
        this.actualtier = '';
        this.sessionid = '';
        this.finance_display_amount = 0;
        this.vehicle_images = null;
        this.popupName = 'initial';
        this.trafficsrc = '';
        this.sessionid = '';
        this.domain = '';
        this.wishlist = '0';
        this.miles = '0';
        this.testdrive_disclimer = '';
        this.schedule_delivery_disclimer = '';
        this.pagetype = 'vdp';
        this.openbetterpopup = '';
        this.asseturl = '';
        this.finance_display_amount = 0;
        this.HybrideHP = '';
        this.HybridHPvalue = '';
        this.editedZipcode_Prequalify = '';
        this.formSubmitted = false;
        this.adobeSDGgetGlobalVisitorsIds = "";
        this.programtype = ''
        this.dialogClose = true
        this.accessoriesClick =false;
        this.page =''
        this.aprchanged = false ;
        this.sourceType = '' ;
        this.noAccessories = false;
        this.userInteraction = false;
        this.clearInitialTimer =0;
        this.dealerBC ='';
        this.ft_id = '' ;
        /*this.actualLowestType ='';
        this.actualFinanceRate='';*/
    }
}