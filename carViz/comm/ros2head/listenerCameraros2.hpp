#pragma once
#include <memory>
#include "rclcpp/rclcpp.hpp"
#include "sensor_msgs/msg/image.hpp"
#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <boost/thread/thread.hpp>
#include </opt/jderobot/include/jderobot/types/image.h>
#include "../interfaces/cameraClient.hpp"
#include "translatorsros2.hpp"
#include <time.h>
#include <thread>

namespace Comm {
	class ListenerCamera: public rclcpp::Node,public Comm::CameraClient {
		
	public:
		ListenerCamera(int argc, char** argv, std::string nodeName, std::string topic);
		~ListenerCamera();

		void stop();
		virtual JdeRobotTypes::Image getImage();
		virtual int getRefreshRate();
		

	private:
		pthread_mutex_t mutex;
    	rclcpp::Subscription<sensor_msgs::msg::Image>::SharedPtr subscription_;	
		std::string topic;
		std::string nodeName;

		int cont = 0; //used to count Frames per seconds
		time_t timer; // used to save time for FPS


  void imagecallback (const sensor_msgs::msg::Image::SharedPtr image_msg);
		



	};//class

} 
