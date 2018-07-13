#!/usr/bin/python2
# -*- coding: utf-8 -*-
#
#  Copyright (C) 1997-2016 JdeRobot Developers Team
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

import sys

import comm
import cameraRos
from gui.threadGUI import ThreadGUI
from gui.GUI import MainWindow
from PyQt5.QtWidgets import QApplication
import config

import signal

signal.signal(signal.SIGINT, signal.SIG_DFL)


if __name__ == '__main__':
    cfg = config.load(sys.argv[1])

    #starting comm
    jdrc= comm.init(cfg, 'basic_component')


    #camera = jdrc.getCameraClient("basic_component.Camera")
    motors = jdrc.getMotorsClient("basic_component.Motors")

    app = QApplication(sys.argv)
    frame = MainWindow()
    frame.setMotors(motors)
    #frame.setCamera(camera)
    frame.show()


    t2 = ThreadGUI(frame)
    t2.daemon = True
    t2.start()
    camera = cameraRos.image_feature()
    sys.exit(app.exec_())
