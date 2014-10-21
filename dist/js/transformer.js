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
    //IE
    if (window.ActiveXObject){
        xmlString = xmlData.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else{
        xmlString = (new XMLSerializer()).serializeToString(xmlData);
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
    $(e).wrap( "<a href='" + $(e).attr('url') + "'></a>" );
  });


  //  THIS IS A CUSTOM TAG
  $xml.find("lingolist").wrap( "<table class='lingolist'></table>" );
  $xml.find("entry").wrap( "<tr></tr>" );
  $xml.find("term").wrap( "<td></td>" );
  $xml.find("definition").wrap( "<td></td>" );



  // THIS IS THE ERROR XML
  $xml.find("anetApiMessages").wrap( "<table class='lingolist' id='errorCodeTable'></table>" );
  $xml.find("message").wrap( "<tr></tr>" );
  $xml.find("code").wrap( "<td></td>" );
  $xml.find("text").wrap( "<td></td>" );
  $xml.find("description").wrap( "<td></td>" );


  $("#Content").append(xmlToString(xmlDoc));
}


// RUN ALL THE ABOVE CODE FOR EACH XML FILE
produceXMLtoHTML("dist/xml/oneTimeTransaction.xml");
produceXMLtoHTML("dist/xml/automatedRecurringBilling.xml");
produceXMLtoHTML("dist/xml/customerProfiles.xml");
produceXMLtoHTML("dist/xml/PayPal.xml");

produceXMLtoHTML("dist/xml/AnetApiMessages.xml");

// ADD A TITLE BAR TO THE ERROR TABLE 
$("#errorCodeTable").prepend("<tr><th><i>CODE</i></th><th><i>TEXT</i></th><th><i>DESCRIPTION</i></th></tr>");
