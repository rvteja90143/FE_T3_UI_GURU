if(dealer_button != null)
{
  var dealer_button = document.getElementById("dealercode_gtag").value;
}

function gtag_report_conversion_inwidget(url,message) {
 
  var callback = function () {
   
    if (typeof(url) != 'undefined') {
      //window.location = url;
    }
  };
  
    gtag('event', 'conversion', {
      'send_to': message,
     'event_callback': callback
  });
  
  return false;
}

if(dealer_button == '27336')
{
gtag_report_conversion_inwidget(window.location ['href'],'AW-11410609543/MkTKCOLRq_gYEIergMEq');
}

/* Shift Digital Session ID */

function myTaggingFunction(sessionId) {
  if(this.sessionId != null && document.getElementById("shift_sessionid").value != null){
  document.getElementById("shift_sessionid").value = sessionId;
  }  
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function get_sdsessionid() {
  for (let i = 0; i < 3; i++) {
    let x = document.getElementById("shift_sessionid").value;
    console.log("x",x);
    if(x === undefined || x === null || x === ''){
      window.sd('getSessionId', myTaggingFunction);
      await sleep(i * 1000);
    }
    else{
      break;
    }
  }
 
}