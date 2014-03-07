var requestEditor, responseEditor, codeEditorsID=[],transactionkey,loginid;
//var sURL = "https://qaaqucp1d.vposdownload.qa.intra/xml/v1/request.api";
var sURL = "https://apitest.authorize.net/xml/v1/request.api";



$(document).ready(function() {

  initAPI();

	
});

function initAPI(){
  $(".authenticationDiv").hide();
  $("textarea").each(function(ind, ele){
    var id = $(ele).attr('id');
    codeEditorsID[id] =  CodeMirror.fromTextArea(document.getElementById(id), { mode: 'xml',lineNumbers: true});
  });
  $('a').click(function(event){ 
    if($(event.currentTarget).html()==="Try it")
    {
      var id = this.id.toString();
      id = id.substring(0,id.length-5);
       setTimeout(function() {  redrawEditors('txtReqXml-'+id); redrawEditors('txtRespXml-'+id) }, 250);
    } 
  });

 
  $('button').click(function(event){ 
    if($(event.currentTarget).attr('name')==="btnSend")
    {
      
      btnSend_onclick(this.id);
    } 
     if($(event.currentTarget).attr('name')==="btnReset")
    {
      
      btnReset_onclick(this.id);
    }

  });

    initializelightBox();
}

function initializelightBox(){
    var fsLightbox1687734 = new FSLightbox({form: 1687734,handle: "feedbackLinkID" });

}


function redrawEditors(id) {
  codeEditorsID[id].refresh();
}




function XHConn()
{
  var xmlhttp, bComplete = false;
  var method = "POST";
  try { xmlhttp = new ActiveXObject("Msxml2.XMLHTTP"); }
  catch (e) { try { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); }
  catch (e) { try { xmlhttp = new XMLHttpRequest();}
  catch (e) { xmlhttp = false; }}}
  if (!xmlhttp) return null;

  this.connect = function( sPostData, fnDone)
  { 
    

    try {
      
      bComplete = false;
       if ("withCredentials" in xmlhttp) {
          // XHR for Chrome/Firefox/Opera/Safari.
          xmlhttp.open(method, sURL, true);
        } else if (typeof XDomainRequest != "undefined") {
          // XDomainRequest for IE.
          xmlhttp = new XDomainRequest();
          xmlhttp.open(method, sURL);
        } else {
          return false;
        }
      
      xmlhttp.setRequestHeader("method", "POST "+sURL+" HTTP/1.1");
      xmlhttp.setRequestHeader("content-type", "text/xml");
      xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && !bComplete)
        {
          bComplete = true;
          fnDone(xmlhttp);
        }
      };
      xmlhttp.send(sPostData);
    }
    catch(z) {
      alert(z);
      return false;
    }
    return true;
  };
  return this;
}

var g_xc = new XHConn();
var genericId;
function btnSend_onclick(id) { 
  genericId = id.substring(7,id.length);
 
  if(codeEditorsID["txtReqXml"+genericId].getValue().indexOf("API_LOGIN_ID")>-1){
    $("#auth"+genericId).show('slow')  ;
    return;
  }

  $("#txtRespLoader"+genericId).show();   
  document.getElementById(id).disabled = true;
  
  codeEditorsID["txtRespXml"+genericId].setValue("");
  document.getElementById("spnStatusCode"+genericId).innerHTML = "";
  
  var fnWhenDone = function (oXML) {
       $("#txtRespLoader"+genericId).hide();
      if (oXML.status && oXML.status != "200") {
        document.getElementById("spnStatusCode"+genericId).innerHTML = "HTTP status code: " + oXML.status.toString().replace(/</g, "&lt;");
      }
       if(oXML.responseText.indexOf("Error")>-1){
          var errorTxt = oXML.responseText.split("text>");
          $("#spnStatusCode"+genericId).text(errorTxt[1].substring(0,errorTxt[1].length-2));
          $("#spnStatusCode"+genericId).show(200);
        }
        else{
          $("#spnStatusCode"+genericId).text('');
        }
      var txt = oXML.responseText;
      txt = txt.replace(/></g, "> <");
      codeEditorsID["txtRespXml"+genericId].setValue(txt);
      reFormatCodeMirror("txtRespXml"+genericId);
      document.getElementById("btnSend"+genericId).disabled = false;
  };
  g_xc.connect(codeEditorsID["txtReqXml"+genericId].getValue() , fnWhenDone);
}

function btnReset_onclick(id){
   genericId = id.substring(8,id.length);
   codeEditorsID["txtRespXml"+genericId].setValue($("#txtRespXml"+genericId).val());
   codeEditorsID["txtRespXml"+genericId].refresh();
   $("#spnStatusCode"+genericId).hide('easeIn', function(){
     $("#spnStatusCode"+genericId).text('');
   })
   
  
}

function reFormatCodeMirror(id){
    var totalLines = codeEditorsID[id].lineCount();
    var totalChars = codeEditorsID[id].getTextArea().value.length;
    codeEditorsID[id].autoFormatRange({line:0, ch:0}, {line:totalLines, ch:totalChars});
    CodeMirror.commands['goPageUp'](codeEditorsID[id]);
    $("#"+id).trigger({type: 'keypress', which: 13});
}

function btnPopulateKeys_onclick(object) {
   var id = object.id.split("populateKeyForm-")[1];
   loginid = document.getElementById("txtLoginID-"+id).value;                                 
   transactionkey = document.getElementById("txtTransactionKey-"+id).value;
   var allSamples = document.getElementsByClassName("sample-request");
   for (var i = 0; i < allSamples.length; i++) {
    	var sampleRequest = codeEditorsID[allSamples[i].id];
    	sampleRequest.setValue(sampleRequest.getValue().replace("API_LOGIN_ID",loginid).replace("API_TRANSACTION_KEY",transactionkey));
    	sampleRequest.refresh();
  	}
   $(object).find(".btn-primary").attr("disabled","disabled");
   $(".authenticationDiv").hide("slow");
	 return false;
}

function selUrls_onChange(obj) {
  if (document.getElementById("selUrls").value) {
    document.getElementById("txtUrl").value = document.getElementById("selUrls").value;
  }
}