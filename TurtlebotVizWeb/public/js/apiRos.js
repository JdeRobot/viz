var API = API || {};
API.CameraRos = function (config) {
	 var conf = config || {};
	 this.ros;
	 this.isRunning = false;
	 this.div = config.id;
	 var self = this;
   this.connect = function (topic){

        self.ros = new ROSLIB.Ros({
            url : "ws://"+config.server.dir+":"+config.server.port
         });

         // This function is called upon the rosbridge connection event
         self.ros.on('connection', function() {
             // Write appropriate message to #feedback div when successfully connected to rosbridge
             console.log("Connect websocket Camera");
						 //self.isRunning = true;
         });
        // This function is called when there is an error attempting to connect to rosbridge
        self.ros.on('error', function(error) {
            // Write appropriate message to #feedback div upon error when attempting to connect to rosbridge
            console.log("Error to connect websocket");
        });

        // These lines create a topic object as defined by roslibjs
         self.roscam = new ROSLIB.Topic({
            ros : self.ros,
            name : config.topic,
            messageType : "sensor_msgs/CompressedImage"
        });

   };

   this.startStreaming = function(){
        var canvas = document.getElementById(self.div);
        var ctx = canvas.getContext("2d");
        var imagedata = new Image();
				self.isRunning = true;
				console.log("Subscribe Camera")
        self.roscam.subscribe(function(message){
          if (message.format != null){
            imagedata.src = "data:image/jpg;base64," + message.data;
            imagedata.onload = function(){
              ctx.drawImage(imagedata,0,0,canvas.width,canvas.height);
            }
          } else {
            console.log(message);
          }
      });
   };

	 this.stop = function (){
		self.roscam.unsubscribe();
		console.log("Unsubscribe Camera");
};

	this.disconnect = function (){
		self.ros.on('close',function(){
			console.log("Disconnect websocket Camera");
		});
		self.ros.close();
		self.ros = undefined;

	}
}
API.LaserRos = function (config) {
	 var conf = config || {};
	 this.isRunning = false;
	 var self = this;
   this.connect = function (){

        self.ros = new ROSLIB.Ros({
            url : "ws://"+config.server.dir+":"+config.server.port
         });

         // This function is called upon the rosbridge connection event
         self.ros.on('connection', function() {
             // Write appropriate message to #feedback div when successfully connected to rosbridge
             console.log("Connect websocket Laser");
         });
        // This function is called when there is an error attempting to connect to rosbridge
        self.ros.on('error', function(error) {
            // Write appropriate message to #feedback div upon error when attempting to connect to rosbridge
            console.log("Error to connect websocket");
        });

        // These lines create a topic object as defined by roslibjs
         self.roslaser = new ROSLIB.Topic({
            ros : self.ros,
            name : config.topic,
            messageType : "sensor_msgs/LaserScan"
        });

   };

   this.startStreaming = function(convertUpAxis,canv2dWidth, scale3d, model){
				self.isRunning = true;
				console.log("Subscribe Laser");
        self.roslaser.subscribe(function(message){
					var i,j;
		      var numlaser = message.ranges.length;
		      var dist =  message.ranges;
		      var minAngle = message.angle_min;
		      var maxAngle = message.angle_max;
		      var minRange = message.range_min;
		      var maxRange = message.range_max;
		      var step = (maxAngle - minAngle) / numlaser;
		      var array2d = [];
		      var array3d = [];
		      var max = canv2dWidth/2;

		      var center = {x:canv2dWidth/2 , y:canv2dWidth/2};
		      for (i = 0; i< numlaser; i++ ){

		         var ang = minAngle + i * step;
		         var dd = calcNorm2DPoint (dist[i], maxRange, ang, max, center,canv2dWidth);
		         array2d[2*i] = dd.x;
		         array2d[2*i+1] = dd.y;
		      }
		      j=9;
		      var d1 = calc3dPoint (dist[0], maxRange, Math.PI, convertUpAxis, scale3d);
		      var d2 = calc3dPoint (dist[1], maxRange, Math.PI-Math.PI/numlaser, convertUpAxis, scale3d);
		      array3d[0] = d1.x;
		      array3d[1] = d1.y;
		      array3d[2] = d1.z;
		      array3d[3] = 0;
		      array3d[4] = 0;
		      array3d[5] = 0;
		      array3d[6] = d2.x;
		      array3d[7] = d2.y;
		      array3d[8] = d2.z;
		      for (i=2;i< numlaser; i++){
		         ang = (i*Math.PI/numlaser);
		         var d = calc3dPoint (dist[i], maxRange, ang, convertUpAxis, scale3d);
		         array3d[j+0] = array3d[j-3];
		         array3d[j+1] = array3d[j-2];
		         array3d[j+2] = array3d[j-1];
		         array3d[j+3] = 0;
		         array3d[j+4] = 0;
		         array3d[j+5] = 0;
		         array3d[j+6] = d.x;
		         array3d[j+7] = d.y;
		         array3d[j+8] = d.z;
		         j = j + 9;
		      }
					var laser = {}
		      laser.distanceData = dist;
		      laser.numLaser = numlaser;
		      laser.maxAngle = maxAngle;
		      laser.minAngle = minAngle;
		      laser.maxRange = maxRange;
		      laser.minRange = minRange;
		      laser.canv2dData = array2d;
		      laser.array3dData = array3d;
					drawLaser(laser,model,canv2dWidth);
      });
   };

	 this.stop = function (){
		self.roslaser.unsubscribe();
		console.log("Unsubscribe Laser");
 	}

	this.disconnect = function (){
		self.ros.on('close',function(){
			console.log("Disconnect websocket Laser");
		});
		self.ros.close();
		self.ros = undefined;

	}

	function calc3dPoint (dist,maxdist, ang, convertUpAxis, scale){
		 var a;
		 var x;
		 if (dist == null){
			 a = scale * maxdist * Math.cos(ang);
		   x = scale * maxdist * Math.sin(ang);
		 }
		 else {
			 a = scale * dist * Math.cos(ang);
  	   x = scale * dist * Math.sin(ang);
		 }

	   if (convertUpAxis){
	      return {x:x,y:0,z:a};
	   } else {
	      return {x:x,y:a,z:0};
	   }
	}

	function calcNorm2DPoint (dist, maxRange, ang, max2d, center, width){
		var x;
		var y;
		 var d = maxRange/max2d;
		 if (dist == null){
			 x = center.x - ((maxRange /d) * (Math.sin(ang)));
		   y = center.y - ((maxRange /d) * (Math.cos(ang)));
		 } else {
		   x = center.x - ((dist /d) * (Math.sin(ang)));
		   y = center.y - ((dist /d) * (Math.cos(ang)));
	 	}
	 var a = {x:x,y:y};
	 return a;
	}
	function drawLaser(laser, model){
		var dist = laser.canv2dData;
		var lasercanv = document.getElementById("laser");
		var ctx = lasercanv.getContext("2d");
		ctx.beginPath();
		ctx.clearRect(0,0,lasercanv.width,lasercanv.height);
		ctx.fillRect(0,0,lasercanv.width,lasercanv.height);
		ctx.strokeStyle="white";
		ctx.moveTo(dist[0], dist[1]);
		for (var i = 2;i<dist.length; i = i+2 ){
			 ctx.lineTo(dist[i], dist[i+1]);
		}
		ctx.moveTo(lasercanv.width/2, lasercanv.height);
		ctx.lineTo(lasercanv.width/2, lasercanv.height-10);
		ctx.stroke();

		//3D
		if (model.active){
			 var geometry = new THREE.BufferGeometry();
			 geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(laser.array3dData), 3 ) );
			 var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			 material.transparent = true;
			 material.opacity=0.5;
			 material.side = THREE.DoubleSide;
			 var las = new THREE.Mesh( geometry, material );
			 if (model.laser){
					model.robot.remove(model.laser);
			 };
			 model.robot.add(las);
			 model.laser = las;
		}
 };
};

API.MotorsRos = function(config){
	var conf = config || {};
	this.ros;
	this.isRunning = false;
	var self = this;
	this.connect = function (){

			 self.ros = new ROSLIB.Ros({
					 url : "ws://"+config.server.dir+":"+config.server.port
				});

				// This function is called upon the rosbridge connection event
				self.ros.on('connection', function() {
						// Write appropriate message to #feedback div when successfully connected to rosbridge
						console.log("Connect websocket Motors");
						self.isRunning = true;
				});
			 // This function is called when there is an error attempting to connect to rosbridge
			 self.ros.on('error', function(error) {
					 // Write appropriate message to #feedback div upon error when attempting to connect to rosbridge
					 console.log("Error to connect websocket");
			 });

			 // These lines create a topic object as defined by roslibjs
				self.rosMotors = new ROSLIB.Topic({
					 ros : self.ros,
					 name : config.topic,
					 messageType : "geometry_msgs/Twist"
			 });

	};

	this.setV = function (v){
		var w = {};
		w.x = 0.0;
		w.y = 0.0;
		w.z = 0.0;
		var motorsMessage = new ROSLIB.Message({
			linear: v,
			angular: w
		});
		self.rosMotors.publish(motorsMessage);
	}

	this.setW = function (w){
		var v = {};
		v.x = 0.0;
		v.y = 0.0;
		v.z = 0.0;
		var motorsMessage = new ROSLIB.Message({
			linear: v,
			angular: w
		});
		self.rosMotors.publish(motorsMessage);
	}

	this.setMotors = function(v,w){
		var motorsMessage = new ROSLIB.Message({
			linear: v,
			angular: w
		});
		self.rosMotors.publish(motorsMessage);
	}

	this.disconnect = function (){
		self.ros.on('close',function(){
			console.log("Disconnect websocket Motors");
		});
		self.ros.close();
		self.ros = undefined;

	}
}

API.Pose3DRos = function(config){
	var conf = config || {};
	this.isRunning = false;
	var self = this;
	var lastPose;
	this.connect = function (){

			 self.ros = new ROSLIB.Ros({
					 url : "ws://"+config.server.dir+":"+config.server.port
				});

				// This function is called upon the rosbridge connection event
				self.ros.on('connection', function() {
						// Write appropriate message to #feedback div when successfully connected to rosbridge
						console.log("Connect websocket Pose3D");
				});
			 // This function is called when there is an error attempting to connect to rosbridge
			 self.ros.on('error', function(error) {
					 // Write appropriate message to #feedback div upon error when attempting to connect to rosbridge
					 console.log("Error to connect websocket")
			 });

			 // These lines create a topic object as defined by roslibjs
				self.rospose = new ROSLIB.Topic({
					 ros : self.ros,
					 name : config.topic,
					 messageType : "nav_msgs/Odometry"
			 });

	};

	this.startStreaming = function(model){
		self.isRunning = true;
		console.log("Subscribe Pose3D");
			 self.rospose.subscribe(function(message){
				 if (lastPose != message.pose){
					 position = message.pose.pose.position;
					 orientation = getPose3D(message.pose.pose.orientation);
					 if (model.active) {
	            model.robot.position.set(position.x,position.z,-position.y);
	            model.robot.rotation.y=(orientation.yaw);
	            model.robot.updateMatrix();}
				}
				lastPose = message.pose;
		 });
	};

	this.stop = function (){
	 self.rospose.unsubscribe();
	 console.log("Unsubscribe Pose3D");
 }

 this.disconnect = function (){
	 self.ros.on('close',function(){
		 console.log("Disconnect websocket Pose3D");
	 });
	 self.ros.close();
	 self.ros = undefined;

 }

 function getPose3D(pos){
	 	var orientation = {}
	 	orientation.yaw = getYaw(pos.w,pos.x,pos.y,pos.z);
		orientation.roll = getRoll(pos.w,pos.x,pos.y,pos.z);
		orientation.pitch = getPitch(pos.w,pos.x,pos.y,pos.z);
		return orientation;
 }

 // Functions return the value of fliying parameters
 function getYaw(qw,qx,qy,qz) {
        var rotateZa0=2.0*(qx*qy + qw*qz);
        var rotateZa1=qw*qw + qx*qx - qy*qy - qz*qz;
        var rotateZ=0.0;
        if(rotateZa0 != 0.0 && rotateZa1 != 0.0){
            rotateZ=Math.atan2(rotateZa0,rotateZa1);
        }
        return rotateZ;
 }

 function getRoll(qw,qx,qy,qz){
        rotateXa0=2.0*(qy*qz + qw*qx);
        rotateXa1=qw*qw - qx*qx - qy*qy + qz*qz;
        rotateX=0.0;

        if(rotateXa0 != 0.0 && rotateXa1 !=0.0){
            rotateX=Math.atan2(rotateXa0, rotateXa1);
        }
        return rotateX;
 }
 function getPitch(qw,qx,qy,qz){
        rotateYa0=-2.0*(qx*qz - qw*qy);
        rotateY=0.0;
        if(rotateYa0>=1.0){
            rotateY=math.PI/2.0;
        } else if(rotateYa0<=-1.0){
            rotateY=-Math.PI/2.0
        } else {
            rotateY=Math.asin(rotateYa0)
        }

        return rotateY;
 }
}
