
$(".showJsonAuth").each(function() {
    $(this).on("click",function(){
		codeEditorsID['authentication-sample-Code'].setValue($("#authentication-sample-Code-Json").val())
		codeEditorsID['authentication-sample-Code'].setOption("mode", "javascript");
		codeEditorsID['authentication-sample-Code'].setOption("json", "true");
		codeEditorsID['authentication-sample-Code'].setOption("lineNumbers", "true");
		codeEditorsID['authentication-sample-Code'].refresh();

		$(this).next().addClass("btn-primary");
        $(this).removeClass("btn-primary");
    });
});

$(".showXmlAuth").each(function() {
    $(this).on("click",function(){
		codeEditorsID['authentication-sample-Code'].setValue($("#authentication-sample-Code-Xml").val())
		codeEditorsID['authentication-sample-Code'].setOption("mode", "xml");
		codeEditorsID['authentication-sample-Code'].setOption("lineNumbers", "true");
		codeEditorsID['authentication-sample-Code'].refresh();

		$(this).prev().addClass("btn-primary");
        $(this).removeClass("btn-primary");
    });
});

var $showJSONAPI = $(".showJSONAPI"),
    $showXMLAPI = $(".showXMLAPI"),
    $sampleRequest = $(".sample-request"),
    $jsonBgDanger = $(".bg-danger").not(".ie9msg, .required");


$showJSONAPI.on("click",function(){

  if(!$sampleRequest.data("isJSON")){

    $showJSONAPI.each(function() {
      var genericId = $(this).attr("textareaid");
      populateCodeMirrorWithJson(genericId);
    });
    
    $sampleRequest.data("isJSON", true);  
    $jsonBgDanger.show();
    $showJSONAPI.removeClass("btn-primary");
    $showXMLAPI.addClass("btn-primary");

  }

});

$showXMLAPI.on("click",function(){

  if($sampleRequest.data("isJSON")){

    $showXMLAPI.each(function() {
      var genericId = $(this).attr("textareaid");
      populateCodeMirrorWithXml(genericId);
    });
    
    $sampleRequest.data("isJSON", false);  
    $jsonBgDanger.hide();
    $showJSONAPI.addClass("btn-primary");
    $showXMLAPI.removeClass("btn-primary");

  }

});

function populateCodeMirrorWithJson(id) {

    genericId = id;
	
   if(loginid==null || transactionkey==null ){
		codeEditorsID["txtReqXml-"+genericId].setValue($("#txtReqJsn-"+genericId).val());
   }
   else{
		codeEditorsID["txtReqXml-"+genericId].setValue($("#txtReqJsn-"+genericId).val().replace("API_LOGIN_ID",loginid).replace("API_TRANSACTION_KEY",transactionkey));
   }
   codeEditorsID["txtReqXml-"+genericId].setOption("mode", "javascript");
   codeEditorsID["txtReqXml-"+genericId].setOption("json", "true");
   codeEditorsID["txtReqXml-"+genericId].refresh();
   
   codeEditorsID["txtRespXml-"+genericId].setValue($("#txtRespJsn-"+genericId).val());
   codeEditorsID["txtRespXml-"+genericId].setOption("mode", "javascript");
   codeEditorsID["txtRespXml-"+genericId].setOption("json", "true");
   codeEditorsID["txtRespXml-"+genericId].refresh();
}

function populateCodeMirrorWithXml(id) {

   genericId = id;
   if(loginid==null || transactionkey==null ){
   codeEditorsID["txtReqXml-"+genericId].setValue($("#txtReqXml-"+genericId).val());
   }
   else{
   codeEditorsID["txtReqXml-"+genericId].setValue($("#txtReqXml-"+genericId).val().replace("API_LOGIN_ID",loginid).replace("API_TRANSACTION_KEY",transactionkey));

   }
   codeEditorsID["txtReqXml-"+genericId].setOption("mode", "xml");
   codeEditorsID["txtReqXml-"+genericId].setOption("lineNumbers", "true");
   codeEditorsID["txtReqXml-"+genericId].refresh();
   
   codeEditorsID["txtRespXml-"+genericId].setValue($("#txtRespXml-"+genericId).val());
   codeEditorsID["txtRespXml-"+genericId].setOption("mode", "xml");
   codeEditorsID["txtRespXml-"+genericId].setOption("lineNumbers", "true");
   codeEditorsID["txtRespXml-"+genericId].refresh();
   
}
