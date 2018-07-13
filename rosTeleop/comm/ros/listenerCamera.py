import rospy
import sys, time
from sensor_msgs.msg import Image as ImageROS
from sensor_msgs.msg import CompressedImage
import threading
from math import pi as PI
import numpy as np
from jderobotTypes import Image
import cv2
from cv_bridge import CvBridge, CvBridgeError


MAXRANGE = 8 #max length received from imageD
MINRANGE = 0


def depthToRGB8(float_img_buff):
    '''
    Translates from 32FC1 Image format to RGB. Inf values are represented by NaN, when converting to RGB, NaN passed to 0 

    @param float_img_buff: ROS Image to translate

    @type img: ros image

    @return a Opencv RGB image

    '''
    float_img = np.zeros((float_img_buff.shape[0], float_img_buff.shape[1], 1), dtype = "float32")
    float_img.data = float_img_buff.data


    gray_image=cv2.convertScaleAbs(float_img, alpha=255/MAXRANGE)
    cv_image = cv2.cvtColor(gray_image, cv2.COLOR_GRAY2RGB)

    return cv_image


def imageMsg2Image(img, bridge):
    '''
    Translates from ROS Image to JderobotTypes Image. 

    @param img: ROS Image to translate
    @param bridge: bridge to do translation

    @type img: sensor_msgs.msg.Image
    @type brige: CvBridge

    @return a JderobotTypes.Image translated from img

    '''
    print img
    image = Image()

    image.width = img.width
    image.height = img.height
    image.format = ""
    image.timeStamp = img.header.stamp.secs + (img.header.stamp.nsecs *1e-9)
    cv_image=0
    if (img.encoding == "32FC1"):
        gray_img_buff = bridge.imgmsg_to_cv2(img, "32FC1")
        cv_image  = depthToRGB8(gray_img_buff)
    else:
        cv_image = bridge.imgmsg_to_cv2(img, "rgb8")
    image.data = cv_image
    return image

class ListenerCamera:
    '''
        ROS Camera (Image) Subscriber. Camera Client to Receive Images from ROS nodes.
    '''
    def __init__(self, topic):
        '''
        ListenerCamera Constructor.

        @param topic: ROS topic to subscribe
        
        @type topic: String

        '''
        self.topic = topic
        self.data = Image()
        self.sub = None
        self.lock = threading.Lock()

        self.bridge = CvBridge()
        self.start()
 
    def __callback (self, img):
        '''
        Callback function to receive and save Images. 

        @param img: ROS Image received
        
        @type img: sensor_msgs.msg.Image

        '''
         #### direct conversion to CV2 ####
        np_arr = np.fromstring(img.data, np.uint8)
        #image_np = cv2.imdecode(np_arr, cv2.CV_LOAD_IMAGE_COLOR)
        image_np = cv2.imdecode(np_arr, cv2.IMREAD_COLOR) # OpenCV >= 3.0:
        
        #### Feature detectors using CV2 #### 
        # "","Grid","Pyramid" + 
        # "FAST","GFTT","HARRIS","MSER","ORB","SIFT","STAR","SURF"
        method = "GridFAST"
        #feat_det = cv2.FeatureDetector_create(method)
	feat_det = cv2.ORB_create()
        time1 = time.time()

        # convert np image to grayscale
        featPoints = feat_det.detect(
            cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY))
        time2 = time.time()

        self.lock.acquire()
        self.data = image_np
        self.lock.release()
        
    def stop(self):
        '''
        Stops (Unregisters) the client.

        '''
        self.sub.unregister()

    def start (self):
        '''
        Starts (Subscribes) the client.

        '''
	print CompressedImage
        self.sub = rospy.Subscriber(self.topic, CompressedImage, self.__callback)
        
    def getImage(self):
        '''
        Returns last Image. 

        @return last JdeRobotTypes Image saved

        '''
        self.lock.acquire()
        image = self.data
        self.lock.release()
        
        return image

    def hasproxy (self):
        '''
        Returns if Subscriber has ben created or not. 

        @return if Subscriber has ben created or not (Boolean)

        '''
        return hasattr(self,"sub") and self.sub


