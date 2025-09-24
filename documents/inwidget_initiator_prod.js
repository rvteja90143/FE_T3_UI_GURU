(async APILoader => {
	const API = await APILoader.create(document.currentScript || 'stellantis-eshop');
	const config = await API.utils.getConfig();
	let inwidgetDealerType = '';
	let loadedJs = false;
	let loadedJsEprice = false;
	const integrationId = API.init.integrationId; console.log(integrationId);
	let parentStyle = 'html:is(.srp, .vdp) div[data-web-api-id="' + integrationId + '"] ';

	let modelCode = ['WDEE75', 'DS6T98', 'LDDE48', 'LDEE48'];
	function isValidVin(vin) {
		var vList1 = null;
		if (window.DDC.dataLayer.page.pageInfo.isVlp) {
			vList1 = DDC.InvData.inventory.inventory;
			//console.log(vList1);
			if (vList1 === undefined) return true;
			for (i = 0; i < vList1.length; i++) {
				if (vList1[i].vin === vin && modelCode.includes(vList1[i].modelCode)) {
					console.log("Blocked modelCode:" + vin + ":" + vList1[i].modelCode);
					return false;
				}
			}
		}
		else if (window.DDC.dataLayer.page.pageInfo.isVdp) {
			vList1 = window.DDC.dataLayer.vehicles[0];
			if (modelCode.includes(vList1.modelCode)) return false;
		}
		return true;
	}

	function delayedloading(vin, dealerCode, zipCode, url, wclass, type,t3_new_inwidget,vehicle_type,page='') {
		if (wclass == 'inwidgetimage') {
			 const links = document.querySelectorAll('.inwidgetimage');
				links.forEach(link => {
				// Add a 'disabled' attribute (for custom styling or logic)
				link.setAttribute('disabled', 'true');
				link.style.pointerEvents = "none";
				link.style.opacity = "0.5";

				// Prevent the link from working
				link.addEventListener('click', function(e) {
				e.preventDefault(); // Stop navigation
				});


				});
			if (!loadedJs) {
				if (inwidgetDealerType != 'DDC') {
					hideClass(wclass, dealerCode);
				}
				if(t3_new_inwidget == 'N'){
					if (isInwidgetMobile()) {
						url = "https://dealeradmin.drivefca.com/js/app-element-mobile-old.js";
					} else {
						url = "https://dealeradmin.drivefca.com/js/app-element-web-old.js";
					}
			    }else{
					url = 'https://dealeradmin.drivefca.com/js/app-element-redesign-prod.js';
				}
				//const attributeMap = new Map([['type', 'module']]);
				API.loadJS(url).then(() => {
					loadedJs = true;
					//hide all the image instances 
					setTimeout(() => {
						window["angularComponentReference"].zone.run(() => { window.angularComponentReference.loadAngularFunction(vin, dealerCode, zipCode, '', '', '', '', '', 'DDC','',page,'',vehicle_type); });
					}, 1000);
				});
			} else {
				window["angularComponentReference"].zone.run(() => { window.angularComponentReference.loadAngularFunction(vin, dealerCode, zipCode, '', '', '', '', '', 'DDC','',page,'',vehicle_type); });
			}
		} else if (wclass == 'eshop-eprice') {
			if (!loadedJsEprice) {
				API.loadJS(url).then(() => {
					loadedJsEprice = true;
					setTimeout(() => {
						window["angularEpriceComponentReference"].zone.run(() => { window.angularEpriceComponentReference.loadAngularFunction(vin, dealerCode, zipCode); });
						if (!loadedJs) {
							if (inwidgetDealerType != 'DDC') {
								hideClass('inwidgetimage', dealerCode);
							}
							if(t3_new_inwidget == 'N'){
								if (isInwidgetMobile()) {
									API.loadJS('https://dealeradmin.drivefca.com/js/app-element-mobile-old.js').then(() => {
										loadedJs = true;
									});
								} else {
									API.loadJS('https://dealeradmin.drivefca.com/js/app-element-web-old.js').then(() => {
										loadedJs = true;
									});
								}
						    }else{
								API.loadJS('https://dealeradmin.drivefca.com/js/app-element-redesign-prod.js').then(() => {
									loadedJs = true;
								});
							}
						}
					}, 2000);
				});
			} else {
				window["angularEpriceComponentReference"].zone.run(() => { window.angularEpriceComponentReference.loadAngularFunction(vin, dealerCode, zipCode); });
				if (!loadedJs) {
					hideClass('inwidgetimage', dealerCode);
					if(t3_new_inwidget == 'N'){
						if (isInwidgetMobile()) {
							API.loadJS('https://dealeradmin.drivefca.com/js/app-element-mobile-old.js').then(() => {
								loadedJs = true;
							});
						} else {
							API.loadJS('https://dealeradmin.drivefca.com/js/app-element-web-old.js').then(() => {
								loadedJs = true;
							});
						}
				    }else{
						API.loadJS('https://dealeradmin.drivefca.com/js/app-element-redesign-prod.js').then(() => {
							loadedJs = true;
						});
					}
				}
			}
		}
	}

	function isInwidgetMobile() {
		return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
	}

	function invokePopup(vin, dealerCode, zipCode, url, wclass, type = 'image',t3_new_inwidget,vehicle_type,page) {
		if (wclass == 'inwidgetimage') {
			delayedloading(vin, dealerCode, zipCode, url, wclass, type,t3_new_inwidget,vehicle_type,page);
		} else if (wclass == 'eshop-eprice') {
			delayedloading(vin, dealerCode, zipCode, url, wclass, type,t3_new_inwidget,vehicle_type,'');
		}
	}

	function createClass(prClass, dealerCode) {
		if (prClass == 'inwidgetimage') {
			parentStyle = '';
		}
		const style = document.createElement('style');
		style.type = 'text/css';
		document.getElementsByTagName('head')[0].appendChild(style);
		if (!(style.sheet || {}).insertRule)
			(style.styleSheet || style.sheet).addRule(parentStyle + '.' + prClass, 'cursor: pointer; display:show; width:100%');
		else
			style.sheet.insertRule(parentStyle + '.' + prClass + ' { cursor: pointer; display:show; width:100% }', 0);
	}

	function hideClass(prClass, dealerCode) {
		if (dealerCode == '27289') {
			parentStyle = '';
		}
		const style = document.createElement('style');
		style.type = 'text/css';
		document.getElementsByTagName('head')[0].appendChild(style);
		if (!(style.sheet || {}).insertRule)
			(style.styleSheet || style.sheet).addRule(parentStyle + '.' + prClass, 'display:none!important;');
		else
			style.sheet.insertRule(parentStyle + '.' + prClass + ' { display:none!important; }', 0);
	}

	const { dealershipCodes: { cllc, fiat, ar } } = await API.utils.getDealerData();
	let dealerCode = cllc || fiat || ar;

	API.subscribe('vehicle-data-updated-v1', async ({ payload: { pageData } }) => {
		if (!(pageData.searchPage || pageData.detailPage)) return;
		if (dealerCode == '60359' && pageData.searchPage) return;
		//Deactivation of CTA
		if (dealerCode == '67920' || dealerCode == '66732') return;
		//Inwidget Button Invoke

API.insertOnce('vehicle-ctas', (elem, meta) => {
		fetch('https://e-shop.jeep.com/api/get_cta_config/' + dealerCode+'?vin='+meta.vin, {

			headers: {
				'Access-Control-Allow-Origin': '*'
			}
		}).then(response => {
			return response.json();
		}).then(cta_config => {
			
				try {
					if ((dealerCode === undefined) || (dealerCode == 'undefined'))
						dealerCode = meta.dealerCodes.cllc || meta.dealerCodes.fiat || meta.dealerCodes.ar;
				} catch (err) {
					console.log(err);
				}
				let imageUrl, imageText, imageStyle, imageStyleLocation = '', newApproachEnable,t3_new_inwidget,vehicle_type;
				const url = 'https://dealeradmin.drivefca.com/js/app-element.js'; 
				const wclass = 'inwidgetimage'; 
				  meta.address.postalCode  =   meta.address.postalCode.split('-')[0].trim();

				if (isValidVin(meta.vin) === false) return;
				vehicle_type =  meta.inventoryType;
				t3_new_inwidget =   cta_config?.t3_new_widget;
				t3_new_widget_secondary_cta_order = cta_config?.secondary_cta_order;
				var cta_data = {
					"reserveNowCTA": cta_config?.is_reservation_flag,
					"creditApplyCTA": cta_config?.is_credit_flag,
					"tradeInCTA": cta_config?.is_tradeIn_flag,
					"testDriveCTA": cta_config?.is_testDrive_flag,
					"reserveNowCTAImgUrl":  cta_config?.reserve_img_url,
					"creditApplyCTAImgUrl": cta_config?.creditapply_img_url,
					"tradeInCTAImgUrl": cta_config?.tradein_img_url,
					"testDriveCTAImgUrl": cta_config?.testdrive_img_url
				}
				
				if (cta_config != null && cta_config.button_image_url != '' && cta_config.button_image_url != null) {
					imageUrl = cta_config.button_image_url;
					imageText = cta_config.button_text;
					imageStyleLocation = imageStyle = 'cursor: pointer;display:show;width:100%;' + cta_config.image_style;
					inwidgetDealerType = cta_config.dealer_type;
					newApproachEnable = cta_config.new_approach_enable;
					
					if (window.DDC != undefined && window.DDC.dataLayer != undefined && window.DDC.dataLayer.page.pageInfo.isVdp) {
						imageUrl = cta_config.button_image_url_vdp;
						imageText = cta_config.button_text_vdp;
						imageStyleLocation = imageStyle = 'cursor: pointer;display:show;width:100%;' + cta_config.image_style_vdp;
						// buttonClass = cta_config.button_class_vdp;
					}
				}
				else {
					imageUrl = 'https://d1jougtdqdwy1v.cloudfront.net/inwidget/images/payment_option_red.svg';
					imageText = 'Payment options';
					imageStyle = 'cursor: pointer;display:show;width:100%';
					newApproachEnable = 'Y';
					imageStyleLocation = 'background-color: #d20f06;padding: 0;border-radius: 0;';
				} 
				if (isValidVin(meta.vin) === false) return;
				const app = document.createElement('app-root');
					app.setAttribute('vin', meta.vin);
					app.setAttribute('dealercode', dealerCode);
					app.setAttribute('zipcode', meta.address.postalCode);
					app.setAttribute('vehicle_type', meta.inventoryType);
					API.append(elem, app);
				 	createClass(wclass, dealerCode);
						API.insertCallToActionOnce('button', 'payment-calculator', meta => {
							return {
								href: 'javascript:void(0)',
								style: 'padding: 0;',
								classes: wclass,
								imgSrc: imageUrl,
								style: imageStyleLocation,
								imgAlt: {
									'en_US': imageText, // English
								},
								
								onclick: () => {
									invokePopup(meta.vin, dealerCode, meta.address.postalCode, url, wclass,'',t3_new_inwidget,meta.inventoryType);
								}
							}
						});
			const sortedEntries = Object.entries(t3_new_widget_secondary_cta_order).sort((a, b) => +a[1] - +b[1]);
						const keysOnly = sortedEntries.map(([key]) => key);				 
						var secondaryCTAListSorted = keysOnly;														
						secondaryCTAListSorted.forEach(value=>{
							switch(value){
								case 'take_a_test_drive':  
										if(cta_data.testDriveCTA == 'Y'){
											createClass(wclass, dealerCode);
											API.insertCallToActionOnce('button', 'test-drive', meta => {
												
												return {
													href: 'javascript:void(0)',
													style: 'padding: 0;',
													classes: wclass,
													imgSrc: cta_data.testDriveCTAImgUrl,
													style: imageStyleLocation,
													imgAlt: {
														'en_US': imageText, // English
													},
													
													onclick: () => {
														invokePopup(meta.vin, dealerCode, meta.address.postalCode, '', wclass,'','Y',meta.inventoryType,'testDrive');
													}
												}
											});
										}
										//loadCTA('testDrive',meta.vin,dealerCode,meta.address.postalCode,meta.inventoryType,wclass,cta_data.testDriveCTAImgUrl,imageStyleLocation,'Test Drive',elem);
									break;
								case 'estimate_trade-in': 
										if(cta_data.tradeInCTA == 'Y'){	

											createClass(wclass, dealerCode);
											API.insertCallToActionOnce('button', 'value-a-trade', meta => {
												
												return {
													href: 'javascript:void(0)',
													style: 'padding: 0;',
													classes: wclass,
													imgSrc:cta_data.tradeInCTAImgUrl,
													style: imageStyleLocation,
													imgAlt: {
														'en_US': imageText, // English
													},
													
													onclick: () => {
														invokePopup(meta.vin, dealerCode, meta.address.postalCode, '', wclass,'','Y',meta.inventoryType,'tradeIn');
													}
												}
											});
										}											
										//loadCTA('tradeIn',meta.vin,dealerCode,meta.address.postalCode,meta.inventoryType,wclass,cta_data.tradeInCTAImgUrl,imageStyleLocation,'Trade In',elem);
									break;
								case 'apply_for_credit': 
										if(cta_data.creditApplyCTA == 'Y'){		
											createClass(wclass, dealerCode);
											API.insertCallToActionOnce('button', 'request-a-quote', meta => {
												
												return {
													href: 'javascript:void(0)',
													style: 'padding: 0;',
													classes: wclass,
													imgSrc:cta_data.creditApplyCTAImgUrl,
													style: imageStyleLocation,
													imgAlt: {
														'en_US': imageText, // English
													},
													
													onclick: () => {
														invokePopup(meta.vin, dealerCode, meta.address.postalCode, '', wclass,'','Y',meta.inventoryType,'applyCredit');
													}
												}
											});
										}
									//loadCTA('applyCredit',meta.vin,dealerCode,meta.address.postalCode,meta.inventoryType,wclass,cta_data.creditApplyCTAImgUrl,imageStyleLocation,'Applr For Credit',elem);
									break;
								case 'reserve_now': 
										if(cta_data.reserveNowCTA == 'Y' && meta.inventoryType =='new'){
											createClass(wclass, dealerCode);
											API.insertCallToActionOnce('button', 'reserve-it-now', meta => {
												
												return {
													href: 'javascript:void(0)',
													style: 'padding: 0;',
													classes: wclass,
													imgSrc:cta_data.reserveNowCTAImgUrl,
													style: imageStyleLocation,
													imgAlt: {
														'en_US': imageText, // English
													},
													
													onclick: () => {
														invokePopup(meta.vin, dealerCode, meta.address.postalCode, '', wclass,'','Y',meta.inventoryType,'reserveNow');
													}
												}
											});
										}
									//loadCTA('reserveNow',meta.vin,dealerCode,meta.address.postalCode,meta.inventoryType,wclass,cta_data.reserveNowCTAImgUrl,imageStyleLocation,'Reserve Now',elem);
									break;
							}

						})
				
			});
		});

		// Checking DDC flag to takeover eprice
		if (config.disableEpriceTakeover === true) return;
		// checking dom for eprice button availability
		if (document.querySelector('html:is(.srp, .vdp) [data-location="vehicle-eprice-button"]') == null) return;

		//Eprice Button Invoke

		fetch('https://e-shop.jeep.com/api/get_eprice_cta_config/' + dealerCode, {

			headers: {
				'Access-Control-Allow-Origin': '*'
			}
		}).then(response => {
			return response.json();
		}).then(cta_config => {
			API.insertOnce('vehicle-ctas', (elem, meta) => {
				let imageUrl, imageText, imageStyle, buttonClass;
				const url = 'https://dealeradmin.drivefca.com/js/app-eprice-element.js';
				const wclass = 'eshop-eprice';
				if (cta_config != null && cta_config.button_image_url != '' && cta_config.button_image_url != null) {
					buttonClass = cta_config.button_class;
					imageUrl = cta_config.button_image_url;
					imageText = cta_config.button_text;
					imageStyle = 'cursor: pointer;display:show;width:100%;' + cta_config.image_style;
				} else {
					buttonClass = 'default';
					imageUrl = 'https://d1jougtdqdwy1v.cloudfront.net/inwidget/images/fca-button.svg';
					imageText = 'E-Price';
					imageStyle = 'cursor: pointer;display:show;width:100%';
				}

				let inventoryType = '';
				try {
					if (meta.inventoryType == 'new'){
					t3_new_inwidget =   cta_config?.t3_new_widget;
						inventoryType = 'new';}
				} catch (err) { console.log(err); }
				if (isValidVin(meta.vin) === false) return;
				if (inventoryType == 'new' && cta_config.is_enable == 'Y') {
					const app = document.createElement('app-eprice');
					app.setAttribute('vin', meta.vin);
					app.setAttribute('dealercode', dealerCode);
					app.setAttribute('zipcode', meta.address.postalCode);
					API.append(elem, app);
					if (cta_config.cta_type == 'text') {
						API.insertCallToActionOnce('button', 'eprice', meta => {
							return {
								type: cta_config.button_class,
								text: {
									en_US: cta_config.button_text,
								},
								classes: wclass,
								style: cta_config.image_style,
								target: '_self',
								onclick: () => {
									invokePopup(meta.vin, dealerCode, meta.address.postalCode, url, wclass, 'text',t3_new_inwidget,inventoryType);
								}
							}
						});
					} else {
						createClass(wclass, dealerCode);
						API.insertCallToActionOnce('button', 'eprice', meta => {
							return {
								href: 'javascript:void(0)',
								style: 'padding: 0;',
								classes: wclass,
								imgSrc: imageUrl,
								target: '_self',
								imgAlt: {
									'en_US': imageText, // English
								},
								onclick: () => {
									invokePopup(meta.vin, dealerCode, meta.address.postalCode, url, wclass, 'image',t3_new_inwidget,inventoryType);
								}
							}
						});
					}
				}
			});
		});
	});
})(window.DDC.APILoader); 
