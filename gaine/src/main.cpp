#include <Arduino.h>

#include "Config.h"

#ifdef COORDINATOR
#include "Coordinator.h"
#endif

#ifdef ROUTER
#include "Router.h"
#endif

#ifdef ENCODER
#include "Encoder.h"
#endif

#ifdef GYRO
#include "Gyro.h"
#endif

void setup()
{
#ifdef COORDINATOR
    coorSetup();
#endif
#ifdef ROUTER
    routerSetup();
#endif
#ifdef ENCODER
    encoderSetup();
#endif
#ifdef GYRO
    gyroSetup();
#endif
}

void loop()
{
#ifdef COORDINATOR
    coorRead();
#endif
#ifdef ROUTER
    routerTransmit();
#endif
#ifdef ENCODER
    encoderLoop();
#endif
#ifdef GYRO
    gyroLoop();
#endif
}