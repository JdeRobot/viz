#include "../ros2head/publisherMotorsros2.hpp"

namespace Comm {
using std::placeholders::_1;
using namespace std::chrono_literals;

	PublisherMotors::PublisherMotors(int argc, char** argv, std::string nodeName, std::string topic)
	: Node(nodeName)
	{
		pthread_mutex_init(&mutex, NULL);

    	publisher_ = this->create_publisher<geometry_msgs::msg::Twist>(topic, 10);
    	timer_ = this->create_wall_timer(500ms, std::bind(&PublisherMotors::publish, this));
			
		std::cout << "Pubishe to "+ topic << std::endl;   

	}


	void PublisherMotors::publish()
	{
		auto vel = geometry_msgs::msg::Twist();
		JdeRobotTypes::CMDVel cmdvel;
		pthread_mutex_lock(&mutex);
			cmdvel = this->cmdvel;
		pthread_mutex_unlock(&mutex);
		vel = translate_twist_messages (cmdvel);
		this->publisher_->publish(vel);

	}



	PublisherMotors::~PublisherMotors(){
		this->stop();
	}



	void 
	PublisherMotors::stop(){
		rclcpp::shutdown();
	}

	void
	PublisherMotors::sendVelocities(JdeRobotTypes::CMDVel vel){
		pthread_mutex_lock(&mutex);
			this->cmdvel = vel;
		pthread_mutex_unlock(&mutex);
	}

	void
	PublisherMotors::sendVX (float vx){
		pthread_mutex_lock(&mutex);
			this->cmdvel.vx = vx;
		pthread_mutex_unlock(&mutex);
	}

	void
	PublisherMotors::sendVY (float vy){
		pthread_mutex_lock(&mutex);
			this->cmdvel.vy = vy;
		pthread_mutex_unlock(&mutex);

	}

	void
	PublisherMotors::sendAZ (float az){
		pthread_mutex_lock(&mutex);
			this->cmdvel.az = az;
		pthread_mutex_unlock(&mutex);
	}

	void
	PublisherMotors::sendV (float v){
		this->sendVX(v);
	}

	void
	PublisherMotors::sendW (float w){
		this->sendAZ(w);
	}

	void
	PublisherMotors::sendL (float l ){
		this->sendVY(l);
	}



}
