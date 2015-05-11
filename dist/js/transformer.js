function loadXMLDoc(filename)
{
if (window.XMLHttpRequest)
  {
  xhttp=new XMLHttpRequest();
  }
else // code for IE5 and IE6
  {
  xhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xhttp.open("GET",filename,false);
xhttp.send();
return xhttp.responseXML;
}


function xmlToString(xmlData) { 

    var xmlString;

    // if IE > 9, Mozilla, Chrome
    if (typeof XMLSerializer == 'function')
    {

      var serializer = new XMLSerializer();
      // IE 9 || IE > 10, Mozilla, Chrome
      xmlString = xmlData.xml || serializer.serializeToString(xmlData);

    } else {
      // IE <= 8
      if (window.ActiveXObject){
        xmlString = xmlData.xml;
      }
      // code for Opera - somehow Opera fall under window.ActiveXObject
      else{
          xmlString = (new XMLSerializer()).serializeToString(xmlData);
      }
    }
    return xmlString;
}   


// the way the whole thing works is we get the XML as a string via a url, append it to an element in the page, 
// and use CSS on the XML to make it look good.  We can alter the xml if need be.  

function produceXMLtoHTML(XMLFile){
  var xmlDoc=loadXMLDoc(XMLFile);
  var xml = xmlToString(xmlDoc);

  // THE ERROR XML NEEDS A PARENT NODE.  YOU CANT DO A WRAP ON THE ROOT NODE.
  xml = xml.replace("<anetApiMessages>", "<justanode><anetApiMessages>");
  xml = xml.replace("</anetApiMessages>", "</anetApiMessages></justanode>");

  xml = xml.replace("<picture","<img");
  xml = xml.replace("</picture>","</img>");
	
  // LOAD THE XML INTO THE JQUERY XML PARSER
  xmlDoc = $.parseXML(xml),
  $xml = $(xmlDoc),

  // WE CAN USE CSS FOR ALMOST ALL THE FORMATTING, BUT WE DO NEED THE BUILT IN PROPERTIES OF <ul> and <a> TAGS, 
  // SO WRAP THE APPROPRIATE NODES WITH THOSE TAGS
  $xml.find("itemizedList").wrap( "<ul></ul>" );
  $xml.find("listItem").wrap( "<li></li>" );

  $xml.find("orderedlist").wrap( "<ol></ol>" );
  $xml.find("listitem").wrap( "<li></li>" ); 

  $xml.find("ulink").each(function (i,e){
    var $e = $(e);
    $e.wrap( $('<a/>').attr('href', $e.attr('url')) );
  });


  //  THIS IS A CUSTOM TAG
  $xml.find("lingolist").wrap( "<table class='lingolist'></table>" );
  $xml.find("entry").wrap( "<tr></tr>" );
  $xml.find("term").wrap( "<td></td>" );
  $xml.find("definition").wrap( "<td></td>" );


  // THIS IS THE ERROR XML  
  var x = $xml.find("message");
  if(x) {

    var errorResponseTable = $("<table/>").addClass("lingolist").attr("id", "errorCodeTable");
    errorResponseTable.append("<tr><th><i>CODE</i></th><th><i>TEXT</i></th><th><i>DESCRIPTION</i></th></tr>");

    for ( i=0; i < x.length; i++){ 
      errorResponseTable.append("<tr><td>" + x[i].getElementsByTagName("code")[0].childNodes[0].nodeValue + "</td><td>" + x[i].getElementsByTagName("text")[0].childNodes[0].nodeValue + "</td><td>" + x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue + "</td></tr>");
    };

    $xml.find(".marginTopBottomThirtyPixels").after(errorResponseTable);
    $xml.find('message').remove();  
  };

  $("#Content").append(xmlToString(xmlDoc));
}


// RUN ALL THE ABOVE CODE FOR EACH XML FILE
produceXMLtoHTML("dist/xml/oneTimeTransaction.xml");
produceXMLtoHTML("dist/xml/AutomatedRecurringBilling.xml");
produceXMLtoHTML("dist/xml/customerProfiles.xml");
produceXMLtoHTML("dist/xml/PayPal.xml");

produceXMLtoHTML("dist/xml/AnetApiMessages.xml");