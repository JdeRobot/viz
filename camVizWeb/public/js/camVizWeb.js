var config={};
var camera;
//avoid browser error
try {
  if (!localStorage.getItem("cameraviewconfig")){
  	const yaml = require('js-yaml');
  	const fs = require('fs');
  	config = yaml.safeLoad(fs.readFileSync('public/config.yml', 'utf8'));
	localStorage["cameraviewconfig"]=JSON.stringify(config);
  } else {
	config = JSON.parse(localStorage.getItem("cameraviewconfig"));
  }
} catch(e){
  config.serv = {};
  config.serv.dir= $('#dir').val();
  config.serv.port= $('#port').val();
  config.serv.tech = $('#serv').val();
  config.epname = $('#ep').val();
  localStorage["cameraviewconfig"]=JSON.stringify(config);
  console.log(e);
}


$(document).ready(function() {
  //Load configure parametres
   load();
   config.camid= "camView";
   config.fpsid= "fps";
   config.sizeid= "size";
   var server = config.serv.tech;
   if (server == "Ice"){
     camera = new CameraViewIce(config);
   //In case of Ros, called at CameraView class for Ros
   } else if (server == "Ros"){
     camera = new CameraViewRos(config);
     camera.connect();
   }else {
     console.log("Error, not server name")
   }
   $('#start').on('click', function(){
      $("#camView").removeClass("border-light");
      //In case of Ice, called at CameraView class for Ice
      //Start camera
         camera.start();
	});
  //Stop camera
   $('#stop').on('click', function(){
         camera.stop();
	});

   var resize = function (){
      $(".cam").height( $(".cam").width()*3/4);
   };

   $(window).resize(function(){
      resize();
   });

   $('#save').on('click', function(){
    config.serv.dir= $('#dir').val();
    config.serv.port= $('#port').val();
    config.serv.tech = $('#serv').val();
    server = $('#serv').val();
    if ($('#serv').val() == "Ice") {
      config.epname = $('#ep').val();
    } else if ($('#serv').val() == "Ros"){
      config.topic = $('#topic').val();
      config.msgs = $('#messageType').val();
    }
    localStorage["cameraviewconfig"]=JSON.stringify(config);
    location.reload();
   });

   $('#DfIce').on('click',function(){
     dfIce();
   });

   $('#DfRos').on('click',function(){
     dfRos();
   });

   resize();
});

function load(){
          $('#serv').val(config.serv.tech);
          $('#dir').val(config.serv.dir);
          $('#port').val(config.serv.port);
          if (config.serv.tech == "Ice") {
            dfIce();
          } else if (config.serv.tech == "Ros"){
            dfRos();
   }
}

function dfIce(){
  if ($('#ep').length == 0){
    $('#rostopic').remove();
    $("#confignav").append('<div id = "endpoint" class="input-group">'+
       '<span class="input-group-addon" id="basic-addon1">EndPoint</span>'+
       '<input id="ep" type="text" class="form-control" value="cameraA" aria-describedby="basic-addon1">'+
    '</div>')
    }
    $('#serv').val("Ice");
    $('#ep').val(config.endpoint);
}

function dfRos(){
  if ($('#rostopic').length == 0){
  $("#endpoint").remove();
  $("#confignav").append('<div id = "rostopic"><div class="input-group"><span class="input-group-addon" id="basic-addon1">RosTopic</span>'+
  '<input id="topic" type="text" class="form-control" value="/usb_cam/image_raw/compressed" aria-describedby="basic-addon1"></div>'
  +'<br><div class="input-group"><span class="input-group-addon" id="basic-addon1">RosMessageType</span>'+
  '<input id="messageType" type="text" class="form-control" value="sensor_msgs/CompressedImage" aria-describedby="basic-addon1"></div></div>')
}
$('#serv').val("Ros");
$('#topic').val(config.topic);
$('#messageType').val(config.msgs);
}
