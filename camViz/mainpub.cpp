#include <iostream>
#include "sstream"
#include <yaml-cpp/yaml.h>
#include "mainpub.hpp"
#include <chrono>
#include <memory>


using namespace std::chrono_literals;

int main(int argc, char **argv)
{
	int server = *argv[1];
    //std::string config_file_;
    //config_file_.assign(argv[1]);
	//YAML::Node config = YAML::LoadFile(config_file_);
    //int server = config["Server"].as<int>();
    	switch (server){
		case '1':
		{
			#ifdef ROS1_H

				std::cout << "Receiving ROS1 messages" << std::endl;
				/*
				  ros::init(argc, argv, "image_converter");
  				  ImageConverter ic;
  			      ros::spin();
			      ros::shutdown();
				*/
				// Check if video source has been passed as a parameter
				if(argv[2] == NULL) return 1;

				ros::init(argc, argv, "image_publisher");
				ros::NodeHandle nh;
				image_transport::ImageTransport it(nh);
				image_transport::Publisher pub = it.advertise("camserver/rgb", 1);

				// Convert the passed as command line parameter index for the video device to an integer
				std::istringstream video_sourceCmd(argv[2]);
				int video_source;
				// Check if it is indeed a number
				if(!(video_sourceCmd >> video_source)) return 1;

				cv::VideoCapture cap(video_source);
				// Check if video device can be opened with the given index
				if(!cap.isOpened()) return 1;
				cv::Mat frame;
				sensor_msgs::ImagePtr msg;

				ros::Rate loop_rate(5);
				while (nh.ok()) {
					cap >> frame;
					// Check if grabbed frame is actually full with some content
					if(!frame.empty()) {
					msg = cv_bridge::CvImage(std_msgs::Header(), "bgr8", frame).toImageMsg();
					pub.publish(msg);
					cv::waitKey(1);
					}

					ros::spinOnce();
					loop_rate.sleep();
				}
				
			#else
				throw "ERROR: ROS is not available";
			#endif
		 	break;
		}
		case '2':
		{
			#ifdef ROS2_H

				std::cout << "Receiving ROS2 messages" << std::endl;
				
				std::string topic = "camserver/rgb";
				std::string cameraNum = "/dev/video0";
				int fps = 30;
				std::string name = "Camera_Server";

				rclcpp::init(argc, argv);
				rclcpp::spin(std::make_shared<CameraServer>(topic, cameraNum, fps, name));
				rclcpp::shutdown();
			#else
				throw "ERROR: ROS2 is not available";
			#endif
			break;
		}
		default:
		{
			printf("Select right distro of ROS");
            break;
		}
return 0;    
}



}
 