function TurtlebotVizRos (config){
  /*************************
   **** Public objects  ****
   *************************/
  this.motorserv=config.motorserv;
  this.camleftserv=config.camleftserv;
  this.camrightserv=config.camrightserv;
  this.pose3dserv=config.pose3dserv;
  this.laserserv=config.laserserv;

  this.camleftid=config.camleftid;
  this.camrightid=config.camrightid;
  this.controlid=config.controlid;
  this.modelid=config.modelid;
  this.stopbtnid=config.stopbtnid;

  this.camlefttopic=config.camlefttopic|| "cam_sensor_left";
  this.camrighttopic= config.camrighttopic || "cam_sensor_right";
  this.motorstopic = config.motorstopic || "Motors";
  this.pose3dtopic = config.pose3dtopic || "Pose3D";
  this.lasertopic = config.lasertopic || "Laser";

  this.maxv=config.maxv;
  this.maxw=config.maxw;








  /*************************
   **** Private objects ****
   *************************/
  var control=undefined;

  var model = {id: this.modelid,
               container: $('#'+this.modelid),
               WIDTH: 320,
               HEIGHT: 320,
               VIEW_ANGLE: 50,
               NEAR: 0.1,
               FAR: 5000,
               robot:undefined,
               renderer:undefined,
               camera: undefined,
               controls: undefined,
               laser:undefined,
               animation: undefined,
               active: false,
  };
  model.ASPECT=model.WIDTH / model.HEIGHT;

  var lasercanv = undefined;
  var w = {};
  var v = {};
  v.x = 0.0;
  v.y = 0.0;
  v.z = 0.0;
  w.x = 0.0;
  w.y = 0.0;
  w.z = 0.0;
  var motors;
  var cameraleft,cameraright;
  var pose3d;
  var laser;
  var timeout = 10000;
  var motorsInterval = null;
  var lastV=0, lastW=0;

  var self=this;



  /*************************
   **** Private methods ****
   *************************/

  var calcDist= function (num1, num2){
        var max = Math.max(num1,num2);
        var min = Math.min(num1,num2);

        return max-min;
     }

  var stopbot = function(){
     control.removeListeners();
     initControl();
     lastV = 0;
     lastW = 0;
 		 v.x = 0.0;
 		 w.z = 0.0;
     motors.setV(v);
     motors.setW(w);
   };

  /*********** WebGL ******/
  var initControl = function (){

     control = new GUI.Control ({id:self.controlid});
     maxv=this.maxv;
     maxw=this.maxw;

     lastW=0;
     lastV=0;

     control.onPointerM = function (event){
        control.onPointerMDefault(event);
        var distSend = 2;
        var pos = control.position;
        if (calcDist(pos.z,lastV)>=distSend){
           v.x = pos.z*self.maxv/control.HEIGHT;
           lastV = pos.z;
        }

        if (calcDist(pos.x,lastW)>=distSend){
           w.z = pos.x*self.maxw/control.WIDTH;
           lastW = pos.x;
        }
      };
     control.initControl();
  };

   var initModel = function (){
     var canv = document.getElementById(model.id);
     model.ASPECT=canv.width/canv.height;
     model.camera = new THREE.PerspectiveCamera(model.VIEW_ANGLE, model.ASPECT, model.NEAR, model.FAR);
     model.camera.position.set( -5, 5, 2 );

     model.camera.lookAt(new THREE.Vector3( 0,0,0 ));

     model.renderer = new THREE.WebGLRenderer({canvas:canv, antialias: true});
     model.renderer.setPixelRatio( window.devicePixelRatio );
     model.renderer.setClearColor( 0xffffff);

     model.scene=new THREE.Scene();

     //controls
     model.controls = new THREE.TrackballControls( model.camera );

     model.controls.rotateSpeed = 2.0;
     model.controls.zoomSpeed = 2.2;
     model.controls.panSpeed = 1.8;

     model.controls.noZoom = false;
     model.controls.noPan = false;

     model.controls.staticMoving = true;
     model.controls.dynamicDampingFactor = 0.3;
     model.controls.enabled=false;

     model.controls.keys = [ 65, 83, 68 ];

     canv.addEventListener("mouseover", function(){
           model.controls.enabled=true;
     });

     canv.addEventListener("mouseout", function(){
           model.controls.enabled=false;
     });

     //lights
     var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
     light.position.set( 0, 500, 0 );
     model.scene.add(light);

     // Grid
     var size = 25;
     var step = 1;

     var gridHelper = new THREE.GridHelper( size, step );
     model.scene.add( gridHelper );

     var axisHelper = new THREE.AxisHelper( 2 );
     model.scene.add( axisHelper );

     //ground
     var groundMat = new THREE.MeshBasicMaterial({color:0xd8d8d8});
     var groundGeo = new THREE.PlaneGeometry(50,50);
     var ground = new THREE.Mesh(groundGeo,groundMat);
     ground.position.y = -0.05; //lower it
     ground.rotation.x = -Math.PI/2; //-90 degrees around the xaxis

     model.scene.add(ground);



     var modelAnimation = function(){
        model.animation = requestAnimationFrame(modelAnimation);
        model.controls.update();
        model.renderer.render(model.scene,model.camera);

     };

     if (model.robot==undefined) {
        var loader = new GUI.RobotLoader();
        loader.loadTurtlebot(1,function () {
           model.robot=loader.robot;
           model.scene.add( model.robot );
           modelAnimation();
      });
     } else {
        model.scene.add( model.robot );
        modelAnimation();
     }

  };

  /*
   * initGL
   * Prepare reconstruction with webgl
   */
  var initGL = function(){
     initControl();
      if (self.modelid && model.active){
        initModel();
     }
  }

  /*************************
   ** Privileged methods ***
   *************************/

  this.setConfig = function(conf){



     this.motorserv=conf.motorserv || this.motorserv;
     this.camleftserv=conf.camleftserv || this.camleftserv;
     this.camrightserv=conf.camrightserv || this.camrightserv;
     this.pose3dserv=conf.pose3dserv || this.pose3dserv;
     this.laserserv=conf.laserserv || this.laserserv;

     this.camleftid=conf.camleftid || this.camleftid;
     this.camrightid=conf.camrightid || this.camrightid;
     this.controlid=conf.controlid || this.controlid;
     this.modelid=conf.modelid || this.modelid;
     this.stopbtnid=conf.stopbtnid || this.stopbtnid;

     this.camleftepname=conf.camleftepname || this.camleftepname;
     this.camrightepname= conf.camrightepname || this.camrightepname;
     this.motorsepname = conf.motorsepname || this.motorsepname;
     this.pose3depname = conf.pose3depname || this.pose3depname;
     this.laserepname = conf.laserepname || this.laserepname;

     this.maxv=conf.maxv || this.maxv;
     this.maxw=conf.maxw || this.maxw;

  };

  /*
   * start
   * run client
   */
  this.connect = function (){
    laser= new API.LaserRos({server:self.laserserv,topic:self.lasertopic});
    laser.connect();
    motors= new API.MotorsRos({server:self.motorserv,topic:self.motorstopic});
    cameraleft = new API.CameraRos ({server:self.camleftserv,id: self.camleftid, topic:self.camlefttopic});
    cameraright = new API.CameraRos({server:this.camrightserv,id:this.camrightid,topic: self.camrighttopic});
    pose3d = new API.Pose3DRos({server:self.pose3dserv,topic:self.pose3dtopic});
    $('#'+this.stopbtnid).on('click', stopbot);

    motors.connect();
    cameraleft.connect();
    cameraright.connect();
    pose3d.connect();
    initGL();
  }
  this.start= function(){
     lasercanv = document.getElementById("laser");
     lasercanv.height = lasercanv.width/2;
    if (motorsInterval == null) {
      console.log("Start Motors");
      motorsInterval = setInterval(function (){
        motors.setMotors(v,w)
      },0);
    }
     laser.startStreaming(true,lasercanv.width,1,model);
     cameraleft.startStreaming();
     cameraright.startStreaming();
     if (model.active) {
       pose3d.startStreaming(model);
     }
  };

  this.stop = function(){
     laser.stop();
     if (pose3d.isRunning) {
       pose3d.stop();
    }
     cameraleft.stop();
     cameraright.stop();
     clearInterval(motorsInterval);
     console.log("Stop Motors");
     motorsInterval = null;
  };

  this.disconnect = function(){
    laser.stop();
    if (pose3d.isRunning) {
      pose3d.stop();
   }
    cameraleft.stop();
    cameraright.stop();
    clearInterval(motorsInterval);
    motorsInterval = null;
    laser.disconnect();
    pose3d.disconnect();
    cameraleft.disconnect();
    cameraright.disconnect();
    motors.disconnect();
}
  /*
   * isrunning
   * Returns a boolean indicating if the client is running
   */
   this.isRunning= function () {
     try{
      return motors.isRunning || cameraleft.isRunning || cameraright.isRunning || pose3d.isRunning || laser.isRunning;
    } catch (e){
      return false;
    }
   };

  this.resizeCameraModel= function(){
     if (model.active) {
        model.camera.aspect = model.renderer.domElement.width / model.renderer.domElement.height;
        model.camera.updateProjectionMatrix();
        model.renderer.render(model.scene,model.camera);
     }

  };

   this.modelON = function() {
     model.active = true;
     if (self.modelid && !model.renderer){
        initModel();
        pose3d.startStreaming(model);
     }
  };

  this.modelOFF = function() {

     model.active = false;
     if (self.modelid && model.renderer){
        cancelAnimationFrame(model.animation);// Stop the animation

        model.scene = null;
        model.renderer = undefined;
        model.camera = undefined;
        model.controls = undefined;
        var m = model.container.clone();
        var parent = model.container.parent();
        model.container.remove();
        parent.append(m);
        model.container = m;

     }
  };
}
