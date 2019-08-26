var config={};
try {
  if (!localStorage.getItem("turtlebotviewer")) {
    const yaml = require('js-yaml');
    const fs = require('fs');
    config = yaml.safeLoad(fs.readFileSync('public/config.yml', 'utf8'));
    localStorage["turtlebotviewer"]=JSON.stringify(config);
  }
  } catch(e){
    console.log(e);
}

function dfIce(){
  $('#serverType').val("Ice");
  $('#epcaml').text("EndPoint");
  $('#epcamr').text("EndPoint");
  $('#eppose3d1').text("EndPoint");
  $('#eplaser1').text("EndPoint");
  $('#epmotors1').text("EndPoint");
  $('#epcam1').val(config.camleftepname);
  $('#epcam2').val(config.camrightepname);
  $('#eppose3d').val(config.pose3depname);
  $('#eplaser').val(config.laserepname);
  $('#epmotors').val(config.motorsepname);
}

function dfRos(){
  $('#serverType').val("Ros");
  $('#epcaml').text("Topic");
  $('#epcamr').text("Topic");
  $('#eppose3d1').text("Topic");
  $('#eplaser1').text("Topic");
  $('#epmotors1').text("Topic");
  $('#epcam1').val(config.camlefttopic);
  $('#epcam2').val(config.camrighttopic);
  $('#eppose3d').val(config.pose3dtopic);
  $('#eplaser').val(config.lasertopic);
  $('#epmotors').val(config.motorstopic);
}

$(document).ready(function() {

   var viewer;
   load();
   config.controlid="control";
   config.camrightid="camView2";
   config.camleftid="camView";
   config.modelid="model";
   config.stopbtnid="stopR";


   if (config.server == "Ice"){
     viewer = new TurtlebotVizIce(config);
   } else {
     viewer = new TurtlebotVizRos(config);
     viewer.connect();
   }
   $('#start').on('click', function(){
      viewer.start();
       $('#mod-toggle').prop( "disabled", false );
	});
   $('#stop').on('click', function(){
         viewer.stop();
       $('#mod-toggle').prop( "disabled", true );
	});

    $('#mod-toggle').change(function(evt) {
      if ($(this).prop('checked') && viewer){
         viewer.modelON();
      }else if (viewer){
         viewer.modelOFF();
      }
    });

    $('#DfIce').on('click', function(){
      dfIce();
	});

    $('#DfRos').on('click', function(){
      dfRos();
	});

   var resize = function (){
      $(".cam").height( $(".cam").width()*3/4);
      if (viewer && viewer.isRunning()){
         viewer.resizeCameraModel();
      }
   };

   $(window).resize(resize);

   $('#save').on('click', function(){
      config.camrightserv.dir= $('#dircam2').val();
      config.camrightserv.port= $('#portcam2').val();
      config.camleftserv.dir= $('#dircam1').val();
      config.camleftserv.port= $('#portcam1').val();
      config.motorserv.dir= $('#dirmotors').val();
      config.motorserv.port= $('#portmotors').val();
      config.pose3dserv.dir= $('#dirpose3d').val();
      config.pose3dserv.port= $('#portpose3d').val();
      config.laserserv.dir= $('#dirlaser').val();
      config.laserserv.port= $('#portlaser').val();
      config.maxv= $('#maxv').val();
      config.maxw= $('#maxw').val();
      if ($('#serverType').val() == "Ice"){
        config.server = "Ice";
        config.camrightepname= $('#epcam2').val();
        config.camleftepname= $('#epcam1').val();
        config.motorsepname= $('#epmotors').val();
        config.pose3depname= $('#eppose3d').val();
        config.laserepname= $('#eplaser').val();
      } else {
        config.server = "Ros";
        config.camrighttopic= $('#epcam2').val();
        config.camlefttopic= $('#epcam1').val();
        config.motorstopic= $('#epmotors').val();
        config.pose3dtopic= $('#eppose3d').val();
        config.lasertopic= $('#eplaser').val();
      }
      localStorage["turtlebotviewer"]=JSON.stringify(config);
      location.reload();
	});

   resize();

   function sameaddr (){
      var value = $( "#globaladdr" ).val();
      $( ".in-addr" ).val( value );
   }

   $('#sa-button').on('click', sameaddr);
});

function load(){
   if (localStorage.getItem("turtlebotviewer")) {
       config = JSON.parse(localStorage.getItem("turtlebotviewer"));
      $('#dircam2').val(config.camrightserv.dir);
      $('#portcam2').val(config.camrightserv.port);
      $('#dircam1').val(config.camleftserv.dir);
      $('#portcam1').val(config.camleftserv.port);
      $('#dirmotors').val(config.motorserv.dir);
      $('#portmotors').val(config.motorserv.port);
      $('#dirpose3d').val(config.pose3dserv.dir);
      $('#portpose3d').val(config.pose3dserv.port);
      $('#dirlaser').val(config.laserserv.dir);
      $('#portlaser').val(config.laserserv.port);
      $('#maxv').val(config.maxv);
      $('#maxw').val(config.maxw);
      if(config.server == "Ice"){
        dfIce();
      } else {
        dfRos();
      }
    } else{
      config.server = $('#serverType').val("Ros");;
      config.camrightserv={};
      config.motorserv={};
      config.pose3dserv={};
      config.laserserv={};
      config.camleftserv={};
      config.camrightserv.dir= $('#dircam2').val();
      config.camrightserv.port= $('#portcam2').val();
      config.camrightepname= $('#epcam2').val();
      config.camleftserv.dir= $('#dircam1').val();
      config.camleftserv.port= $('#portcam1').val();
      config.camleftepname= $('#epcam1').val();
      config.motorserv.dir= $('#dirmotors').val();
      config.motorserv.port= $('#portmotors').val();
      config.motorsepname= $('#epmotors').val();
      config.pose3dserv.dir= $('#dirpose3d').val();
      config.pose3dserv.port= $('#portpose3d').val();
      config.pose3depname= $('#eppose3d').val();
      config.laserserv.dir= $('#dirlaser').val();
      config.laserserv.port= $('#portlaser').val();
      config.laserepname= $('#eplaser').val();
      config.maxv= $('#maxv').val();
      config.maxw= $('#maxw').val();
    }
}
