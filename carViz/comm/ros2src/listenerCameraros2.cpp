#include "../ros2head/listenerCameraros2.hpp"

namespace Comm {
using std::placeholders::_1;

	ListenerCamera::ListenerCamera(int argc, char** argv, std::string nodeName, std::string topic):
	 Node(nodeName)
	{
		pthread_mutex_init(&mutex, NULL);
		subscription_ = this->create_subscription<sensor_msgs::msg::Image>(topic, 10, std::bind(&ListenerCamera::imagecallback, this, _1));
        std::cout << "listen from "+ topic << std::endl;   

	}

	ListenerCamera::~ListenerCamera(){
		this->stop();
	}
	void 
	ListenerCamera::stop(){
		rclcpp::shutdown();	}

	void 
	ListenerCamera::imagecallback(const sensor_msgs::msg::Image::SharedPtr image_msg){
		this->cont++;
		time_t now;
		time(&now);
		pthread_mutex_lock(&mutex);
		this->image = Comm::translate_image_messages(image_msg);
		if (difftime(this->timer, now)>=1){
			this->refreshRate = this->cont;
			this->cont = 0;
			this->timer = now;
		}
		pthread_mutex_unlock(&mutex);

	}

	JdeRobotTypes::Image  ListenerCamera::getImage(){
		JdeRobotTypes::Image img;
		pthread_mutex_lock(&mutex);
		img = this->image;
		pthread_mutex_unlock(&mutex);
		return img;
	}

	int ListenerCamera::getRefreshRate(){

		int rr;
		pthread_mutex_lock(&mutex);
		rr = this->refreshRate;
		pthread_mutex_unlock(&mutex);

		return rr;
	}



}
