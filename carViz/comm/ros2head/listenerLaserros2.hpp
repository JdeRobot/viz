#pragma once
#include "rclcpp/rclcpp.hpp"
#include "sensor_msgs/msg/laser_scan.hpp"
#include <boost/thread/thread.hpp>
#include </opt/jderobot/include/jderobot/types/laserData.h>
#include "../interfaces/laserClient.hpp"
#include "translatorsros2.hpp"

namespace Comm {
	class ListenerLaser: public rclcpp::Node, public Comm::LaserClient {
		
	public:
		ListenerLaser(int argc, char** argv, std::string nodeName, std::string topic);
		~ListenerLaser();
		void stop();
		virtual JdeRobotTypes::LaserData  getLaserData();
		

	private:
		pthread_mutex_t mutex;
		rclcpp::Subscription<sensor_msgs::msg::LaserScan>::SharedPtr subscription_;	
		std::string topic;
		std::string nodeName;

		
		void lasercallback (const sensor_msgs::msg::LaserScan::SharedPtr laser_msg);

	};//class

} 

