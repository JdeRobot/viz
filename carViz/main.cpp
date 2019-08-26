#pragma once
#include "robot/robot.h"
#include "robot/sensors.h"
#include "robot/actuators.h"

#include "gui/threadupdategui.h"

#include "config/config.h"
#include "comm/communicator.hpp"
#include <thread>


using namespace std;
int main(int argc, char *argv[])
{
    QApplication app(argc, argv);

    #ifdef ROS1_H
    try {

        Config::Properties props = Config::load(argc, argv);

         //-----------------Comm----------------//
         Comm::Communicator* jdrc = new Comm::Communicator(props);

         // Variables Compartidas
         // Robot -> Sensores, navegacion, actuadores
         Robot *robot = new Robot(jdrc);

        
         ThreadUpdateGUI* thread_update_gui = new ThreadUpdateGUI(robot, props);
         thread_update_gui->start();

    } 
     catch (const char* msg) {
        std::cerr << msg << std::endl;
        exit(-1);
    }

    app.exec();
    #endif

    #ifdef ROS2_H
    
    using rclcpp::Node;
    using rclcpp::executors::SingleThreadedExecutor;
    Config::Properties props = Config::load(argc, argv);



        //-----------------Comm----------------//

    Comm::Communicator* jdrc = new Comm::Communicator(props);
    rclcpp::init(argc,argv);

        // Variables Compartidas
        // Robot -> Sensores, navegacion, actuadores

    Robot *robot = new Robot(jdrc);
        

    std::shared_ptr<Comm::ListenerCamera> ptr1((Comm::ListenerCamera*)robot->sensors->camera1);
    std::shared_ptr<Comm::ListenerLaser> ptr2((Comm::ListenerLaser*)robot->sensors->laserClient);
    std::shared_ptr<Comm::ListenerPose> ptr3((Comm::ListenerPose*)robot->sensors->poseClient);
    std::shared_ptr<Comm::PublisherMotors> ptr4((Comm::PublisherMotors*)robot->actuators->motorsClient);


    rclcpp::executors::SingleThreadedExecutor exec;
    exec.add_node(ptr1);
    exec.add_node(ptr2);
    exec.add_node(ptr3);
    exec.add_node(ptr4);



    auto spin_exec = [&exec]() {
        exec.spin();
    };

    std::thread execution_thread(spin_exec);


    ThreadUpdateGUI* thread_update_gui = new ThreadUpdateGUI(robot, props);
    thread_update_gui->start();
   
    app.exec();

    execution_thread.join();


    #endif
}
