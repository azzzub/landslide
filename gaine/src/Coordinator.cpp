#define TINY_GSM_MODEM_SIM7000
#define TINY_GSM_DEBUG Serial

#include <Arduino.h>
#include <SoftwareSerial.h>
#include <EEPROM.h>

#include <ArduinoJson.h>

#include "Config.h"

#ifdef COORDINATOR

#define S_EEP_ADDR 0
#define E_EEP_ADDR 40
#define X_EEP_ADDR 80
#define Y_EEP_ADDR 120
#define A_EEP_ADDR 160
#define T_EEP_ADDR 200

// #define MANUAL

/**
 * Setting up the modem
 * */
#include <TinyGsmClient.h>
#include <PubSubClient.h>
#include "StreamDebugger.h"

// See all AT commands, if wanted
// #define DUMP_AT_COMMANDS

#ifdef DUMP_AT_COMMANDS
#include <StreamDebugger.h>
StreamDebugger debugger(Serial3, Serial);
TinyGsm modem(debugger);
#else
TinyGsm modem(Serial3);
#endif

#include <ArduinoHttpClient.h>
const char server[] = "api.landslide.id";
const char resource[] = "/v1/hw";
const char triggerEndpoint[] = "/v1/trg";

TinyGsmClient client(modem);
HttpClient http(client, server, 80);

#include "Router.h"

// SoftwareSerial XBeeSerial(XBEE_RX, XBEE_TX);
#define XBeeSerial Serial1

const char apn[] = "internet";
const char gprsUserPass[] = "";

#define DEBUG

#ifdef DEBUG
#define LOG_WRITE(x) Serial.write(x)
#define LOG_PRINT(x) Serial.print(x)
#define LOG_PRINTLN(x) Serial.println(x)
#else
#define LOG_WRITE(x)
#define LOG_PRINT(x)
#define LOG_PRINTLN(x)
#endif

void sendData(String);
void receiveData(void);
void errorHandler(void);
void clearEEPROM(void);
void getTrigger(void);

#define BUZZ A3

long errorCounter = 0;

void (*resetFunc)(void) = 0; //declare reset function @ address 0

long readCounter = 0;

long currentMillis = 0;

float sEep = 999.0;
float eEep = 999.0;
float xEep = 999.0;
float yEep = 999.0;
int aEep = 0;
int tEep = 30;

void coorSetup()
{
    pinMode(BUZZ, OUTPUT);
    pinMode(SIREN, OUTPUT);
    digitalWrite(BUZZ, LOW);
    digitalWrite(SIREN, HIGH);
    Serial.begin(115200);
    XBeeSerial.begin(XBEE_BAUD);

#ifndef MANUAL
    LOG_PRINT(F("Initializing modem...\n"));
    TinyGsmAutoBaud(Serial3, 9600, 9600);
    modem.restart();
    // modem.init();

    String modemInfo = modem.getModemInfo();
    LOG_PRINT(F("Modem info: "));
    LOG_PRINT(modemInfo + "\n");

    if (!modem.waitForNetwork())
    {
        LOG_PRINT(F("Network fail!!!\n"));
        while (true)
        {
            errorHandler();
        }
    }

    if (modem.isNetworkConnected())
    {
        LOG_PRINT(F("Network connected\n"));
    }

    modem.setNetworkMode(51);  //38-LTE, 13-GSM
    modem.setPreferredMode(3); //2-NB-IoT, 1-CAT, 3-GPRS

    int signal = modem.getSignalQuality();
    LOG_PRINT(F("Network signal: "));
    LOG_PRINT(signal);
    LOG_PRINT("\n");
#endif
    getTrigger();
    currentMillis = millis();
    digitalWrite(BUZZ, HIGH);
    delay(400);
    digitalWrite(BUZZ, LOW);
    delay(100);
    digitalWrite(BUZZ, HIGH);
    delay(100);
    digitalWrite(BUZZ, LOW);
    delay(100);
    digitalWrite(BUZZ, HIGH);
    delay(100);
    digitalWrite(BUZZ, LOW);
}

byte counter = -1;
byte length1 = 0x00;
byte length2 = 0x00;
byte _lengthRx = 0x00;
byte rx[40] = {};
float s, e, x, y;

void coorRead()
{
    receiveData();
    if (aEep != 0)
    {
        if (s > sEep && e > eEep && x > xEep)
        {
            digitalWrite(SIREN, LOW);
            delay(tEep * 1000);
            digitalWrite(SIREN, HIGH);
            getTrigger();
        }
    }
}

void receiveData()
{
    if (XBeeSerial.available())
    {
        if (errorCounter > 100)
        {
            errorHandler();
        }

        counter++;
        byte response = XBeeSerial.read();
        if (counter == 0 && response == 0x7E)
        {
            LOG_PRINT(F("Received data!\n"));
        }
        else if (counter == 0 && response != 0x7E)
        {
            LOG_PRINT(F("Data error!\n"));
            errorCounter++;
            counter = -1;
            return;
        }

        if (counter == 1)
        {
            length1 = response;
        }

        if (counter == 2)
        {
            length2 = response;
            _lengthRx = (length1 << 8) | (length2);
        }

        if (counter == 3)
        {
            LOG_PRINT(F("Data length: "));
            LOG_PRINT(_lengthRx);
            LOG_PRINT("\n");
        }

        if (counter >= 15)
        {
            rx[counter - 15] = (byte)response;
        }

        if (counter >= _lengthRx + 3)
        {
            counter = -1;
        }
    }
    for (size_t i = 0; i < sizeof(rx); i++)
    {
        if (rx[i] == '}')
        {
            for (size_t j = 0; j <= i; j++)
            {
                LOG_WRITE(rx[j]);
            }
            LOG_PRINT("\n");
            errorCounter = 0;

#ifndef MANUAL
            if (!modem.gprsConnect(apn, gprsUserPass, gprsUserPass))
            {
                errorHandler();
            }

#endif
            DynamicJsonDocument doc(40);
            deserializeJson(doc, rx);

            float _s_temp = doc["s"];
            float _e_temp = doc["e"];
            float _x_temp = doc["x"];
            float _y_temp = doc["y"];

            if (_x_temp == IMP_NUM && _y_temp == IMP_NUM)
            {
                s = _s_temp;
                e = _e_temp;
            }
            else
            {
                x = _x_temp;
                y = _y_temp;
            }

            DynamicJsonDocument docPost(100);
            docPost["s"] = s;
            docPost["e"] = e;
            docPost["x"] = x;
            docPost["y"] = y;
            docPost["z"] = 0;
            String postData;
            serializeJson(docPost, postData);

            if (x != IMP_NUM && y != IMP_NUM && s != IMP_NUM && e != IMP_NUM)
            {
                if (abs(millis() - currentMillis) >= 30000)
                {
                    LOG_PRINT("OK");
                    LOG_PRINT(postData);
                    LOG_PRINT("\n");
                    digitalWrite(BUZZ, HIGH);
                    delay(100);
                    digitalWrite(BUZZ, LOW);

#ifndef MANUAL
                    if (modem.isNetworkConnected())
                    {
                        LOG_PRINT(F("Network connected\n"));
                    }
                    else
                    {
                        errorHandler();
                    }
                    LOG_PRINT(F("Sending data!\n"));
                    // http.get(resource);
                    int err = http.post(resource, "application/json", postData);
                    if (err != 0)
                    {
                        LOG_PRINT("ERROR UPLOAD");
                        errorHandler();
                    }
                    else
                    {
                        String body = http.responseBody();
                        LOG_PRINTLN(body);
                        digitalWrite(BUZZ, HIGH);
                        delay(100);
                        digitalWrite(BUZZ, LOW);
                        delay(100);
                        digitalWrite(BUZZ, HIGH);
                        delay(100);
                        digitalWrite(BUZZ, LOW);
                    }

                    // Shutdown
                    http.stop();
                    LOG_PRINT(F("Server disconn\n"));

                    modem.gprsDisconnect();
                    LOG_PRINT(F("GPRS disconn\n"));
#endif
                    s = IMP_NUM;
                    e = IMP_NUM;
                    x = IMP_NUM;
                    y = IMP_NUM;

                    getTrigger();

                    currentMillis = millis();
                }
                // else
                // {
                //     LOG_PRINT(postData);
                //     LOG_PRINT("\n");
                // }
            }

            for (size_t k = 0; k < sizeof(rx); k++)
            {
                rx[k] = {};
            }
            break;
        }
    }
}

void errorHandler()
{
    for (int i = 1; i <= 10; i++)
    {
        digitalWrite(BUZZ, HIGH);
        delay(500);
        digitalWrite(BUZZ, LOW);
        delay(500);
    }
    resetFunc();
}

void getTrigger()
{
#ifndef MANUAL
    if (!modem.gprsConnect(apn, gprsUserPass, gprsUserPass))
    {
        errorHandler();
    }

#endif
#ifndef MANUAL
    if (modem.isNetworkConnected())
    {
        LOG_PRINT(F("Network connected\n"));
    }
    else
    {
        errorHandler();
    }
    LOG_PRINT(F("Getting trigger data!\n"));
    // http.get(resource);
    int err = http.get(triggerEndpoint);
    if (err != 0)
    {
        LOG_PRINT("ERROR UPLOAD");
        errorHandler();
    }
    else
    {
        String body = http.responseBody();
        DynamicJsonDocument doc(1024);
        deserializeJson(doc, body);

        float s = doc["s"];
        float e = doc["e"];
        float x = doc["x"];
        float y = doc["y"];
        int allow = doc["allow"];
        int time = doc["time"];
        LOG_PRINTLN(body);
        EEPROM.put(S_EEP_ADDR, s);
        EEPROM.put(E_EEP_ADDR, e);
        EEPROM.put(X_EEP_ADDR, x);
        EEPROM.put(Y_EEP_ADDR, y);
        EEPROM.put(A_EEP_ADDR, allow);
        EEPROM.put(T_EEP_ADDR, time);
        digitalWrite(BUZZ, HIGH);
        delay(100);
        digitalWrite(BUZZ, LOW);
        delay(100);
        digitalWrite(BUZZ, HIGH);
        delay(100);
        digitalWrite(BUZZ, LOW);
        sEep = EEPROM.get(S_EEP_ADDR, sEep);
        eEep = EEPROM.get(E_EEP_ADDR, eEep);
        xEep = EEPROM.get(X_EEP_ADDR, xEep);
        yEep = EEPROM.get(Y_EEP_ADDR, yEep);
        aEep = EEPROM.get(A_EEP_ADDR, aEep);
        tEep = EEPROM.get(T_EEP_ADDR, tEep);
        LOG_PRINTLN(sEep);
        LOG_PRINTLN(eEep);
        LOG_PRINTLN(xEep);
        LOG_PRINTLN(yEep);
        LOG_PRINTLN(aEep);
        LOG_PRINTLN(tEep);
    }

    // Shutdown
    http.stop();
    LOG_PRINT(F("Server disconn\n"));

    modem.gprsDisconnect();
    LOG_PRINT(F("GPRS disconn\n"));
#endif
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

#endif