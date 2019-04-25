#ifndef THREADGUI_H
#define THREADGUI_H

#include <QtWidgets>
#include <iostream>
#include <sys/time.h>
#include "mainwindow.h"
#include "../sensors/sensors.h"

#define cycle_gui 40 //miliseconds


class threadGUI:public QThread
{
public:
    threadGUI(Sensors* sensors, Ice::CommunicatorPtr ic);

private:
    MainWindow* gui;
    Sensors* sensors;
protected:
    void run();
};

#endif // THREADGUI_H
