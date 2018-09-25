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
import threading
import Ice


class ArDroneExtraIceClient:
    '''
        ArDroneExtra Connector. Recives image from Ice interface when you run update method.
    '''

    def __init__(self, jdrc, prefix):
        '''
        ArDroneExtra Contructor.
        Exits When it receives a Exception diferent to Ice.ConnectionRefusedException

        @param jdrc: Comm Communicator
        @param prefix: Name of client in config file

        @type jdrc: Comm Communicator
        @type prefix: String
        '''
        self.lock = threading.Lock()
        try:
            ic = jdrc.getIc()
            proxyStr = jdrc.getConfig().getProperty(prefix+".Proxy")
            base = ic.stringToProxy(proxyStr)
            self.proxy = jderobot.ArDroneExtraPrx.checkedCast(base)
            prop = ic.getProperties()

            if not self.proxy:
                print ('Interface ' + prefix + ' not configured')

        except Ice.ConnectionRefusedException:
            print(prefix + ': connection refused')

        except:
            traceback.print_exc()
            exit(-1)


    def start(self):
        pass
    def stop(self):
        pass

    def takeoff(self):
        if self.hasproxy():
            self.lock.acquire()
            self.proxy.takeoff()
            self.lock.release()
        
    def land(self):
        if self.hasproxy():
            self.lock.acquire()
            self.proxy.land()
            self.lock.release()
        
    def toggleCam(self):
        if self.hasproxy():
            self.lock.acquire()
            self.proxy.toggleCam()
            self.lock.release()
              
    def reset(self):
        if self.hasproxy():
            self.lock.acquire()
            self.proxy.reset()
            self.lock.release()
        
    def record(self,record):
        if self.hasproxy():
            self.lock.acquire()
            self.proxy.recordOnUsb(record)
            self.lock.release()

    def hasproxy (self):
        return hasattr(self,"proxy") and self.proxy