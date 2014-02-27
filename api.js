var requestEditor, responseEditor, codeEditorsID=[];
//var id;

$(document).ready(function() {

  $("textarea").each(function(ind, ele){
    var id = $(ele).attr('id');
    codeEditorsID[id] =  CodeMirror.fromTextArea(document.getElementById(id), { mode: 'xml',lineNumbers: true});

    //codeEditorsID[id].setLine(1,"<?xml version='1.0' encoding='utf-8'?>");
  });

/*	 requestEditor = CodeMirror.fromTextArea(document.getElementById('txtReqXml-create-a-subscription'), {
    mode: 'xml',
    lineNumbers: true
  });

  responseEditor = CodeMirror.fromTextArea(document.getElementById('txtRespXml-create-a-subscription'), {
    mode: 'xml',
    lineNumbers: true
  });*/

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
     // id = this.id
      btnSend_onclick(this.id);
    } 
  });

	
});


function redrawEditors(id) {
	//requestEditor.refresh();
	//responseEditor.refresh();
  codeEditorsID[id].refresh();
  

}

function XHConn()
{
  var xmlhttp, bComplete = false;
  try { xmlhttp = new ActiveXObject("Msxml2.XMLHTTP"); }
  catch (e) { try { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); }
  catch (e) { try { xmlhttp = new XMLHttpRequest(); }
  catch (e) { xmlhttp = false; }}}
  if (!xmlhttp) return null;

  this.connect = function(sURL, sPostData, fnDone)
  {
    if (!xmlhttp) return false;
    bComplete = false;

    try {
      xmlhttp.open("POST", sURL, true);
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
function btnSend_onclick(id) {     //txtReqXml-create-a-transaction //btnSend-create-a-transaction//txtRespXml-create-a-transaction

  document.getElementById(id).disabled = true;
  
  genericId = id.substring(7,id.length);
  
  console.log(id);
  document.getElementById("txtRespXml"+genericId).innerHTML = "";
  document.getElementById("spnStatusCode"+genericId).innerHTML = "";
  
  var fnWhenDone = function (oXML) {
      if (oXML.status && oXML.status != "200") {
        document.getElementById("spnStatusCode"+genericId).innerHTML = "HTTP status code: " + oXML.status.toString().replace(/</g, "&lt;");
      }
      var txt = oXML.responseText;
      txt = txt.replace(/></g, "> <");
     // txt = txt.replace(/</g, "&lt;");
     // txt = txt.replace(/>/g, "&gt;");
      codeEditorsID["txtRespXml"+genericId].setValue(txt);
     // document.getElementById("txtRespXml"+genericId).innerHTML = txt;
      document.getElementById("btnSend"+genericId).disabled = false;
      /*codeEditorsID['txtRespXml-'+genericId] = CodeMirror.fromTextArea(document.getElementById('txtRespXml'+genericId), {
      mode: 'xml',
      lineNumbers: true
    });*/
    setTimeout(function() { redrawEditors('txtRespXml'+genericId) }, 250);
  };//$("#txtReqXml"+genericId).val()
  g_xc.connect("https://qaaqucp1d.vposdownload.qa.intra/xml/v1/request.api",codeEditorsID["txtReqXml"+genericId].getValue() , fnWhenDone);
}

function btnPopulateKeys_onclick() {

 var loginid = document.getElementById("txtLoginID").value;                                 
                                                                                            
 var transactionkey = document.getElementById("txtTransactionKey").value;
 
 var allSamples = document.getElementsByClassName("sample-request");
 
 for (var i = 0; i < allSamples.length; i++) {
    
	var sampleRequest = codeEditorsID[allSamples[i].id];
	sampleRequest.setValue(sampleRequest.getValue().replace("API_LOGIN_ID",loginid).replace("API_TRANSACTION_KEY",transactionkey));
	sampleRequest.refresh();
	}
	
	return false;
}


function selUrls_onChange(obj) {
  if (document.getElementById("selUrls").value) {
    document.getElementById("txtUrl").value = document.getElementById("selUrls").value;
  }
}