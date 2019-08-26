#ifdef ROS1S_H
   #include "ros/ros.h"
   #include "std_msgs/String.h"   
   #include <image_transport/image_transport.h>
   #include <opencv2/highgui/highgui.hpp>
   #include <cv_bridge/cv_bridge.h>
   #include "ros/listenercameraros.hpp"

#endif
#ifdef ROS2S_H
    #include "rclcpp/rclcpp.hpp"
    #include "std_msgs/msg/string.hpp"  
    #include "sensor_msgs/msg/image.hpp"
    #include <opencv2/core/core.hpp>
    #include <opencv2/highgui/highgui.hpp>
    #include "ros2/listenercameraros2.hpp"

    

#endif

