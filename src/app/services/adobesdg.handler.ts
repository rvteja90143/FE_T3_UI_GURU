import { DataHandler } from '../common/data-handler';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';

export class AdobeSDGHandler {

    static genFTID: any = false;
    static FTID: any;

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
        var gen_FTID = DataHandler.adobeSDGgetGlobalVisitorsIds;
        return gen_FTID + ":" + this.fulldateString();
    }

    public static fulldateString() {
        var date = new Date();
        var month = date.getUTCMonth() + 1;
        var day = date.getUTCDate();
        var year = date.getUTCFullYear();

        var date_hour = date.getUTCHours();
        var date_minute = date.getUTCMinutes();
        var date_second = date.getUTCSeconds();
        var fulldate = year + "-" + (('' + month).length < 2 ? '0' : '') + month + "-" + (('' + day).length < 2 ? '0' : '') + day + "T" + (('' + date_hour).length < 2 ? '0' : '') + date_hour + ":" + (('' + date_minute).length < 2 ? '0' : '') + date_minute + ":" + (('' + date_second).length < 2 ? '0' : '') + date_second;
        return fulldate;
    }

    public static async encryptemail(email: any) {
        var emailsubmit = email.toLowerCase();
        var finalEmail = emailsubmit.trim();
        var msgUint8 = new TextEncoder().encode(finalEmail);
        var hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        var hashArray = Array.from(new Uint8Array(hashBuffer));
        var hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    public static hashValues(input: any): any {
        let hashValue = CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
        return hashValue;
    }

    public static slug(str: string) {
        if (str != "") {
            str = str.replace(/[&\/\\#,()$~%.'"*?<>{}®™]/g, '');
            str = str?.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
        }
        return str;
    }

    public static slug_space(str: string) {
        if (str != "") {
            str = str?.toLowerCase().trim().replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
        }
        return str;
    }

    public static responsiveState() {
        var userAgent: string = navigator.userAgent || navigator.vendor;

        const regexs = [/(Android)(.+)(Mobile)/i, /BlackBerry/i, /iPhone|iPod/i, /Opera Mini/i, /IEMobile/i]
        var isMobileDevice = regexs.some((b) => userAgent.match(b))

        if (!isMobileDevice) {
            const regex = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/
            var isTabletDevice = regex.test(userAgent.toLowerCase())
            if (isTabletDevice) {
                return "tablet";
            } else {
                return "desktop";
            }
        } else {
            return "mobile";
        }
    }


    public static eventLogger(section: any, params: any) {

        let eventObj = {};        
    //    DataHandler.adobeSDGgetGlobalVisitorsIds = this.generateUUID();
            this.FTID = this.generateFTID();
   // this.genFTID = true;
         
        try {
            const decodedParams: { [key: string]: any } = {};
            try {
                Object.keys(params).forEach((key) => {
                    if ((params?.model?.toLowerCase() == 'charger' || params?.model == 'CHARGER') && params.year == '2024') {
                        params.model = 'daytona';
                    }
                    const value = params[key];
                    if (value !== null && value !== undefined && value !== "") {
                        if (typeof value === 'string') {
                            decodedParams[key] = decodeURIComponent(value);
                        } else {
                            decodedParams[key] = value;
                        }
                    }
                });
            }
            catch (e) {
                console.error(e);
            }

            if (DataHandler.adobeSDGdata != undefined) {
                 let trim = decodeURIComponent(DataHandler.trim)
                let vin = decodeURIComponent(DataHandler.vin)
                let model =DataHandler?.model?.toLowerCase();
                 if ((DataHandler?.model?.toLowerCase() == 'charger' || DataHandler?.model == 'CHARGER') && DataHandler.year == '2024') {
                        model = 'daytona';
                    }
                if (section == 'page-load') {
                    eventObj = {
                        "event": "page-load",
                        "thirdPartyToolDetails": "vehicle-reservation|carzato",
                        "page": {
                            "type": params.pageType,
                            "name": params.pageName,
                            ...(params.site ? { "site": params.site } : {}) //Omit if none found
                        },
                        "platform": {
                            "technology": "carzato"
                        },
                        "user": {
                            "language": "en-US",
                            "responsiveState": this.responsiveState(),
                            ...(params.zipCode ? { "zipCode": params.zipCode } : {}) //Omit if none found
                        },
                        "vehicle": {
                            ...(params.make ? { "make": this.slug(params.make) } : {}), //Omit if none found
                            ...(params.model ? { "model": this.slug(params.model) } : {}), //Omit if none found
                            ...(params.year ? { "year": params.year } : {}), //Omit if none found
                            ...(decodedParams.trim ? { "trim": this.slug(decodedParams.trim) } : {}), //Omit if none found
                            ...(decodedParams.vin ? { "vin": this.slug(decodedParams.vin) } : {}) ,//Omit if none found
                            ...(params.condition ? { "condition": params.condition } : {}), 
                        },
                        ...(params.dealerCode ? { dealer: { code: params.dealerCode } } : {}) //Omit if none found
                    };
                }

                if (section == 'interaction-click') {                   
                    eventObj = {
                        "event": "interaction-click",
                        "thirdPartyToolDetails": "vehicle-reservation|carzato",
                        "interaction": {
                            "site": params.site,
                            "type": params.type,
                            "page": params.page,
                            "location": params.location,
                            ...(params.description ? { "description": this.slug_space(params.description) } : {}),
                            ...(params.page ? { "page": params.page } : {}),
                            ...(params.name ? { "name": this.slug(params.name) } : {}) //Omit if none found
                        },
                         "platform": {
                            "technology": "carzato"
                        },
                        "user": {
                            "language": "en-US",
                            "responsiveState": this.responsiveState(),
                            ...(DataHandler.zipcode ? { "zipCode": DataHandler.zipcode } : {}) //Omit if none found
                        },
                        "vehicle": {
                            ...(DataHandler.make ? { "make": this.slug(DataHandler.make) } : {}), //Omit if none found
                            ...(model ? { "model": this.slug(model) } : {}), //Omit if none found
                            ...(DataHandler.year ? { "year": DataHandler.year } : {}), //Omit if none found
                            ...(trim ? { "trim": this.slug(trim) } : {}), //Omit if none found
                            ...(vin ? { "vin": this.slug(vin) } : {}) ,//Omit if none found
                            ...(DataHandler.actualVehicleType ? { "condition": DataHandler.actualVehicleType.toLowerCase() } : {}), 
                        },
                        ...(DataHandler.dealercode ? { dealer: { code: DataHandler.dealercode } } : {}) //Omit if none found
                    };
                }

                if (section == 'form-start') {
                    eventObj = {
                        "event": "form-start",
                        "thirdPartyToolDetails": "vehicle-reservation|carzato",
                        "form": {
                            "formDescription": this.slug(params.formDescription),
                            "formType": params.formType,
                            "displayType": params.displayType,
                            "displayFormat": params.displayFormat,
                            ...(params.linkDetails ? { "linkDetails": this.slug(params.linkDetails) } : {}),
                            ...(params.tradeInProvider ? { "tradeInProvider": params.tradeInProvider } : {})
                        },
                         "platform": {
                            "technology": "carzato"
                        },
                        "user": {
                            "language": "en-US",
                            "responsiveState": this.responsiveState(),
                            ...(DataHandler.zipcode ? { "zipCode": DataHandler.zipcode } : {}) //Omit if none found
                        },
                        "vehicle": {
                            ...(DataHandler.make ? { "make": this.slug(DataHandler.make) } : {}), //Omit if none found
                            ...(model ? { "model": this.slug(model) } : {}), //Omit if none found
                            ...(DataHandler.year ? { "year": DataHandler.year } : {}), //Omit if none found
                            ...(trim ? { "trim": this.slug(trim) } : {}), //Omit if none found
                            ...(vin ? { "vin": this.slug(vin) } : {}) ,//Omit if none found
                            ...(DataHandler.actualVehicleType ? { "condition": DataHandler.actualVehicleType.toLowerCase() } : {}), 
                        },
                        ...(DataHandler.dealercode ? { dealer: { code: DataHandler.dealercode } } : {}) //Omit if none found
                    };
                }

                if (section == 'form-submit') {
                    eventObj = {
                        "event": "form-submit",
                        "thirdPartyToolDetails": "vehicle-reservation|carzato",
                        "form": {
                            "formDescription": this.slug(params.formDescription),
                            "formType": params.formType,
                            "displayType": params.displayType,
                            "displayFormat": params.displayFormat,
                            ...((params.formDescription != 'non-lead') ? { hashedEmail: this.hashValues(DataHandler.email) } : {}), //Omit if none found
                            ...((params.formDescription != 'non-lead') ? { leadId: this.FTID } : {}), //Omit if none found
                            ...(params.linkDetails ? { "linkDetails": this.slug(params.linkDetails) } : {}),
                            ...(params.tradeInProvider ? { "tradeInProvider": params.tradeInProvider } : {})
                        },
                         "platform": {
                            "technology": "carzato"
                        },
                        "user": {
                            "language": "en-US",
                            "responsiveState": this.responsiveState(),
                            ...(DataHandler.zipcode ? { "zipCode": DataHandler.zipcode } : {}) //Omit if none found
                        },
                        "vehicle": {
                            ...(DataHandler.make ? { "make": this.slug(DataHandler.make) } : {}), //Omit if none found
                            ...(model ? { "model": this.slug(model) } : {}), //Omit if none found
                            ...(DataHandler.year ? { "year": DataHandler.year } : {}), //Omit if none found
                            ...(trim ? { "trim": this.slug(trim) } : {}), //Omit if none found
                            ...(vin ? { "vin": this.slug(vin) } : {}) ,//Omit if none found
                            ...(DataHandler.actualVehicleType ? { "condition": DataHandler.actualVehicleType.toLowerCase() } : {}), 
                        },
                        ...(DataHandler.dealercode ? { dealer: { code: DataHandler.dealercode } } : {}) //Omit if none found
                    };
                }

                if (section == 'error-display') {
                    eventObj = {
                        "event": "error-display",
                        "thirdPartyToolDetails": "vehicle-reservation|carzato",
                        "error": {
                            ...(params.message ? { "message": params.message.toLowerCase(), } : {}),
                            ...(params.type ? { "type": params.type.toLowerCase() } : {})
                        },
                         "platform": {
                            "technology": "carzato"
                        },
                        "user": {
                            "language": "en-US",
                            "responsiveState": this.responsiveState(),
                            ...(DataHandler.zipcode ? { "zipCode": DataHandler.zipcode } : {}) //Omit if none found
                        },
                        "vehicle": {
                            ...(DataHandler.make ? { "make": this.slug(DataHandler.make) } : {}), //Omit if none found
                            ...(model ? { "model": this.slug(model) } : {}), //Omit if none found
                            ...(DataHandler.year ? { "year": DataHandler.year } : {}), //Omit if none found
                            ...(trim ? { "trim": this.slug(trim) } : {}), //Omit if none found
                            ...(vin ? { "vin": this.slug(vin) } : {}) ,//Omit if none found
                            ...(DataHandler.actualVehicleType ? { "condition": DataHandler.actualVehicleType.toLowerCase() } : {}), 
                        },
                        ...(DataHandler.dealercode ? { dealer: { code: DataHandler.dealercode } } : {}) //Omit if none found
                    };
                }

                if (section == 'list-interaction') {
                    eventObj = {
                        "event": "list-interaction",
                        "thirdPartyToolDetails": "vehicle-reservation|carzato",
                        "listInteraction": {
                            "type": params.listIntType,
                            "listName": params.listName,
                            "listTotal": params.listCount,
                            "listModified": params.listModify,
                            "fleetCart": {
                                "inCart": ["<VIN1>", "<VIN2>", "<VIN3>"],
                                "added": ["<VIN2>", "<VIN3>"]
                            }
                        },
                         "platform": {
                            "technology": "carzato"
                        },
                        "user": {
                            "language": "en-US",
                            "responsiveState": this.responsiveState(),
                            ...(DataHandler.zipcode ? { "zipCode": DataHandler.zipcode } : {}) //Omit if none found
                        },
                        "vehicle": {
                            ...(DataHandler.make ? { "make": this.slug(DataHandler.make) } : {}), //Omit if none found
                            ...(model ? { "model": this.slug(model) } : {}), //Omit if none found
                            ...(DataHandler.year ? { "year": DataHandler.year } : {}), //Omit if none found
                            ...(trim ? { "trim": this.slug(trim) } : {}), //Omit if none found
                            ...(vin ? { "vin": this.slug(vin) } : {}) ,//Omit if none found
                            ...(DataHandler.actualVehicleType ? { "condition": DataHandler.actualVehicleType.toLowerCase() } : {}), 
                        },
                        ...(DataHandler.dealercode ? { dealer: { code: DataHandler.dealercode } } : {}) //Omit if none found
                    };
                }

                if (section == 'video-interaction') {
                    eventObj = {
                        "event": "video-interaction",
                        "thirdPartyToolDetails": "vehicle-reservation|carzato",
                        "video": {
                            "eventType": "progress-25",
                            "length": "193",
                            "position": "48",
                            "name": "chrysler-connect-how-it-works"
                        },
                         "platform": {
                            "technology": "carzato"
                        },
                        "user": {
                            "language": "en-US",
                            "responsiveState": this.responsiveState(),
                            ...(DataHandler.zipcode ? { "zipCode": DataHandler.zipcode } : {}) //Omit if none found
                        },
                        "vehicle": {
                            ...(DataHandler.make ? { "make": this.slug(DataHandler.make) } : {}), //Omit if none found
                            ...(model ? { "model": this.slug(model) } : {}), //Omit if none found
                            ...(DataHandler.year ? { "year": DataHandler.year } : {}), //Omit if none found
                            ...(trim ? { "trim": this.slug(trim) } : {}), //Omit if none found
                            ...(vin ? { "vin": this.slug(vin) } : {}) ,//Omit if none found
                            ...(DataHandler.actualVehicleType ? { "condition": DataHandler.actualVehicleType.toLowerCase() } : {}), 
                        },
                        ...(DataHandler.dealercode ? { dealer: { code: DataHandler.dealercode } } : {}) //Omit if none found
                    };
                }

                if (section == 'chat-interaction') {
                    eventObj = {
                        "event": "chat-interaction",
                        "thirdPartyToolDetails": "vehicle-reservation|carzato",
                        "chat": {
                            "eventType": "connect",
                            "reason": "<reason>",
                            "id": "<id>"
                        },
                         "platform": {
                            "technology": "carzato"
                        },
                        "user": {
                            "language": "en-US",
                            "responsiveState": this.responsiveState(),
                            ...(DataHandler.zipcode ? { "zipCode": DataHandler.zipcode } : {}) //Omit if none found
                        },
                        "vehicle": {
                            ...(DataHandler.make ? { "make": this.slug(DataHandler.make) } : {}), //Omit if none found
                            ...(model ? { "model": this.slug(model) } : {}), //Omit if none found
                            ...(DataHandler.year ? { "year": DataHandler.year } : {}), //Omit if none found
                            ...(trim ? { "trim": this.slug(trim) } : {}), //Omit if none found
                            ...(vin ? { "vin": this.slug(vin) } : {}) ,//Omit if none found
                            ...(DataHandler.actualVehicleType ? { "condition": DataHandler.actualVehicleType.toLowerCase() } : {}), 
                        },
                        ...(DataHandler.dealercode ? { dealer: { code: DataHandler.dealercode } } : {}) //Omit if none found
                    };
                }
                DataHandler.adobeSDGdata.push(eventObj);
            }
        } catch (err) {
            console.error("Adobe eventLogger getting issue", err);
        }

    }

}
