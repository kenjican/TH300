var xmlhttp;
var IS = 0;
var TS = 0;
if (window.XMLHttpRequest)
  {
    xmlhttp = new XMLHttpRequest();
    xmlhttpC = new XMLHttpRequest();
  }
else
  {
    xmlhttp =new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttpC = new ActiveXObject("Microsoft.XMLHTTP");
  }

function InnerSignal()
{
   var SMS;
   var ISbin;
   SMS = "http://192.168.0.3:9090/sendsms?phone=13013786354&text=";
   ISbin = IS.toString(2);
   ISbin = '00000000'.slice(0,8-ISbin.length) + ISbin;
   for (i = 8; i >= 0  ;i--)
   {
     if (ISbin[i] == 1)
     {
       $("#IS")[0].cells[8-i].style.backgroundColor="red";
       SMS = SMS + "警報" + (8-i)+ "On,";

     }
        else
     {
       $("#IS")[0].cells[8-i].style.backgroundColor="white";
     }  
   }
   $.get(SMS);
}


function TimeSignal()
{
   var SMS;
   var TSbin;

   SMS = "http://192.168.0.3:9090/sendsms?phone=13013786354&text="
   TSbin = TS.toString(2);
   TSbin = '00000000'.slice(0,8-TSbin.length) + TSbin;
   for (i = 7; i >= 0  ;i--)
   {
     if (TSbin[i] == 1)
     {
       $("#TS")[0].cells[7-i].style.backgroundColor="red";
       SMS = SMS + "警報" + i + "On,"
     }
        else
     {
       $("#TS")[0].cells[7-i].style.backgroundColor="white";
     }  
   }
   

}




function SendSMS(is)
{
   var SMS ='http://192.168.0.182:9090/sendsms?phone=13013785934&text=';
   IS = is;
   ISbin = IS.toString(2);
   ISbin = '00000000'.slice(0,8-ISbin.length) + ISbin;
   for (i = 7; i >= 0  ;i--)
   {
      if (ISbin[i] == 1)
      {
         $("#IS")[0].cells[8-i].style.backgroundColor="red";
         SMS = SMS + "警報" + i + "ON,"; 
      }
      else
      {
         SMS = SMS + "警報" + i + "Off,"; 
      }  
   }
//       $.get(SMS);
}



function getvalue()
  {  
    xmlhttp.open("GET","/getva",true);
    xmlhttp.responseType = "arraybuffer";
    xmlhttp.send();
  }  

function run()
  {
    xmlhttpC.open("GET","/run",true);
    xmlhttpC.responseType = "arraybuffer";
    xmlhttpC.send();
  }

function stop()
  {
    xmlhttpC.open("GET","/stop",true);
    xmlhttpC.responseType = "arraybuffer";
    xmlhttpC.send();
  }

xmlhttp.onreadystatechange = function()
  {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
      {
        var v = new DataView(xmlhttp.response);
        $("#TPV").html((v.getUint16(5,false)/100-100).toFixed(2));
        $("#TSV").html((v.getUint16(3,false)/100-100).toFixed(2));
        $("#TMV").html((v.getUint16(7,false)/100).toFixed(2));
        $("#HSV").html((v.getUint16(9,false)/10).toFixed(1));
        $("#HPV").html((v.getUint16(11,false)/10).toFixed(1));
        $("#HMV").html((v.getUint16(13,false)/100).toFixed(2));
        if (IS != v.getUint8(16,false))
        { 
          IS = v.getUint8(16,false);
          InnerSignal();
        }
        if (TS != v.getUint8(18,false))
        {
          TS = v.getUint8(18,false);
          TimeSignal();
        }        
      }
  }

//getvalue();

setInterval(function(){getvalue()},1000);
