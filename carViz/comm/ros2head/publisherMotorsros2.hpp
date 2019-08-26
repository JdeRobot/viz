#include "rclcpp/rclcpp.hpp"
#include "geometry_msgs/msg/twist.hpp"
#include <boost/thread/thread.hpp>
#include </opt/jderobot/include/jderobot/types/cmdvel.h>
#include "../interfaces/motorsClient.hpp"
#include "translatorsros2.hpp"

namespace Comm {
	class PublisherMotors:public rclcpp::Node, public Comm::MotorsClient {
		
	public:
		PublisherMotors(int argc, char** argv, std::string nodeName, std::string topic);
		~PublisherMotors();
		void stop();
		
		virtual void sendVelocities(JdeRobotTypes::CMDVel vel);
		virtual void sendVX (float vx);
		virtual void sendVY (float vy);
		virtual void sendAZ (float az);
		virtual void sendV (float v);
		virtual void sendW (float w);
		virtual void sendL (float l );
		

	private:
		pthread_mutex_t mutex;
        rclcpp::Publisher<geometry_msgs::msg::Twist>::SharedPtr publisher_;
		std::string topic;
		std::string nodeName;

  		rclcpp::TimerBase::SharedPtr timer_;
		bool forPublish;

		void publish();
		

	};//class

} 
