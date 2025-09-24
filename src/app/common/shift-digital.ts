import { DataHandler } from '../common/data-handler';
import { environment } from '../../environments/environment';

export class ShiftDigitalHandler {
	
	public static load(callback:any, urls:any, i:any, s:any) {
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
			
			m.parentNode.insertBefore(a, m);
		})(window, document, 'script', environment.SHIFT_DIGITAL_LAUNCH_SCRIPT_URL, 'sd');
	}

	public static init(dealer_code: any) {
		var callback:any = 'sd';
		this.load(callback, environment.SHIFT_DIGITAL_LAUNCH_SCRIPT_URL, window, document);
		DataHandler.ShiftdigitalData.sd('create', 'STELLANTIS', dealer_code, 'CARZATO');
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
			events: 'pageview'
		});
		DataHandler.ShiftdigitalData.sd('send', 'pageview');
	}
	public static myTaggingFunction(sessionId: any) {
        DataHandler.sdSessionId  = sessionId;
    }

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
