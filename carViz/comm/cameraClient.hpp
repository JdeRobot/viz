
#include </opt/jderobot/include/jderobot/types/image.h>


#include "communicator.hpp"
#include "interfaces/cameraClient.hpp"

#ifdef ROS1_H
#include "header/listenerCamera.hpp"
#endif

#ifdef ROS2_H
#include "ros2head/listenerCameraros2.hpp"
#endif

namespace Comm {

	/**
	 * @brief make a CameraClient using properties
	 *
	 *
	 * @param communicator that contains properties
	 * @param prefix of client Properties (example: "carViz.Camera")
	 * 
	 *
	 * @return null if properties are wrong
	 */
	CameraClient* getCameraClient(Comm::Communicator* jdrc, std::string prefix);


}
