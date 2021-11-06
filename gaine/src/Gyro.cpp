#include "Config.h"

#ifdef GYRO

#include <Arduino.h>

#include "Gyro.h"

#include <Wire.h>

// #include "MPU6050.h"
#include <SoftwareSerial.h>

// MPU variables:
// MPU6050 accelgyro;
int16_t ax, ay, az;
int16_t gx, gy, gz;

SoftwareSerial XBeeSerial(XBEE_RX, XBEE_TX);

// #define DEBUG

#ifdef DEBUG
#define LOG_PRINT(x) Serial.print(x)
#define LOG_PRINTT(x, t) Serial.print(x, t)
#define LOG_PRINTLN(x) Serial.println(x)
#define LOG_PRINTLNT(x, t) Serial.println(x, t)
#else
#define LOG_PRINT(x)
#define LOG_PRINTT(x, t)
#define LOG_PRINTLN(x)
#define LOG_PRINTLNT(x, t)
#endif

#define TRIG 12 //Module pins
#define ECHO 11

void sendData(String);
void receiveData(void);
long readWaterLevel(void);

byte counter = -1;
byte length1 = 0x00;
byte length2 = 0x00;
byte _lengthRx = 0x00;
byte rx[50] = {};

const int MPU = 0x68;

void gyroSetup()
{

    Wire.begin();
    Serial.begin(9600);
    XBeeSerial.begin(XBEE_BAUD);

    Wire.beginTransmission(MPU);
    Wire.write(0x6B); //make the reset (place a 0 into the 6B register)
    Wire.write(0);
    Wire.endTransmission(true);
    // accelgyro.initialize();

    pinMode(TRIG, OUTPUT); // Initializing Trigger Output and Echo Input
    pinMode(ECHO, INPUT_PULLUP);
}

float xa, ya, za, roll, pitch, wl;
long waterLevelCounter = 0;
int distanceCounter = 0;

void gyroLoop()
{
    wl = readWaterLevel();
    Wire.beginTransmission(MPU); //read the sensor data
    Wire.write(0x3B);
    Wire.endTransmission(false);
    Wire.requestFrom(MPU, 6, true); //get six bytes accelerometer data

    xa = Wire.read() << 8 | Wire.read();
    ya = Wire.read() << 8 | Wire.read();
    za = Wire.read() << 8 | Wire.read();

    roll = atan2(ya, za) * 180.0 / PI;
    pitch = atan2(-xa, sqrt(ya * ya + za * za)) * 180.0 / PI;

    sendData("{\"x\":" + String(roll, 1) + ",\"y\":" + String(pitch, 1) + ",\"wl\":" + String(wl, 1) + ",\"z\":" + String(0) + "}");
    Serial.println("{\"x\":" + String(roll, 1) + ",\"y\":" + String(pitch, 1) + ",\"wl\":" + String(wl, 1) + ",\"z\":" + String(0) + "}");
}

long readWaterLevel()
{
    waterLevelCounter = 0;
    distanceCounter = 0;
    for (int i = 0; i < 45; i++)
    {
        digitalWrite(TRIG, LOW); // Set the trigger pin to low for 2uS
        delayMicroseconds(2);

        digitalWrite(TRIG, HIGH); // Send a 10uS high to trigger ranging
        delayMicroseconds(20);

        digitalWrite(TRIG, LOW);                   // Send pin low again
        int distance = pulseIn(ECHO, HIGH, 26000); // Read in times pulse

        distance = distance / 58; //Convert the pulse duration to distance

        if (distance != 0)
        {
            waterLevelCounter += distance;
            distanceCounter++;
        }
    }
    return waterLevelCounter / distanceCounter;
}

void sendData(String data)
{
    byte firstByte = 0x7E;
    byte _length[] = {0x00, 0x00};
    byte transmitReq = 0x10;
    byte frameId = 0x01;
    byte msbAddress[] = {0x00, 0x13, 0xA2, 0x00};
    byte lsbAddress[] = {0x41, 0x91, 0xDC, 0xA3};
    byte tail[] = {0xFF, 0xFE, 0x00, 0x00};
    byte _data[] = {};
    byte sum = 0x00;

    // 0x0E is 14 decimal that is the byte length of transmit request until the tail
    byte length = 0x0E + data.length();

    _length[0] = byte((length >> 8) & 0xFF);
    _length[1] = byte(length & 0xFF);

    LOG_PRINTT(firstByte, HEX);
    LOG_PRINT(F(":"));
    XBeeSerial.write((byte)firstByte);

    for (size_t i = 0; i < 2; i++)
    {
        LOG_PRINTT((byte)_length[i], HEX);
        LOG_PRINT(F(":"));
        XBeeSerial.write((byte)_length[i]);
    }

    LOG_PRINTT(transmitReq, HEX);
    LOG_PRINT(F(":"));
    LOG_PRINTT(frameId, HEX);
    LOG_PRINT(F(":"));

    XBeeSerial.write((byte)transmitReq);
    XBeeSerial.write((byte)frameId);

    sum += transmitReq + frameId;

    for (size_t i = 0; i < sizeof(msbAddress); i++)
    {
        sum += msbAddress[i];
        LOG_PRINTT(msbAddress[i], HEX);
        LOG_PRINT(F(":"));
        XBeeSerial.write((byte)msbAddress[i]);
    }

    for (size_t i = 0; i < sizeof(lsbAddress); i++)
    {
        sum += lsbAddress[i];
        LOG_PRINTT(lsbAddress[i], HEX);
        LOG_PRINT(F(":"));
        XBeeSerial.write((byte)lsbAddress[i]);
    }

    for (size_t i = 0; i < sizeof(tail); i++)
    {
        sum += tail[i];
        LOG_PRINTT(tail[i], HEX);
        LOG_PRINT(F(":"));
        XBeeSerial.write((byte)tail[i]);
    }

    for (size_t i = 0; i < data.length(); i++)
    {
        _data[i] = data[i];
        sum += _data[i];

        LOG_PRINTT(_data[i], HEX);
        LOG_PRINT(F(":"));
        XBeeSerial.write((byte)_data[i]);
    }

    byte checksum = 0xFF - (byte)sum;
    LOG_PRINTLNT(checksum, HEX);

    XBeeSerial.write((byte)checksum);
}

#endif