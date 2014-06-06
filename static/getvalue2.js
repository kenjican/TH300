var xmlhttp;
if (window.XMLHttpRequest)
  {
    xmlhttp = new XMLHttpRequest();
  }
else
  {
    xmlhttp =new ActiveXObject("Microsoft.XMLHTTP");
  }



function getvalue()
  {  
    xmlhttp.open("GET","/getv",true);
    xmlhttp.send();
  }  

xmlhttp.onreadystatechange = function()
  {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
      {
        var v = xmlhttp.responseText;
        document.getElementById("TSV").innerHTML = Math.ceil((parseInt(v.slice(6,10),16)/100-100)*100)/100;
        document.getElementById("TPV").innerHTML = (parseInt(v.slice(10,14),16)/100-100).toFixed(2);
        document.getElementById("TMV").innerHTML = parseInt(v.slice(14,18),16)/100;
        document.getElementById("HSV").innerHTML = parseInt(v.slice(18,22),16)/10;
        document.getElementById("HPV").innerHTML = parseInt(v.slice(22,26),16)/10;
        document.getElementById("HMV").innerHTML = parseInt(v.slice(26,30),16)/100;
      }
  }



setInterval(function(){getvalue()},1000);
