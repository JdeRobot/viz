                                TurtlebotVizWeb
                        ===========================
////////////////////////////////////////////////////////////////////////////////

                           E X E C U T I O N

////////////////////////////////////////////////////////////////////////////////

Follow these simple steps to launch the example:

1. First of all, install the dependencies:
    `$ npm install`
2. Run gazebo with ArDrone world in other shell(you need have installed JdeRobot package):
    `gazebo kobuki-simple.world`
3. Finally, run DroneVizWeb component:
    `$ npm start`

The configuration files are ready to run the example, but make sure you have all the interfaces well configured first.
In order to use it via ROS topics:

1) Launch the ROS master:

`roscore`

2) Launch the Kobuki controller (which creates the topics and subscribes to them):

`roslaunch kobuki_node minimal.launch`

3) Launch the rosbridge interface (from a web service to ROS messages):

`roslaunch rosbridge_server rosbridge_websocket.launch`

    Note: you might need to install it beforehand: `sudo apt install ros-kinetic-rosbridge-server`

4) Launch the component, and select "ROS" in the configuration menu. The default settings should be capable of connect to the ROS bridge service (port 9090).

////////////////////////////////////////////////////////////////////////////////

## Full tutorial
https://jderobot.org/Tutorials#Simulated_TurtleBot_.2B_KobukiViewer-web*

*This tutorial is done to run with a browser, not Electron, the only difference is how it should be run

