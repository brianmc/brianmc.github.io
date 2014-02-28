var requestEditor, responseEditor, codeEditorsID=[];

$(document).ready(function() {

  $(".authenticationDiv").hide();
  $("#feedbackLinkID").click(function (e) {
      $(".popup").show();
  });

 $(".popup").click(function (e) {
      $(".popup").hide();
  });
 $('.feedback').click(function(){
    return false;
  });

  $('.close').click(function(){
    $(".popup").hide();
  });

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
  });

	
});


function redrawEditors(id) {
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
function btnSend_onclick(id) { 
  genericId = id.substring(7,id.length);

  /*if(codeEditorsID["txtReqXml"+genericId].getValue().indexOf("API_LOGIN_ID")>-1){
    
    $("#auth"+genericId).show('slow')  ;
    return;
  }   */
  document.getElementById(id).disabled = true;
  
 
  
  console.log(id);
  document.getElementById("txtRespXml"+genericId).innerHTML = "";
  document.getElementById("spnStatusCode"+genericId).innerHTML = "";
  
  var fnWhenDone = function (oXML) {
      if (oXML.status && oXML.status != "200") {
        document.getElementById("spnStatusCode"+genericId).innerHTML = "HTTP status code: " + oXML.status.toString().replace(/</g, "&lt;");
      }
      var txt = oXML.responseText;
      txt = txt.replace(/></g, "> <");
      codeEditorsID["txtRespXml"+genericId].setValue(txt);
      reFormatCodeMirror("txtRespXml"+genericId);
      document.getElementById("btnSend"+genericId).disabled = false;
  };
  g_xc.connect("https://qaaqucp1d.vposdownload.qa.intra/xml/v1/request.api",codeEditorsID["txtReqXml"+genericId].getValue() , fnWhenDone);
}

function reFormatCodeMirror(id){
    var totalLines = codeEditorsID[id].lineCount();
    var totalChars = codeEditorsID[id].getTextArea().value.length;
    codeEditorsID[id].autoFormatRange({line:0, ch:0}, {line:totalLines, ch:totalChars});
    CodeMirror.commands['goPageUp'](codeEditorsID[id]);
    $("#"+id).trigger({type: 'keypress', which: 13});
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
	$(".authenticationDiv").hide("slow");
	return false;
}

function selUrls_onChange(obj) {
  if (document.getElementById("selUrls").value) {
    document.getElementById("txtUrl").value = document.getElementById("selUrls").value;
  }
}