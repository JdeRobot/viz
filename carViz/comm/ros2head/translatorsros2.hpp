#pragma once
#include </opt/jderobot/include/jderobot/types/image.h>
#include </opt/jderobot/include/jderobot/types/cmdvel.h>

#include </opt/jderobot/include/jderobot/types/navdataData.h>

#include </opt/jderobot/include/jderobot/types/pose3d.h>
#include </opt/jderobot/include/jderobot/types/laserData.h>


#include "image_transport/image_transport.h"
#include "rclcpp/rclcpp.hpp"
#include "sensor_msgs/msg/image.hpp"
#include <sensor_msgs/msg/compressed_image.hpp>
#include "sensor_msgs/msg/laser_scan.hpp"
#include <sensor_msgs/image_encodings.hpp>
#include "geometry_msgs/msg/twist.hpp"
#include "nav_msgs/msg/odometry.hpp"
#include "opencv2/highgui/highgui.hpp"
#include "opencv2/imgproc/imgproc.hpp"
#include <opencv2/opencv.hpp>
#include <cv_bridge/cv_bridge.h>


namespace Comm {

	/**
	 * @brief translate ROS Image messages to JdeRobot Image
	 *
	 *
	 * @param ROS Image Message
	 * 
	 *
	 * @return Image translated from ROS Message 
	 */
	JdeRobotTypes::Image translate_image_messages(const sensor_msgs::msg::Image::SharedPtr image_msg);
	/**
	 * @brief translate ROS LaserScan messages to JdeRobot LaserData
	 *
	 *
	 * @param ROS laser Scan Message
	 * 
	 *
	 * @return LaserData translated from ROS Message 
	 */
	JdeRobotTypes::LaserData translate_laser_messages(const sensor_msgs::msg::LaserScan::SharedPtr scan);
	/**
	 * @brief Translates from 32FC1 Image format to RGB. Inf values are represented by NaN, when converting to RGB, NaN passed to 0 
	 *
	 *
	 * @param ROS Image Message
	 * 
	 *
	 * @return Image translated from ROS Message 
	 */
	void depthToRGB(const cv::Mat& float_img, cv::Mat& rgb_img);

	/**
	 * @brief translate Jderobot CMDVel to ROS Twist messages
	 *
	 *
	 * @param float_img, image in 32FC1
	 * @param rgb_img, container for image in RGB
	 * 
	 *
	 */
	geometry_msgs::msg::Twist translate_twist_messages(JdeRobotTypes::CMDVel cmdvel );
	/**
	 * @brief translate ROS Odometry messages to JdeRobot Pose3D
	 *
	 *
	 * @param ROS Odometry Message
	 * 
	 *
	 * @return Pose3D translated from ROS Message 
	 */
	JdeRobotTypes::Pose3d translate_odometry_messages(const nav_msgs::msg::Odometry::SharedPtr odom_msg);
	/**
	 * @brief Extracts Yaw angle from Quaternion
	 *
	 * @param Quaternion
	 * 
	 * @return Yaw Angle 
	 */
	float quat2Yaw(std::vector <float> q);

	/**
	 * @brief Extracts Pitch angle from Quaternion
	 *
	 * @param Quaternion
	 * 
	 * @return Pitch Angle 
	 */
	float quat2Pitch(std::vector <float> q);

	/**
	 * @brief Extracts Roll angle from Quaternion
	 *
	 * @param Quaternion
	 * 
	 * @return Roll Angle 
	 */
	float quat2Roll(std::vector <float> q);





}
