export interface vehicleImages {
    vin: string;
    dealercode: string;
   /* internetprice?: string;
    make?: string;
    model?: string;
    year?: string;
    exteriorcolor?: string;
    vehicle_type?: string;*/
}

export interface photoGalleryResponse {
    current_session_pre_qual: string;
    credit_flag: string;
    customise_apr_flag: string;
    dealer_code: string;
    dealer_max_apr_duration: string;
    dealer_name: string;
    dealer_office_timing: {
        days_schedule_byname: daysScheduleByName | null;
        days_schedule_bynumber: [daysScheduleBynumber] | null;
        holidays: string;
    };
    dealers_finance_apr: number | null;
    dealers_finance_disclaimer: string;
    delivery_status_customize_testdrive: string;
    delivery_status_vehicle_status: string;
    display_lable: string;
    display_vehicle_name: string;
    drive_type: string;
    employee_pricing: employeePricing | null;
    ga4_measurement_id : string;
    hero_image: heroImage | null;
    initialpopup_mandate: string;
    initialpopup_timer: string;
    is_winsticker_enable: string;
    make: string;
    model: string;
    msrp: string;
    option_code: any[];
    schedule_vehicle_delivery_status: number | null;
    trade_type: string;
    trim_desc: string;
    vehicle_type: string;
    year: string;
    photo_images: string[] | null;
    reservation_term_link: any;
    
}

export interface daysScheduleByName {
    friday: {
        close: string;
        open: string;
        timing_interval: string[] | null;
    };
    monday: {
        close: string;
        open: string;
        timing_interval: string[] | null;
    };
    saturday: {
        close: string;
        open: string;
        timing_interval: string[] | null;
    };
    sunday: {
        close: string;
        open: string;
        timing_interval: string[] | null;
    };
    thursday: {
        close: string;
        open: string;
        timing_interval: string[] | null;
    };
    tuesday: {
        close: string;
        open: string;
        timing_interval: string[] | null;
    };
    wednesday: {
        close: string;
        open: string;
        timing_interval: string[] | null;
    };
}

export interface daysScheduleBynumber {
    close: string;
    open: string;
    timing_interval: string[] | null;
}

export interface employeePricing {
    cash_discount: number | null;
    finance_discount: number | null;
    lease_discount: number | null;
    msrp: string;
}

export interface heroImage {
    photo_URL: string;
    src_url: string;
    vehicle_type: string;
}

export interface vehicleSpec {
    result: {
        vehicle_spec: {
            vds_group_data: [{
                attributes: { name: string };
                line?: [{ '@attributes': { name: string }; value: string }];
            }]
        }
    };
    messages: any[];
    code: number;
    status: string;
}

export interface financeDetail {
    vin: string;
    zipcode?: number;
    transactionType?: string;
    tradein: number;
    additional_discount?: any;
    terms?: number;
    down?: number;
    internetprice?: number;
    selectedIds?: string;
    is_widget?: string;
    dealer_discount_available?: string;
    user_service_a_protection?: any;
    customer_state?: string;
    customer_county_city?: string;
    is_customer_zipcode?: string;
    apr_rate?: number;
    initial_load?: string;
    apr_rate_type?: string;
    tier: string;
    //downpayment?: string;
    ids?: string;
    step?: string;
    state?: string;
    county?: string;
    iscuszip?: string;
    dealercode?: number;
    dealer_code?: number;
    current_session?: string;
    lowest_type?: string;
    get_down_pay_from_ui?: string;
    loading?: string;
    msrp?: any;
    prevdown?: number;
    prevtradein?: number;
    sltMoparAcc?: string;
    term?: string;
    //tiers?: number;
    lender_code?: string;
}
export interface leaseDatails {    
    vin: string;
    dealercode: string;
    zipcode: string;
    msrp?: number;
    transactionType: string;
    tiers?: string;
    loading?: string;
    tradein: any;
    term?: string;
    mileage: string;
    down?: string;
    prevdown: any;
    selectedIds?: string;
    tier?: string;
    downpayment?: string;
    terms?: string;
    ids?: string;
    step?: string;
    state?: string;
    //county?: string;
    iscuszip?: string;
    prevtradein?: string;
    dealer_discount_available?: string;
    user_service_a_protection?: any;
    customer_state?: string;
    customer_county_city?: string;
    is_customer_zipcode?: string;
    current_session: any,
    get_down_pay_from_ui?: any;
    sltMoparAcc?: any;
    is_widget: string;
    lender_code: string;
}

export interface leaseDatailsUsed {
    vin: string;
    dealercode: string;
    zipcode: string;
    msrp?: number;
    transactionType: string;
    tiers?: string;
    loading?: string;
    tradein: any;
    term?: string;
    mileage: string;
    down?: string;
    prevdown: any;
    selectedIds?: string;
    tier?: string;
    downpayment?: string;
    terms?: string;
    ids?: string;
    step?: string;
    state?: string;
    county?: string;
    iscuszip?: string;
    prevtradein?: string;
    dealer_discount_available?: string;
    user_service_a_protection?: any;
    customer_state?: string;
    customer_county_city?: string;
    is_customer_zipcode?: string;
    current_session: any,
    get_down_pay_from_ui?: any;
    sltMoparAcc?: any;
    is_widget: string;
    lender_code: string;
}

export interface Taxes {
    taxesName: string;
    taxesType: string;
    taxesCategory: string;
    taxesamount: any;
    taxesDescription: string;
}

export interface UpFrontFees {
    feeType: string;
    feeCategory?: string;
    amount: string;
    disclaimer: any;
}

export interface cashDetails {
    vin: string;
    dealer_code?: number;
    zipcode: number;
    transactionType?: string;
    tradein: any;
    additional_discount: number;
    internetprice?: number;
    selectedIds: string;
    dealer_discount_available?: string;
    is_widget?: string;
    customer_state: string;
    customer_county_city: string;
    is_customer_zipcode: string;
    initial_load?: string;
    apr_rate?: number;
    apr_rate_type?: string;
    down?: number;
    terms?: number;
    user_service_a_protection?: any;
    vehicle_type?: string;
    dealercode?: string;
    msrp?: number;
    tiers?: string;
    sltMoparAcc?: any;
    current_session?: any;
    loading?: string;
    mileage?: number;
    lender_code?: string;
}

export interface financeDetailsResp {
    status: number;
    exceed_value: number,
    payload_incentives: payloadIncentives,
    payload_upfits: payloadUpfits,
    payload_service_protection: payloadServiceProtection,
    payload_fees: payloadFees,
    inventory_disclaimer: inventoryDisclaimer | null,
    payload_calculation: payloadCalculation,
    payload_tax_and_fees_status: string,
    payload_tax_payment_mode: string,
    payload_taxes: payloadTaxes,
    request: request,
    payload_mopar_accessries: { accessoried: any[], total_accessries_cost: number },
    payload_stackability_incentive: { eligible: any[], noneligible: any[] },
    taxs_and_fee_disclaimer_text: taxsAndFeeDisclaimerText,
    total_fee: string,
    total_tax: string,
    total_taxs_and_fees: string
}

export interface leaseDetailsResp {
    status: number;
    exceed_value: number,
    payload_incentives: payloadIncentives,
    payload_upfits: payloadUpfits,
    payload_service_protection: payloadServiceProtection,
    payload_fees: payloadFees,
    inventory_disclaimer: inventoryDisclaimer | null,
    payload_calculation: payloadCalculation,
    payload_tax_and_fees_status: string,
    payload_tax_payment_mode: string,
    payload_taxes: payloadTaxesLease,
    request: request,
    taxs_and_fee_disclaimer_text: taxsAndFeeDisclaimerText,
    tax_and_fee_enable_status_sp: string
    total_fee: string,
    total_tax: string,
    total_taxs_and_fees: string,
    vauto_list_price: string,
    vauto_price_wo_incentive: string,
    vauto_upfit: string,
    lender_code: string
}

export interface inventoryDisclaimer {
    display_lable: string,
    is_winsticker_enable: string,
    msrp_disclaimer: string,
    status_disclaimer: string,
    vehicle_status_code: string
}

export interface payloadCalculation {
    additional_discount: number,
    adjusted_cost: string,
    allmanmoney_available?: boolean,
    apr_rate?: number,
    apr_rate_disclaimer_text?: string,
    conditional_offers: number,
    conditional_offers_available: boolean,
    customise_apr_flag: string,
    dealer_discount_available: boolean,
    default_apr_rate: number,
    default_term: number,
    down_payment: string,
    dp_percentage: number,
    incentive: number,
    incentives?: number,
    incentives_bonus_cash_available: boolean,
    incentives_cond_cash_available: boolean,
    incentives_cond_finance_available: boolean,
    incentives_cond_lease_available: boolean,
    monthly_payment: string,
    terms_list: number[],
    trade_value: number
}

export interface payloadFees {
    fees_list: any[],
    total_fees: number
}

export interface payloadIncentives {
    allmanmoney_removable?: any[],
    cond_removable?: any[],
    discount_list_array?: any[],
    noneligible?: any[],
    conditional_offers?: any,
    e_shop_bc_incentives?: any[],
    e_shop_private_offers?: any[],
    conditional_offers_group?: any,
    allmanmoney?: any[],
    discount_list?: string,
    discount_list_autofi?: string,
    incentivebonuscashlist?: any[],
    selected_allmanmoney?: any[],
    selected_conditional_offers?: any[]
}

export interface payloadServiceProtection {
    service_protection_list: any[],
    total_sp: number
}

export interface payloadTaxes {
    fees_list: any[],
    total_fees: number,
    feedetails?: {
        total: string,
        taxes: [{
            FeeName: string,
            Amount: string,
            FeeType: string,

        }]
    },
    isFeePaidInlease?: string,
    monthly_payment_with_taxes?: number,
    monthly_taxes?: number,
    subfees?: string,
    tax_payment_mode?: string,
    taxfees_cost_flag?: string,
    total_sub_tax?: number
}

export interface payloadTaxesLease {
    dealer_fee_lease_amount?: number,
    in_lease_payment_mode: string,
    isFeePaidInlease?: string,
    monthly_payment_with_taxes?: string,
    feedetails?: {
        total: number,
        taxes: {
            monthly_tax_details: [{ Amount: number, FeeCategory: string, FeeName: string, FeeType: string }],
            monthly_tax_total: number,
            upfront_tax_details: [{ Amount: number, FeeCategory: string, FeeName: string, FeeType: string }],
            upfront_tax_total: number
        }
    },
    monthly_taxes?: number,
    subfees?: string,
    tax_payment_mode?: string,
    tax_rate: string,
    taxfees_cost_flag?: string,
    total_sub_tax?: number
}

export interface payloadUpfits {
    upfit_list: any[],
    upfit_list_amount: number,
    upfit_list_type: string,
    listprice_label?: string
}

export interface request {
    additional_discount: string,
    customer_county_city?: string | null,
    customer_state: string | null,
    customer_zipcode: string,
    dealer_code: string,
    dealer_discount: string,
    dealer_discount_available: string,
    dealer_zipcode: string,
    default_terms_config: string,
    discount_amount: string,
    down_value: any,
    financial_type: string,
    is_customer_zipcode: string,
    is_widget: string,
    last_triggered_amm_incentives?: any,
    loading: string,
    mileage: string,
    msrp: number,
    prevdown: any,
    prevtradein: string,
    selectedIds: string,
    terms: any,
    tiers: any,
    tradein_value: any,
    transactionType: string,
    user_service_a_protection: any[],
    vin_details: {
        dealer_code: string,
        internetPrice: number,
        make: string,
        model: string,
        msrp: number,
        option_code: any | null,
        status_code: any | null,
        trim_desc: any | null,
        upper_level_pkg_cd: any | null,
        vehicle_type?: string,
        vin: string,
        year: number,
        oem_model_code?: string,
    }
    vinnumber: string,
    zipcode: string
    credit_score?: any,
    customer_city?: string | null,
    customer_county?: string | null,
    customer_rebate?: any[],
    employee_pricing?: number,
    employee_pricing_advertise?: number,
    flag_customer_zipcode?: string,
    has_dat_upfit?: boolean,
    homenet_cache?: string,
    homenet_dealer_discount?: string,
    homenet_dealer_discount_check?: string,
    homenet_incentive_check?: string,
    homenet_market_adjustment_cost?: string,
    inc_access_calc?: boolean,
    inc_access_tax_calc?: boolean,
    is_emp_adv_pgm_vin?: string,
    is_ferrario_vin?: string,
    is_homenet_vin?: string,
    is_max_vin?: string,
    is_msrp_strikeoff_enable?: string,
    is_vauto_vin?: string,
    lowest_type?: any,
    market_adjustment_cost?: number,
    price_display_type?: string,
    private_session_id?: string,
    rid?: any,
    show_employee_pricing?: boolean,
    sltMoparAcc?: any,
    type_of_pgm?: string,
    vRebetProgramID?: string
}

export interface applyCreditInfo {
    vin: string;
    dealer_code: string;
    zipcode?: string;
}

export type EmploymentPaymentFrequency = 'Weekly' | 'Bi-Weekly' | 'Twice-a-Month' | 'Monthly' | 'Annual';
export interface applyCreditInfoSpec {
    data: [
        {
            cc_flag: string,
            iframe_url: string,
        }
    ]
}

export interface applyCreditPayload {
    dealer_code: string,
    // vin: string,
    formTransactionID?: any;
    // tradeinInfo?: any;
    // serviceProtectionInfo: any[];
    // accessoriesInfo: any[];
    // chargerInfo: any[];
    scheduleDeliveryInfo?: any;
    // financeDetails: any;
    applicant: {
            employment: any;
            name: {
                first: any;
                last: any;
            },
            address: {
                street: string;
                city: string;
                state: string;
                zip: string;
                residenceType: string;
                residenceTimeInMonths: number;
                residenceMonthlyPayment: any;
            },
            phone: string;
            email: string;
            ssn: string;
            maritalStatus: string;
            dob: string;
            employmentIncome: number;
            // creditScore: number;
        },
        vehicle: {
            age: string;
            bodyType: string;
            color: string;
            invoice: any;
            make: string;
            model: string;
            // mileage: any;
            modelCode: string;
            msrp: number;
            trim: string;
            vin: string;
            year: number;
          // photoUrl: string;
            dealerRetailPrice: any;
        },
        callbackUrl: string;
        dealer: {
            code: string;
        },
        offerPreferences: {
            apr: any;
            incentiveOption: string;
            isSubvented: boolean;
            creditBand: string;
            downPayment: any;
            requestedOfferType: string;
            term: number;
        },
        taxRate: any;
        tax: any;
}
export interface applyCreditInfoError {
    status: boolean,
    message: string,
    data: [
        {
            string: []
        }
    ]
}
export interface taxsAndFeeDisclaimerText {
    tax_and_fee_cash_disclaimer: string,
    tax_and_fee_finance_disclaimer: string,
    tax_and_fee_lease_disclaimer?: string,
    finance_tax_label?: string,
    lease_tax_label?: string
}

export interface dealerInfoDetailsResp {
    Dealer_info: dealerInfo,
    PackageAndOption_list: string[],
    vehicle_information: vehicleInformation[]
}

export interface dealerInfoDetailsNewResp {
    PackageAndOption_list: any;
    Dealer_info: dealerInfo,
    Dealer_info_fromapi: string[],
    vehicle_information: vehicleInformation[]
}

export interface dealerInfo {
    dealerAddress1: string,
    dealerAddress2: string,
    dealerCity: string,
    dealerCode: string,
    dealerName: string,
    dealerState: string,
    dealerZip: number,
    demail: string,
    phoneNumber: string
}

export interface vehicleInformation {
    caption: string,
    value: string
}

export interface serviceProtectionResp {
    service_protections: {
        checkfinance: [],
        checklease: [],
        header: {
            finance: {
                service_header: string,
                service_logo: string
            },
            lease: {
                service_header: string,
                service_logo: string
            },
            plans: {
                finance: [
                    id: number,
                    finance_type: string,
                    protection_name: string,
                    protection_cost: any,
                    protection_cost_duration: any,
                    protection_description: string
                ],
                lease: [
                    id: number,
                    protection_cost: any,
                    protection_cost_duration: any,
                    protection_description: string,
                    protection_name: string
                ]
            }
        }
    } | null,
    status: string
}

export interface vehicleAccessories {
    vehicle_accessories: any[],
    status: string
}

export interface creditScore {
    status: string,
    data: {
        lease: {
            data: [{
                code: number,
                ficoLow: number,
                ficoHigh: number,
                description: string
            }]
        },
        finance: {
            data: [{
                code: number,
                ficoLow: number,
                ficoHigh: number,
                description: string
            }]
        },
    }
}

export interface checkLockedVins {
    "action": string,
    "minutes": number
}
export interface leadsTrack {
    vin: string,
    session_id: string,
    dealer_code: string,
    dealer_zip: string,
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    zip_code: string,
    lead_form: string,
    make: string,
    model: string,
    year: string,
    sd_sessionid: string,
}


// Payload of Accessories
export interface accessories {
    dlr_code: string,
    group_name: string,
    home: string,
    make: any,
    model: any,
    search: string,
    vin: string,
    year: any,
}

//Response of Accessories
export interface accessoriesResponse {
    data: [
        {
            id: number,
            image: string,
            isSelected: string,
            marketing_description: string,
            marketing_name: string,
            msrp: number,
            part_number: string,
            total_installation_on_cost: any
        }
    ],
    accessories_count: {
        featured: number,
        exterior: number,
        interior: number,
        "cargo and towing": number,
        "lighting and electrical": number
    }
}


export interface createLead {
    vin: string,
    dealer_code: string,
    sis_dealercode: string,
    dealerZip: string,
    accessories: {},
    adobe_session: number,
    chk_box_home_delivery: string,
    comments: string,
    contact_email: string,
    contact_phone: string,
    credit_app_status: string,
    credit_app_type: string,
    credit_current_form: string,
    current_FTID: string,
    current_session: string,
    current_submit_type: string,
    finance: {},
    first: string,
    init_pop_btntraffic: string,
    is_widget: string,
    last: string,
    lease: {},
    make: string,
    model: string,
    payment_payload: {
        type: string,
        comments: string,
        downpayment: string,
        monthly: string,
        total: string,
        xmlvariables: {
            dueatsigning: string,
            monthly_taxes: number,
            monthly_payment_with_taxes: number,
            msrp_results: number,
            additional_discount: string,
            dealer_discount: string,
            dealer_discount_available: string
            developer: {
                arraybuilder: {
                    tradeInValue: string,
                    milesPerYear: string
                }
            },
            incentiveAmount: number,
            incentivesBonusCashList: any[],
            original_downpayment: string,
            rebateDetailsfinalamount: number,
            selected_allmanmoney: any[],
            selected_conditional_offer: any[],
            tradeInValue: string
        },
    },
    postalcode: string,
    reserve_purchase_unit: {},
    scheduledeliver: {},
    so_pop: any,
    testdrive_city: string,
    testdrive_state: string,
    testdrive_streetline1: string,
    testdrive_zipcode: string,
    tier: string,
    tradein: {},
    year: string
}

export interface createLeadResp {
    "status": string,
    "code": number,
    "messages": any[],
    "result": {
        "status": string,
        "message": string,
        "sold_type": string,
        "current_FTID": string,
        "couponStatus": boolean,
        "couponDetail": any[],
        "dealer_bc_name": string
    }
}

export interface saveLockedVins {
    vin: string
}

export interface saveLockedVinsRes {
    "action": string,
    "minutes": string
}

export interface customerZipcodeResponse {
    status: string,
    county_city_details: [
        {
            county_city: string
        }
    ],
    state: string
}

export interface preQualification {
    first_name: string,
    last_name: string,
    address: string,
    apt: string,
    city: string,
    email: string,
    monthly_income: string,
    phone: string,
    prequal_pop_btntraffic: string,
    state: string,
    zip: string
}
export interface preQualificationRes {
    "success": boolean,
    "message": string,
    "data": any[],
    "privateoffer": any
}

export interface serviceContract {
    vin: string,
    termsInMonths: string,
    currentOdometer: string,
    milesperyear: string,
    customerAddressLine1: string,
    customerAddressLine2: string,
    customerCity: string,
    customerLastName: string,
    customerState: string,
    customerZipCode: string,
    dealerCode: string,
    dealerState: string,
    deductible: string,
    engineType: string,
    eppFlag: string,
    isCommercial: string,
    isLease: string,
    leaseOrLoanTerm: string,
    make: string,
    model: string,
    modelYear: string,
    optionSaleDate: string,
    paymentMode: string,
    productLine: string,
    source: string,
    vehicleInServiceDate: string,
    test_code: any;
}
export interface serviceContractRes {
    "returnCode": string,
    "postRequest": string,
    "images": {
        "WAGONEER-PREMIER-PROTECTION": string,
        "ROAD-HAZARD-TIRE-AND-WHEEL-PROTECTION": string,
        "ROAD-HAZARD-TIRE-&-WHEEL-PROTECTION": string,
        "ROAD-HAZARD-TIRE-AND-WHEEL-PROTECTION-Light": string,
        "AUTO-APPEARANCE-CARE": string,
        "AUTO APPEARANCE CARE - TIME OF SALE": string,
        "ADDED-CARE-PLUS": string,
        "ADDED-CARE-PLUS-LEASE": string,
        "MAXIMUM-CARE": string,
        "LEASE-PROTECT": string,
        "LEASE-WEAR-AND-TEAR": string,
        "LEASE-WEAR-&-TEAR": string,
        "MULTICARE-PLUS-ULTIMATE": string,
        "GAP-(GUARANTEED-AUTOMOTIVE-PROTECTION)": string,
        "GAP": string,
        "GUARANTEED-AUTO-PROTECTION": string
    },
    "discription": {
        "WAGONEER-PREMIER-PROTECTION": string,
        "ROAD-HAZARD-TIRE-AND-WHEEL-PROTECTION-Light": string,
        "ROAD-HAZARD-TIRE-AND-WHEEL-PROTECTION": string,
        "ROAD-HAZARD-TIRE-&-WHEEL-PROTECTION": string,
        "AUTO-APPEARANCE-CARE": string,
        "AUTO APPEARANCE CARE - TIME OF SALE": string,
        "MAXIMUM-CARE-LEASE": string,
        "ADDED-CARE-PLUS": string,
        "ADDED-CARE-PLUS-LEASE": string,
        "MAXIMUM-CARE": string,
        "LEASE-PROTECT": string,
        "LEASE-WEAR-AND-TEAR": string,
        "LEASE-WEAR-&-TEAR": string,
        "MULTICARE-PLUS-ULTIMATE": string,
        "GAP-(GUARANTEED-AUTOMOTIVE-PROTECTION)": string,
        "GAP": string,
        "GUARANTEED-AUTO-PROTECTION": string
    },
    "paymentMode": string,
    "customize_serviceprice": string,
    "lease_percentage": number,
    "finance_percentage": number,
    "cash_percentage": number,
    "service_protections": any[],
    "checkedPlan": {
        "checklease": any[],
        "checkfinance": any[],
        "checkcash": any[]
    }
    "dealerCode": string,
}

export interface privateOffer {
    brand: string,
    current_session: string,
    emailAddress: string,
    firstName: string,
    lastName: string,
    programID: string,
    zipCode: string,
}

export interface privateOfferResponse {
    match: string,
    certCodeGenerated: string,
    privateOffers: [],
    cached: false,
    status: false,
    message: string
}

export interface fetchAutoAddressResponse {
    status: string,
    code: number,
    messages: [],
    result: {
        formatted_address: []
    }
}
export interface reserveNowFAQRes {
    "faq_q_1": [
        string, string
    ],
    "faq_q_2": [
        string, string
    ],
    "faq_q_3": [
        string, string
    ],
    "faq_q_4": [
        string, string
    ],
    "faq_q_5": [
        string, string
    ],
    "faq_q_6": [
        string, string
    ],
    "faq_q_7": [
        string, string
    ],
    "faq_q_8": [
        string, string
    ],
    "faq_q_9": [
        string, string
    ]
}

export interface prequalify_data {
    first_name: string,
    last_name: string,
    email: any,
    phone: any,
    address: string,
    apt: any,
    city: string,
    state: string,
    zip: any,
    monthly_income: any,
    prequal_pop_btntraffic: string
}

export interface prequalify_resp {
    success: boolean,
    message: string,
    data: any[],
    privateoffer: any,
    prequalification_status: number
}

export interface UsedFinanceDatails {    
    vin: string;
    dealercode: string;
    zipcode: string;
  
    transactionType: string;
    tradein: any;
    additional_discount:any;
    term?: string;
    down?: string;
    internetprice?: string;
    selectedIds?: string;
    is_widget: string;
    dealer_discount_available?: string;
    user_service_a_protection?: any;
    customer_state?: string;
    customer_county_city?: string;
    is_customer_zipcode?: string;
    apr_rate?:string;
    initial_load:string;
    apr_rate_type:string;
    thirdpartyapr:string;


}

export interface UsedCashDatails {    
    vin: string;
    dealercode: string;
    zipcode: string;
    transactionType: string;
    tradein: any;
    additional_discount:any;
    internetprice?: string;
    selectedIds?: string;
    dealer_discount_available?: string;
    is_widget: string;
    customer_state?: string;
    customer_county_city?: string;
    is_customer_zipcode?: string;
    initial_load:string;
}

