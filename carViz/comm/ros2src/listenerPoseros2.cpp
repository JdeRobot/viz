#include "../ros2head/listenerPoseros2.hpp"

namespace Comm {
using std::placeholders::_1;

	ListenerPose::ListenerPose(int argc, char** argv, std::string nodeName, std::string topic):
	Node(nodeName)
	{
		pthread_mutex_init(&mutex, NULL);
		if ("" == topic){
			this->on = false;
			std::cerr <<"Invalid laser topic" <<std::endl;
		}else{
			this->on = true;
			this->topic = topic;
			this->nodeName = nodeName;
			subscription_ = this->create_subscription<nav_msgs::msg::Odometry>(topic, 10, std::bind(&ListenerPose::posecallback, this, _1));
        	std::cout << "listen from "+ topic << std::endl; 
			
		}
	}

	ListenerPose::~ListenerPose(){
		this->stop();
	}



	void 
	ListenerPose::stop(){
		rclcpp::shutdown();
	}


	void 
	ListenerPose::posecallback(const nav_msgs::msg::Odometry::SharedPtr odom_msg){
		pthread_mutex_lock(&mutex);
		this->pose = Comm::translate_odometry_messages(odom_msg);
		pthread_mutex_unlock(&mutex);

	}

	JdeRobotTypes::Pose3d  
	ListenerPose::getPose(){
		JdeRobotTypes::Pose3d pose3d;
		pthread_mutex_lock(&mutex);
		pose3d = this->pose;
		pthread_mutex_unlock(&mutex);
		return pose3d;
	}



}
