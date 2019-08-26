cmake_minimum_required(VERSION 3.5)
project(carviz)
set(CMAKE_BUILD_TYPE Debug)
# Default to C++14
if(NOT CMAKE_CXX_STANDARD)
  set(CMAKE_CXX_STANDARD 14)
endif()


if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
  add_compile_options(-Wall -Wextra -Wpedantic -Wunused-parameter)
endif()

SET(rosversion "1" CACHE STRING "Some user-specified option")

if(rosversion) 
    message("THIS IS ROS1")

    SET(CMAKE_PREFIX_PATH "${CMAKE_PREFIX_PATH} /home/pankhuri/catkin_ws/install;/opt/ros/melodic")
    SET(SOURCE main.cpp  
          robot/actuators.cpp robot/robot.cpp robot/sensors.cpp  
            gui/gui.cpp gui/threadupdategui.cpp
            gui/widget/cameraswidget.cpp gui/widget/controlvw.cpp gui/widget/laserwidget.cpp 
            config/loader.cpp config/properties.cpp
            comm/cameraClient.cpp comm/communicator.cpp comm/laserClient.cpp comm/motorsClient.cpp comm/pose3dClient.cpp
            comm/src/listenerCamera.cpp comm/src/listenerLaser.cpp comm/src/listenerPose.cpp comm/src/publisherMotors.cpp comm/src/translators.cpp
            ${HEADERS}
            ${RESOURCES}
    )

    find_package(Qt5 REQUIRED Widgets)
    find_package(roscpp REQUIRED)
    find_package(std_msgs REQUIRED)
    find_package(image_transport REQUIRED)
    find_package(sensor_msgs REQUIRED)
    find_package(OpenCV REQUIRED)
    find_package(cv_bridge REQUIRED)
    find_package(Boost 1.65 REQUIRED COMPONENTS system)

    find_package(yaml-cpp REQUIRED)

    if(roscpp_FOUND) 
        message("ROS1 found")
        add_definitions(-DROS1_H) 
        #add_definitions(-DROS2_H)
        SET(ROS1_H ON) 
    ELSE()
        message("ROS1 not found")
        SET(ROS1_H OFF) 
        #SET(ROS2_H OFF)
    endif()

	
    set(GUI_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/gui)
    set(CMAKE_AUTOMOC ON)
    set(CMAKE_INCLUDE_CURRENT_DIR ON)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${Qt5Widgets_EXECUTABLE_COMPILE_FLAGS} ${Qt5Core_EXECUTABLE_COMPILE_FLAGS} ${Qt5Gui_EXECUTABLE_COMPILE_FLAGS} ${Qt5OpenGL_EXECUTABLE_COMPILE_FLAGS}")


    add_definitions(${Qt5Widgets_DEFINITIONS}
                        ${Qt5Core_DEFINITIONS}
                        ${Qt5Gui_DEFINITIONS}
                        ${Qt5OpenGL_DEFINITIONS})


    SET(HEADERS robot/robot.h gui/gui.h gui/widget/cameraswidget.h gui/widget/controlvw.h)
    SET(RESOURCES resources.qrc)

    include_directories(${Qt5Widgets_INCLUDE_DIRS}
                        ${Qt5Core_INCLUDE_DIRS}
                        ${Qt5Gui_INCLUDE_DIRS}
                        ${Qt5OpenGL_INCLUDE_DIRS}
                        ${OpenCV_INCLUDE_DIR}
                        #${Ice_INCLUDE_DIR}
                        ${INTERFACES_CPP_DIR}
                        ${LIBS_DIR}/
                        ${Boost_INCLUDE_DIRS}
                        ${CMAKE_CURRENT_SOURCE_DIR}
                        ${config_INCLUDE_DIRS}
                        ${jderobottypes_INCLUDE_DIRS}
                        ${carviz_INCLUDE_DIRS}
                        ${roscpp_INCLUDE_DIRS}
                        ${ZLIB_INCLUDE_DIRS}
                        ${roscpp_INCLUDE_DIRS}   
                        ${std_msgs_INCLUDE_DIRS}
                        ${image_transport_INCLUDE_DIRS} 
                        ${sensor_msgs_INCLUDE_DIRS} )


  	include_directories(carviz)
	  include_directories(config)
	

    link_directories(${JDE_LIBS}
        ${easyiceconfig_LIBRARY_DIRS}
        ${carviz_LIBRARY_DIRS}
    )

    add_executable( carViz ${SOURCE} ${INTERFACES_CPP_DIR})
			       
    target_link_libraries(carViz Qt5::Widgets
                        ${Qt5Widgets_LIBRARIES}
                        ${YAML_CPP_LIBRARIES}
                        ${Boost_LIBRARIES}
                        ${roscpp_LIBRARIES}
                        ${std_msgs_LIBRARIES}
                        ${image_transport_LIBRARIES}
                        ${OpenCV_LIBRARIES} 
                        ${cv_bridge_LIBRARIES}
                        ${sensor_msgs_LIBRARIES}
                        ${Qt5Core_LIBRARIES}
                        ${Qt5Gui_LIBRARIES}
                        ${Qt5OpenGL_LIBRARIES}
                        ${CMAKE_THREAD_LIBS_INIT}
                        ${OpenCV_LIBRARIES}
                        ${config_LIBRARIES}
                        ${carviz_LIBRARIES}                
                        ${catkin_LIBRARIES}
                        ${GLOG_LIBRARIES}
                        ${ZLIB_LIBRARIES}
       
            )
    install(TARGETS carViz
    DESTINATION ${CMAKE_INSTALL_PREFIX}/bin/
    COMPONENT carviz
    )

    INSTALL (FILES ${CMAKE_CURRENT_SOURCE_DIR}/carViz.yml 
		DESTINATION ${CMAKE_INSTALL_PREFIX}/share/jderobot/conf 
		COMPONENT carviz)

else()
    message("THIS IS ROS2")

    SET(ENV{PYTHONPATH} "/opt/ros/dashing/lib/python3.6/site-packages/")
    SET(CMAKE_PREFIX_PATH "${CMAKE_PREFIX_PATH} home/pankhuri/ros2_ws/install;/opt/ros/dashing")

    find_package(Qt5 REQUIRED Widgets)
    find_package(ament_cmake REQUIRED)
    find_package(rclcpp REQUIRED)
    find_package(sensor_msgs REQUIRED)
    find_package(image_transport REQUIRED)
    find_package(sensor_msgs REQUIRED)
    find_package(nav_msgs REQUIRED)
    find_package(OpenCV REQUIRED)
    find_package(cv_bridge REQUIRED)
    find_package (Threads)
    find_package(Boost 1.65 REQUIRED COMPONENTS system)
    find_package(yaml-cpp REQUIRED)

    if(rclcpp_FOUND) 
        message("ROS2 found")
        #add_definitions(-DROS1_H) 
        add_definitions(-DROS2_H)
        SET(ROS2_H ON) 
        #SET(ROS1_H OFF) 

    ELSE()
        message("ROS2 not found")
        #SET(ROS1_H OFF) 
        SET(ROS2_H OFF)
    endif()

    SET(SOURCE main.cpp  
        robot/actuators.cpp robot/robot.cpp robot/sensors.cpp  
        gui/gui.cpp gui/threadupdategui.cpp
        gui/widget/cameraswidget.cpp gui/widget/controlvw.cpp gui/widget/laserwidget.cpp 
        config/loader.cpp config/properties.cpp
        comm/cameraClient.cpp comm/communicator.cpp comm/laserClient.cpp comm/motorsClient.cpp comm/pose3dClient.cpp
        comm/ros2src/listenerCameraros2.cpp comm/ros2src/listenerLaserros2.cpp comm/ros2src/listenerPoseros2.cpp comm/ros2src/publisherMotorsros2.cpp comm/ros2src/translatorsros2.cpp
        ${HEADERS}
        ${RESOURCES}
      )
	
    set(GUI_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/gui)
    set(CMAKE_AUTOMOC ON)
    set(CMAKE_INCLUDE_CURRENT_DIR ON)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${Qt5Widgets_EXECUTABLE_COMPILE_FLAGS} ${Qt5Core_EXECUTABLE_COMPILE_FLAGS} ${Qt5Gui_EXECUTABLE_COMPILE_FLAGS} ${Qt5OpenGL_EXECUTABLE_COMPILE_FLAGS}")


    add_definitions(${Qt5Widgets_DEFINITIONS}
                        ${Qt5Core_DEFINITIONS}
                        ${Qt5Gui_DEFINITIONS}
                        ${Qt5OpenGL_DEFINITIONS}
    )


    SET(HEADERS robot/robot.h gui/gui.h gui/widget/cameraswidget.h gui/widget/controlvw.h)
    SET(RESOURCES resources.qrc)

    include_directories(${rclcpp_INCLUDE_DIRS}   
                        ${std_msgs_INCLUDE_DIRS}
                        ${image_transport_INCLUDE_DIRS} 
                        ${sensor_msgs_INCLUDE_DIRS} )

    include_directories(
        ${Qt5Widgets_INCLUDE_DIRS}
        ${Qt5Core_INCLUDE_DIRS}
        ${Qt5Gui_INCLUDE_DIRS}
        ${Qt5OpenGL_INCLUDE_DIRS}
        ${OpenCV_INCLUDE_DIR}
        ${INTERFACES_CPP_DIR}
        ${LIBS_DIR}/
        ${Boost_INCLUDE_DIRS}
        ${CMAKE_CURRENT_SOURCE_DIR}
        ${config_INCLUDE_DIRS}
        ${jderobottypes_INCLUDE_DIRS}
        ${carviz_INCLUDE_DIRS}
        ${rclcpp_INCLUDE_DIRS}
        ${ZLIB_INCLUDE_DIRS}
    )

    include_directories(
        
          ${rclcpp_INCLUDE_DIRS}
          ${rmw_connext_cpp_INCLUDE_DIRS}
          ${std_interfaces_INCLUDE_DIRS}
          ${cv_bridge_INCLUDE_DIRS}
          )

    include_directories(carviz)
    include_directories(config)
    

    link_directories(${JDE_LIBS}
          ${easyiceconfig_LIBRARY_DIRS}
          ${carviz_LIBRARY_DIRS}
      )

    add_executable( carViz ${SOURCE} ${INTERFACES_CPP_DIR})
			       
    target_link_libraries(carViz Qt5::Widgets
          ${Qt5Widgets_LIBRARIES}
          ${YAML_CPP_LIBRARIES}
          ${Boost_LIBRARIES}
          ${rclcpp_LIBRARIES}
          ${std_msgs_LIBRARIES}
          ${image_transport_LIBRARIES}
          ${OpenCV_LIBRARIES} 
          ${cv_bridge_LIBRARIES}
          ${sensor_msgs_LIBRARIES}
          ${Qt5Core_LIBRARIES}
          ${Qt5Gui_LIBRARIES}
          ${Qt5OpenGL_LIBRARIES}
          ${CMAKE_THREAD_LIBS_INIT}
          ${OpenCV_LIBRARIES}
          ${config_LIBRARIES}
          ${carviz_LIBRARIES}  
          ${GLOG_LIBRARIES}
          ${ZLIB_LIBRARIES}
          )
    ament_target_dependencies(carViz "rclcpp" "std_msgs" "sensor_msgs" "OpenCV" "yaml-cpp" "cv_bridge" "nav_msgs")
  
    install(TARGETS carViz
      DESTINATION ${CMAKE_INSTALL_PREFIX}/bin/
      COMPONENT carviz
      )

    INSTALL (FILES ${CMAKE_CURRENT_SOURCE_DIR}/carViz.yml 
      DESTINATION ${CMAKE_INSTALL_PREFIX}/share/jderobot/conf 
      COMPONENT carviz)
endif()