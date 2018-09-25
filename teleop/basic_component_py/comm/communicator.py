import Ice
import rospy

from .laserClient import getLaserClient
from .cameraClient import getCameraClient
from .pose3dClient import getPose3dClient
from .motorsClient import getMotorsClient
from .rgbdClient import getRgbdClient
from .ardroneextraClient import getArDroneExtraClient
from .navdataClient import getNavdataClient
from .cmdvelClient import getCMDVelClient
from .ptMotorsClient import getPTMotorsClient
from .bumperClient import getBumperClient
from .sonarClient import getSonarClient
from .tools import server2int



class Communicator:
	'''
    Comm Communicator class

    '''
	def __init__ (self, config, prefix):
		'''
	    Communicator constructor

	    @param config: configuration of communicator

	    @type config: dict

	    '''
		rosserver = False
		iceserver = False

		self.__node = None
		self.__ic = None
		self.config = config

		ymlNode = self.config.getProperty(prefix)
		for i in ymlNode:
			if type(ymlNode[i]) is dict and server2int(ymlNode[i]["Server"]) == 1:
				iceserver = True
			if type(ymlNode[i]) is dict and server2int(ymlNode[i]["Server"]) == 2:
				rosserver = True

			if type(ymlNode[i]) is dict and server2int(ymlNode[i]["Server"]) == 3:
				iceserver = True

		if rosserver:
			self.__node = rospy.init_node(ymlNode["NodeName"], anonymous=True)
		if iceserver:
			id = Ice.InitializationData()
			self.__ic = Ice.initialize(None, id)

	def destroy (self):
		'''
	    Destroys ROS Node and Ice Communicator if it is necessary.

	    '''
		if self.__node:
			rospy.signal_shutdown("Node Closed")
		if self.__ic:
			self.__ic.shutdown()
			self.__ic.destroy()

	def getNode(self):
		return self.__node

	def getIc(self):
		return self.__ic

	def getConfig(self):
		return self.config


	def getCameraClient(self, name):
		'''
	    Returns a Camera client with the configration indicated by the name

	    @param name: name of the client in the config

	    @type name: String

	    '''
		return getCameraClient(self, name)

	def getMotorsClient(self, name):
		'''
	    Returns a Motors client with the configration indicated by the name

	    @param name: name of the client in the config

	    @type name: String

	    '''
		return getMotorsClient(self, name)

	def getPose3dClient(self, name):
		'''
	    Returns a Pose3D client with the configration indicated by the name

	    @param name: name of the client in the config

	    @type name: String

	    '''
		return getPose3dClient(self, name)

	def getLaserClient(self, name):
		'''
	    Returns a Laser client with the configration indicated by the name

	    @param name: name of the client in the config

	    @type name: String

	    '''
		return getLaserClient(self, name)


	def getRgbdClient(self, name):
		'''
	    Returns a RGBD client with the configration indicated by the name

	    @param name: name of the client in the config

	    @type name: String

	    '''
		return getRgbdClient(self, name)

	def getCMDVelClient(self, name):
		'''
	    Returns a CMDVel client with the configration indicated by the name

	    @param name: name of the client in the config

	    @type name: String

	    '''
		return getCMDVelClient(self, name)

	def getNavdataClient(self, name):
		'''
	    Returns a Navdata client with the configration indicated by the name

	    @param name: name of the client in the config

	    @type name: String

	    '''
		return getNavdataClient(self, name)

	def getArDroneExtraClient(self, name):
		'''
	    Returns a ArDroneExtra client with the configration indicated by the name

	    @param name: name of the client in the config

	    @type name: String

	    '''
		return getArDroneExtraClient(self, name)

	def getPTMotorsClient(self, name):
		'''
	    Returns a PTMotors client with the configration indicated by the name

	    @param name: name of the client in the config

	    @type name: String

	    '''
		return getPTMotorsClient(self, name)

	def getBumperClient(self, name):
		'''
	    Returns a Bumper client with the configration indicated by the name

	    @param name: name of the client in the config

	    @type name: String

	    '''
		return getBumperClient(self, name)

	def getSonarClient(self, name):
		'''
	    Returns a Sonar client with the configration indicated by the name

	    @param name: name of the client in the config

	    @type name: String

	    '''
		return getSonarClient(self, name)
