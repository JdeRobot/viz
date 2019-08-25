#pragma once
#include </opt/jderobot/include/jderobot/types/cmdvel.h>
#include "communicator.hpp"
#include "interfaces/motorsClient.hpp"

#ifdef ROS2_H
#include "ros2head/publisherMotorsros2.hpp"
#endif

#ifdef ROS1_H
#include "header/publisherMotors.hpp"
#endif



namespace Comm {

	/**
	 * @brief make a MotorsClient using propierties
	 *
	 *
	 * @param communicator that contains properties
	 * @param prefix of client Propierties (example: "carViz.Motors")
	 * 
	 *
	 * @return null if propierties are wrong
	 */
	MotorsClient* getMotorsClient(Comm::Communicator* jdrc, std::string prefix);


} 
