#pragma once
#include <memory>
#include </opt/jderobot/include/jderobot/types/image.hpp>
#include "rclcpp/rclcpp.hpp"
#include "sensor_msgs/msg/image.hpp"
#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>

#include "std_msgs/msg/string.hpp"

#include "translatorsros2.hpp"
#include <boost/thread/thread.hpp>
#include <iostream>  
#include <cv_bridge/cv_bridge.h>
#include <time.h>
#include "../CameraClient.hpp"

#include <thread>

namespace camViz{

using std::placeholders::_1;
using rclcpp::executors::MultiThreadedExecutor;

class MinimalSubscriber : public rclcpp::Node, public CameraClient
{
public:
    MinimalSubscriber(int argc, char** argv, std::string nodeName, std::string topic);
    void stop();
    virtual JdeRobotTypes::Image getImage();
    virtual int getRefreshRate();

private:
    pthread_mutex_t mutex;
    rclcpp::Subscription<sensor_msgs::msg::Image>::SharedPtr subscription_;

		std::string topic;
		std::string  nodeName;
  

protected:
	JdeRobotTypes::Image image;
	int refreshRate;
  bool on;
	int cont = 0; //used to count Frames per seconds
	time_t timer; // used to save time for FPS
  void imagecallback (const sensor_msgs::msg::Image::SharedPtr image_msg);
  void topic_callback(const std_msgs::msg::String::SharedPtr msg);

};

    MinimalSubscriber::MinimalSubscriber(int argc, char** argv, std::string nodeName, std::string topic) 
    : Node(nodeName)
    {
      	pthread_mutex_init(&mutex, NULL);

        subscription_ = this->create_subscription<sensor_msgs::msg::Image>(
      topic, 10, std::bind(&MinimalSubscriber::imagecallback, this, _1));
        std::cout << "listen from "+ topic << std::endl;   
    }

  void
    MinimalSubscriber::imagecallback(const sensor_msgs::msg::Image::SharedPtr image_msg){
			this->cont++;
			time_t now;
			time(&now);

			pthread_mutex_lock(&mutex);
      this->image = translate_image_messages(image_msg);   
			if (difftime(this->timer, now)>=1){
				this->refreshRate = this->cont;
				this->cont = 0;
				this->timer = now;
			}
			pthread_mutex_unlock(&mutex);

		}


	JdeRobotTypes::Image MinimalSubscriber::getImage(){
		JdeRobotTypes::Image img;
		pthread_mutex_lock(&mutex);
		img = this->image;
		pthread_mutex_unlock(&mutex);
		return img;
	}

  int MinimalSubscriber::getRefreshRate(){
        int rr;
        pthread_mutex_lock(&mutex);
        rr = this->refreshRate;
        pthread_mutex_unlock(&mutex);

        return rr;
    }



}
