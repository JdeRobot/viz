
#include <iostream>
#include <chrono>
#include </opt/jderobot/include/jderobot/visionlib/colorspaces/colorspacesmm.h>
#include "viewer.h"
#include "comm/getCameraClientdef.hpp"
#include </opt/jderobot/include/jderobot/types/image.h>
#include <yaml-cpp/yaml.h>


using namespace std; 

int main(int argc, char** argv){

	camViz::Viewer viewer;

		
    	std::string config_file_;
        config_file_.assign(argv[1]);
		
	    YAML::Node config = YAML::LoadFile(config_file_); 
        int server = config["Server"].as<int>();

        std::string topic = config["Topic"].as<std::string>();
        int fps = config["Fps"].as<int>();
        std::string  nodeName = config["Name"].as<std::string>();
		

// ***********Get from camera-interface*************
	camViz::CameraClient* camRGB;

	camRGB = camViz::getCameraClient(argc,argv,server,topic,nodeName);

	cout << "here" << endl;

	#ifdef ROS2S_H
	shared_ptr<camViz::MinimalSubscriber> ptr((camViz::MinimalSubscriber*)camRGB);
 
	rclcpp::executors::SingleThreadedExecutor exec;
	exec.add_node(ptr);

	auto spin_exec = [&exec]() {
    	exec.spin();
  	};

	std::thread execution_thread(spin_exec);
	#endif
//////****************View in GUI******************************
	JdeRobotTypes::Image rgb;
	std::cout << viewer.isVisible();

	while(viewer.isVisible()){
		rgb = camRGB->getImage();
		viewer.display(rgb.data);
		viewer.displayFrameRate(1);

	}
	#ifdef ROS2S_H
	execution_thread.join();
	#endif

	return 0;
}
