#ifndef CONFIG_H
#define CONFIG_H

// Defining the module type
// Change into ROUTER or COORDINATOR
// #define ROUTER
#define COORDINATOR
// #define GYRO

// XBee pin configuration
// XBee Rx -> Pin 2 Arduino
// XBee Tx -> Pin 3 Arduino
#ifdef COORDINATOR
#define XBEE_RX 19
#define XBEE_TX 18
#define SIREN 47
#endif
#ifdef GYRO
#define XBEE_RX 2
#define XBEE_TX 3
#endif
#ifdef ROUTER
#define XBEE_RX 8
#define XBEE_TX 9
#endif

#define SOIL_PIN A5

// Define encoder pin
#define ENCODER_A 2
#define ENCODER_B 3

#define XBEE_BAUD 9600

#define EEPROM_ADDR 7

#define IMP_NUM 0.0f

#endif
