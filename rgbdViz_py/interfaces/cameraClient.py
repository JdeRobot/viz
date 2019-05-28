#
#  Copyright (C) 1997-2016 JDE Developers Team
#
#  This program is free software: you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation, either version 3 of the License, or
#  (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License
#  along with this program.  If not, see http://www.gnu.org/licenses/.
#  Authors :
#       Aitor Martinez Fernandez <aitor.martinez.fernandez@gmail.com>
#

import traceback
import jderobot
import numpy as np
import threading
import Ice
from interfaces.threadSensor import ThreadSensor


class Camera:

    def __init__(self, ic, prefix):
        self.lock = threading.Lock()

        try:
            basecamera = ic.propertyToProxy(prefix+".Proxy")
            self.proxy = jderobot.CameraPrx.checkedCast(basecamera)
            prop = ic.getProperties()
            self.imgFormat = prop.getProperty(prefix+".Format")
            if not self.imgFormat:
                self.imgFormat = "RGB8"

            self.update()

            if not self.proxy:
                print ('Interface ' + prefix + ' not configured')

        except Ice.ConnectionRefusedException:
            print(prefix + ': connection refused')

        except:
            traceback.print_exc()
            exit(-1)

    def update(self):
        if self.hasproxy():
            image = self.proxy.getImageData(self.imgFormat)
            height = image.description.height
            width = image.description.width

            self.lock.acquire()
            self.image = image
            self.height = height
            self.width = width
            self.lock.release()

    def getImage(self):	   
        if self.hasproxy():
            self.lock.acquire()
            img = np.zeros((self.height, self.width, 3), np.uint8)
            img = np.frombuffer(self.image.pixelData, dtype=np.uint8)
            img.shape = self.height, self.width, 3

            self.lock.release()
            return img

        return None

    def getHeight(self):
        if self.hasproxy():
            self.lock.acquire()
            tmp = self.height
            self.lock.release()
            return tmp
        return None

    def getWidth(self):
        if self.hasproxy():
            self.lock.acquire()
            tmp = self.width
            self.lock.release()
            return tmp
        return None

    def hasproxy (self):
        return hasattr(self,"proxy") and self.proxy




class CameraClient:
    def __init__(self,ic,prefix):
        self.camera = Camera(ic,prefix)

        self.kill_event = threading.Event()
        self.thread = ThreadSensor(self.camera, self.kill_event)
        #self.thread = ThreadSensor(self.camera)
        self.thread.daemon = True

        self.start()

    # if client is stopped you can not start again, Threading.Thread raised error
    def start(self):
        self.kill_event.clear()
        self.thread.start()

    # if client is stopped you can not start again
    def stop(self):
        self.kill_event.set()

    def getImage(self):
        return self.camera.getImage()

    def getHeight(self):
        return self.camera.getHeight()

    def getWidth(self):
        return self.camera.getWidth()

    def hasproxy (self):
        return self.camera.hasproxy()
