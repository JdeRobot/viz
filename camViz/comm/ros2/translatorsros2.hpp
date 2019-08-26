#include </opt/jderobot/include/jderobot/types/image.h>
#include "image_transport/image_transport.h"
#include "rclcpp/rclcpp.hpp"
#include "sensor_msgs/msg/image.hpp"
#include <sensor_msgs/msg/compressed_image.hpp>

#include <sensor_msgs/image_encodings.hpp>

#include "opencv2/highgui/highgui.hpp"
#include "opencv2/imgproc/imgproc.hpp"
#include <opencv2/opencv.hpp>
#include <cv_bridge/cv_bridge.h>


namespace camViz {


	JdeRobotTypes::Image translate_image_messages(const sensor_msgs::msg::Image::SharedPtr image_msg);

   	float PI = 3.1415;

	int MAXRANGEIMGD = 8; //max length received from imageD

	void 
	depthToRGB(const cv::Mat& float_img, cv::Mat& rgb_img, std::string type ){
	  //Process images
		cv::Mat mono8_img;
		if (type.substr(type.length() - 3, 1) == "U"){
			mono8_img = float_img;
			rgb_img = cv::Mat(float_img.size(), CV_8UC3);
		}else{
			cv::Mat mono8_img = cv::Mat(float_img.size(), CV_8UC1);
		  	if(rgb_img.rows != float_img.rows || rgb_img.cols != float_img.cols){
		    	rgb_img = cv::Mat(float_img.size(), CV_8UC3);
		    }
		  	cv::convertScaleAbs(float_img, mono8_img, 255/MAXRANGEIMGD, 0.0);
		}
		
	  	cv::cvtColor(mono8_img, rgb_img, CV_GRAY2RGB);

	}

	JdeRobotTypes::Image 
	translate_image_messages(const sensor_msgs::msg::Image::SharedPtr image_msg){
		JdeRobotTypes::Image img;
		cv_bridge::CvImagePtr cv_ptr;

		///img.timeStamp = image_msg->header.stamp.sec + (image_msg->header.stamp.nsec *1e-9);//////////change nsec-> nanosec in ROS2
		img.timeStamp = image_msg->header.stamp.sec ;//////////nsec error

        img.format = "RGB8"; // we convert img_msg to RGB8 format
		img.width = image_msg->width;
		img.height = image_msg->height;
		cv::Mat img_data;

		if (image_msg->encoding.substr(image_msg->encoding.length() - 2 ) == "C1"){
			cv_ptr = cv_bridge::toCvCopy(image_msg);
			depthToRGB(cv_ptr->image, img_data, image_msg->encoding);
			

		}else{
			cv_ptr = cv_bridge::toCvCopy(image_msg, sensor_msgs::image_encodings::RGB8);
			img_data = 	cv_ptr->image;
		}


		img.data = img_data;

		return img;
	}

}
