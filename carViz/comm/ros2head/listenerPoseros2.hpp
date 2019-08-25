#pragma once
#include "rclcpp/rclcpp.hpp"
#include "nav_msgs/msg/odometry.hpp"
#include <boost/thread/thread.hpp>
#include </opt/jderobot/include/jderobot/types/pose3d.h>
#include "../interfaces/pose3dClient.hpp"
#include "translatorsros2.hpp"

namespace Comm {
	class ListenerPose: public rclcpp::Node, public Comm::Pose3dClient {
		
	public:
		ListenerPose(int argc, char** argv, std::string nodeName, std::string topic);
		~ListenerPose();
		void stop();
		virtual JdeRobotTypes::Pose3d  getPose();
		

	private:
		pthread_mutex_t mutex;
		rclcpp::Subscription<nav_msgs::msg::Odometry>::SharedPtr subscription_;	
		std::string topic;
		std::string nodeName;
		
		void posecallback (const nav_msgs::msg::Odometry::SharedPtr odom_msg);

	};//class

} 
