#include "Config.h"

#ifdef ROUTER

#include <Arduino.h>
#include <SoftwareSerial.h>
#include <EEPROM.h>

#include "Router.h"

volatile unsigned long cnt = 0;
float cm = 0.0f;

void intrr0(void);
void intrr1(void);

void clearEEPROM(void);

SoftwareSerial XBeeSerial(XBEE_RX, XBEE_TX);

#define DEBUG

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

void sendData(String);
void receiveData(void);

void routerSetup()
{
    Serial.begin(9600);
    XBeeSerial.begin(XBEE_BAUD);
    pinMode(ENCODER_A, INPUT_PULLUP);
    pinMode(ENCODER_B, INPUT_PULLUP);
    attachInterrupt(0, intrr0, RISING);
    attachInterrupt(1, intrr1, RISING);
    // clearEEPROM();
    cm = EEPROM.get(EEPROM_ADDR, cm);
}

byte counter = -1;
byte length1 = 0x00;
byte length2 = 0x00;
byte _lengthRx = 0x00;
byte rx[50] = {};

void routerTransmit()
{
    float soilValue = 0.00;
    for (size_t i = 0; i < 100; i++)
    {
        soilValue = soilValue + analogRead(SOIL_PIN);
    }

    float soilPercentage = abs((((soilValue / 100.0) / 1024.0) * 100) - 100.0);

    cm = cm + (cnt / 6.0f / 100.0f);
    cnt = 0;
    EEPROM.put(EEPROM_ADDR, cm);

    sendData("{\"s\":" + String(soilPercentage) + ",\"e\":" + String(cm) + "}");
    LOG_PRINTLN("{\"s\":" + String(soilPercentage) + ",\"e\":" + String(cm) + "}");
    delay(1000);
}

void clearEEPROM()
{
    for (unsigned int i = 0; i < EEPROM.length(); i++)
    {
        if (EEPROM.read(i) != 0)
        {
            EEPROM.write(i, 0);
        }
    }
    Serial.println("EEPROM erased!");
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

void intrr0()
{
    if (digitalRead(ENCODER_B) == LOW)
    {
        cnt++;
    }
    else
    {
        // cnt--;
    }
}

void intrr1()
{
    if (digitalRead(ENCODER_A) == LOW)
    {
        // cnt--;
    }
    else
    {
        cnt++;
    }
}

#endif