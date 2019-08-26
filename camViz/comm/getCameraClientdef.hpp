#include <iostream>
#include "sstream"
#include <chrono>
#include <memory>

#include "mainsub.hpp"
#include "getCameraClient.hpp"


namespace camViz{

	CameraClient* 
	getCameraClient(int argc, char** argv, int server, std::string topic,std::string  nodeName){
		CameraClient* client = NULL;		
		switch (server){
			case 1:
			{
				#ifdef ROS1S_H
				std::cout << "Receiving ROS1 messages" << std::endl;
	
				ListenerCamera* lc;
				lc = new ListenerCamera(0, nullptr, nodeName, topic);
				lc->start();

				client = (camViz::CameraClient*) lc;
				//cv::destroyWindow("view");
					
				#else
					throw "ERROR: ROS1 is not available";
				#endif
				break;
			}
			case 2:
			{
				
				#ifdef ROS2S_H

				std::cout << "Receiving ROS2 messages" << std::endl;
				rclcpp::init(argc, argv);
			    MinimalSubscriber* lc2;
				lc2 = new MinimalSubscriber(0, nullptr, nodeName,topic);
				client = (camViz::CameraClient*) lc2;

				#else
					throw "ERROR: ROS2 is not available";
				#endif
				break;
			}
			default:
			{
				printf("Select right distro of ROS");
				break;
			}

		}
	
		return client;


	}

}
