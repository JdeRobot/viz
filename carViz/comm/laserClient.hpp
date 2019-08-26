
#include </opt/jderobot/include/jderobot/types/laserData.h>
#include "communicator.hpp"
#include "interfaces/laserClient.hpp"

#ifdef ROS1_H
#include "header/listenerLaser.hpp"
#endif

#ifdef ROS2_H
#include "ros2head/listenerLaserros2.hpp"
#endif

#include <iostream>

namespace Comm {

	/**
	 * @brief make a LaserClient using properties
	 *
	 *
	 * @param communicator that contains properties
	 * @param prefix of client Propierties (example: "carViz.Laser")
	 * 
	 *
	 * @return null if propierties are wrong
	 */
	LaserClient* getLaserClient(Comm::Communicator* jdrc, std::string prefix);


} 
