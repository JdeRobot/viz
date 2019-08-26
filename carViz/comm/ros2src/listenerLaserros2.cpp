#include "../ros2head/listenerLaserros2.hpp"

namespace Comm {
using std::placeholders::_1;

	ListenerLaser::ListenerLaser(int argc, char** argv, std::string nodeName, std::string topic)
	: Node(nodeName)
	{
		pthread_mutex_init(&mutex, NULL);

			subscription_ = this->create_subscription<sensor_msgs::msg::LaserScan>(topic, 10, std::bind(&ListenerLaser::lasercallback, this, _1));

			std::cout << "listen from "+ topic << std::endl;

	}
	ListenerLaser::~ListenerLaser(){
		this->stop();
	}


	void 
	ListenerLaser::stop(){
		rclcpp::shutdown();
	}

	void 
	ListenerLaser::lasercallback(const sensor_msgs::msg::LaserScan::SharedPtr laser_msg){
		pthread_mutex_lock(&mutex);
		this->laserData = Comm::translate_laser_messages(laser_msg);
		pthread_mutex_unlock(&mutex);

	}

	JdeRobotTypes::LaserData  
	ListenerLaser::getLaserData(){
		JdeRobotTypes::LaserData ld;
		pthread_mutex_lock(&mutex);
		ld = this->laserData;
		pthread_mutex_unlock(&mutex);
		return ld;
	}



}
