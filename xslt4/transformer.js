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


var xmlDoc=loadXMLDoc("DocBooksXML/" + PageName);
var xml = xmlToString(xmlDoc);

// LOAD THE XML INTO THE JQUERY XML PARSER
xmlDoc = $.parseXML(xml),
$xml = $(xmlDoc),

// WE CAN USE CSS FOR ALMOST ALL THE FORMATTING, BUT WE DO NEED THE BUILT IN PROPERTIES OF <ul> and <a> TAGS, 
// SO WRAP THE APPROPRIATE NODES WITH THOSE TAGS
$xml.find("itemizedList").wrap( "<ul></ul>" );
$xml.find("listItem").wrap( "<li></li>" );

$xml.find("ulink").each(function (i,e){
  $(e).wrap( "<a href='" + $(e).attr('url') + "'></a>" );
});



$xml.find("lingolist").wrap( "<table class='lingolist'></table>" );
$xml.find("entry").wrap( "<tr></tr>" );
$xml.find("term").wrap( "<td></td>" );
$xml.find("definition").wrap( "<td></td>" );


// WRITE THE XML STRING TO THE PAGE 
document.write(xmlToString(xmlDoc));
