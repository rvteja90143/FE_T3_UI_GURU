import { DataHandler } from '../common/data-handler';
import { environment } from '../../environments/environment';

// Provide minimal typings for global flags to prevent duplicate loads/initializations
declare global {
  interface Window {
    __SD_SCRIPT_ADDED?: boolean;
    __SD_CONTAINER_CREATED?: boolean;
    sd?: any;
    ShiftAnalyticsObject?: any;
  }
}

export class ShiftDigitalHandler {
	
    public static load(callback:any, urls:any, i:any, s:any) {
        // Guard: avoid injecting the sd.js script more than once
        const scriptId = 'sd-script-STELLANTIS';
        if (document.getElementById(scriptId) || (window as any).__SD_SCRIPT_ADDED) {
            return;
        }
        (function (i: any, s, o, g, r, a?: any, m?: any) {
            var date: any = new Date();
            i['ShiftAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * date;
            DataHandler.ShiftdigitalData = i;
            a = s.createElement(o), m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            a.id = scriptId; // help detect duplicates
            m.parentNode.insertBefore(a, m);
            (i as any).__SD_SCRIPT_ADDED = true;
        })(window, document, 'script', environment.SHIFT_DIGITAL_LAUNCH_SCRIPT_URL, 'sd');
    }

    public static init(dealer_code: any) {
        var callback:any = 'sd';
        // Ensure script is present (once-only)
        this.load(callback, environment.SHIFT_DIGITAL_LAUNCH_SCRIPT_URL, window, document);

        // Create the container only once to avoid "Container already exists" errors
        if (!(window as any).__SD_CONTAINER_CREATED) {
            DataHandler.ShiftdigitalData.sd('create', 'STELLANTIS', dealer_code, 'CARZATO');
            (window as any).__SD_CONTAINER_CREATED = true;
        }

        DataHandler.ShiftdigitalData.sd('getSessionId', this.myTaggingFunction);
    }

    public static pageload(section:any) {
        var event = '';
        if (section == 'widget open') {
            event = 'pageview';
        } else if (section == 'Reserve now') {
            event = 'pageview';
        }
        DataHandler.ShiftdigitalData.sd('dataLayer', {
            pageType: 'Digital Retailing',
            digRet: {
                dealId: DataHandler.current_session,
                provider: 'CARZATO',
                vehicleYear: DataHandler.year,
                vehicleMake: DataHandler.make,
                vehicleModel: DataHandler.model,
                vehicleVin: DataHandler.vin,
                priceUnlocked: DataHandler.price,
            
                vehicleStatus: 'New'
            },
            events: event
        });
        DataHandler.ShiftdigitalData.sd('send', event);
    }

    public static myTaggingFunction(sessionId: any) {
        DataHandler.sdSessionId = sessionId;
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

	public static shiftdigitalexecutor(section: any='', type: string = '') {
		var event = '';
		if (section == 'Initial popup form start') {
			event = 'drLeadFormStart';
		}else if(section == 'Initial popup form submit') {
			event = 'drLeadFormFinish';
		}else if(section == 'Test Drive form start') {
		event = 'drLeadFormStart';
		}
		else if(section == 'Test Drive form finish') {
			event = 'drLeadFormFinish';
		} else if(section == 'Test Drive form submit') {
			event = 'drApptSchedFinish';
		}else if(section == 'scheduled Delivery form start') {
			event = 'drApptSchedStart';
		}else if(section == 'scheduled Delivery form submit') {
			event = 'drApptSchedFinish';
		}else if(section == 'Select Date') {
			event = 'drApptSchedStart';
		}else if(section == 'Lead form start') {
			event = 'drLeadFormStart';
		}else if(section == 'Lead form submit') {
			event = 'drLeadFormFinish';
		}else if(section == 'Click on print') {
			event = 'drInitialClick';
		}else if(section == 'Click on Back to window') {
			event = 'drInitialClick';
		}else if(section == 'open Review Payment option') {
			event = 'drPaymentCalcShown';
		} else if (section == 'close Review Payment option') {
			event = 'drPaymentCalcFinish';
		} else if(section == 'vehicle Information') {
			event = 'drFiFinish';
		}else if(section == 'Service and Protection') {
			event = 'drFiShown';
		}else if(section == 'Delivery, Review & Submit') {
			event = 'drFiFinish';
		}else if(section == 'Click Submit to dealer') {
			event = 'drInitialClick';
		}else if(section == 'Gallery Image Click') {
			event = 'drInitialClick';
		}else if(section == 'Gallery Next Image') {
			event = 'drInitialClick';
		}else if(section == 'Initial popup form continue') {
			event = 'drInitialClick';
		}else if(section == 'tradein show') {
			event = 'drTradeInShown';
		}else if(section == 'tradein start') {
			event = 'drTradeInstart';
		}else if(section == 'tradein bb submit') {
			event = 'drTradeInFinish';
		}else if(section == 'tradein kbb submit') {
			event = 'drTradeInFinish';
		}else if(section == 'CTA click') {
			event = 'drInitialClick';
		}else if(section == 'submit to dealer start') {
			event = 'drleadformstart';
		}else if(section == 'submit to dealer end') {
			event = 'drleadformfinish';
		}else if(section == 'apply for credit start') {
			event = 'drleadformstart';
		}else if(section == 'apply for credit end') {
			event = 'drleadformfinish';
		}else if(section == 'lead form show') {
			event = 'drLeadFormShown';
		}else if(section == 'impression') {
			event = 'drImpression';
		}else if(section == 'drop save') {
			event = 'drDropSave';
		}else if(section == 'show date') {
			event ='drApptSchedShown';
		}else if(section == 'Test Drive form date') {
			event = 'drApptSchedStart';
		}else if(section == 'pre-qual show') {
			event = 'drPreQShown';
		}else if(section == 'pre-qual start') {
			event = 'drPreQStart';
		}else if(section == 'pre-qual end') {
			event = 'drPreQFinish';
		}else if(section == 'accessories') {
			event = 'drAccessoriesShown';
		}else if(section == 'offer add') {
			event = 'drOfferAdded';
		}else if(section == 'accessoriesfinish') {
			event = 'drAccessoriesFinish ';
		}

		DataHandler.ShiftdigitalData.sd('dataLayer', {
			pageType: 'Digital Retailing',
			digRet: {
				dealId: DataHandler.current_session,
				provider: 'CARZATO',
				vehicleYear: DataHandler.year,
				vehicleMake: DataHandler.make,
				vehicleModel: DataHandler.model,
				vehicleVin: DataHandler.vin,
				priceUnlocked: DataHandler.price,
				vehicleStatus: 'New'
			},
			events: event
		});
		DataHandler.ShiftdigitalData.sd('send');
	}


	public static shiftdigitalexecutorSNP(section: any='', type: string = '') {
		var event = '';
		if(section == 'Lease Service and Protection Add') {
			event = 'drAddToCart';
		}else if(section == 'Finance Service and Protection Add') {
			event = 'drAddToCart';
		}else if(section == 'Cash Service and Protection Add') {
			event = 'drAddToCart';
		}
		else if(section == 'add accessories') {
			event = 'drAddToCart';
		}

		DataHandler.ShiftdigitalData.sd('dataLayer', {
			pageType: 'Digital Retailing',
			digRet: {
				dealId: DataHandler.current_session,
				provider: 'CARZATO',
				vehicleYear: DataHandler.year,
				vehicleMake: DataHandler.make,
				vehicleModel: DataHandler.model,
				vehicleVin: DataHandler.vin,
				priceUnlocked: DataHandler.price,
				AddOnName:DataHandler.shiftdigitaladdoname,
				AddOnType:DataHandler.shiftdigitaladdontype,
				vehicleStatus: 'New'
			},
			events: event
		});
		DataHandler.ShiftdigitalData.sd('send');
	}

	public static shiftdigitalexecutoraccessories(section: any='', type: string = '') {
		var event = '';
	 	if(section == 'add accessories') {
			event = 'drAddToCart';
		}
		
		DataHandler.ShiftdigitalData.sd('dataLayer', {
			pageType: 'Digital Retailing',
			digRet: {
				dealId: DataHandler.current_session,
				provider: 'CARZATO',
				vehicleYear: DataHandler.year,
				vehicleMake: DataHandler.make,
				vehicleModel: DataHandler.model,
				vehicleVin: DataHandler.vin,
				priceUnlocked: DataHandler.price,
				AddOnName:DataHandler.shiftdigitalaccessoroesaddoname,
				AddOnType:DataHandler.shiftdigitalaccessoroesaddontype,
				vehicleStatus: 'New'
			},
			events: event
		});
		DataHandler.ShiftdigitalData.sd('send');
	}
	public static shiftdigitalexecutorpaymentcalc(section: any='', type: string = '') {
		var event = '';
        if(section == 'Payment Calc Interaction') {
			event = 'drPaymentCalcInteraction';
		}else if(section == 'Payment Calc Interaction tab') {
			event = 'drPaymentCalcInteraction';
		}

		DataHandler.ShiftdigitalData.sd('dataLayer', {
			pageType: 'Digital Retailing',
			digRet: {
				dealId: DataHandler.current_session,
				provider: 'CARZATO',
				vehicleYear: DataHandler.year,
				vehicleMake: DataHandler.make,
				vehicleModel: DataHandler.model,
				vehicleVin: DataHandler.vin,
				priceUnlocked: DataHandler.price,
				vehicleStatus: 'New',
				dealType :DataHandler.paymenttype
			},
			events: event
		});
		DataHandler.ShiftdigitalData.sd('send');
	}
}
