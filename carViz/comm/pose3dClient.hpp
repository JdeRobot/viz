#include </opt/jderobot/include/jderobot/types/laserData.h>
#include "communicator.hpp"
#include "interfaces/pose3dClient.hpp"

#ifdef ROS1_H
#include "header/listenerPose.hpp"
#endif

#ifdef ROS2_H
#include "ros2head/listenerPoseros2.hpp"
#endif

namespace Comm {

	/**
	 * @brief make a Pose3dClient using propierties
	 *
	 *
	 * @param communicator that contains properties
	 * @param prefix of client Propierties (example: "carViz.Pose3d")
	 * 
	 *
	 * @return null if propierties are wrong
	 */
	Pose3dClient* getPose3dClient(Comm::Communicator* jdrc, std::string prefix);

} 
