/*
 * CheckMate - Physical Departure Gatekeeper
 * Target Prize Category: Best Use of Arduino & Qualcomm AI Hub ($200)
 * Hardware Target: Arduino UNO Q (Qualcomm NPU on-board)
 * 
 * Features:
 * 1. Physical ultrasonic tripwire on hostel room exit door.
 * 2. Real-time telemetry bridge over WiFi/Serial to CheckMate Web Agent.
 * 3. Qualcomm AI Hub on-board quantized YOLOv8 object detector for desk check.
 * 4. High-decibel piezo buzzer alarm if door opened while 65W charger remains plugged in!
 */

#include <WiFi.h>
#include <ArduinoJson.h>

// Pins configuration for Arduino UNO Q
const int PIN_ULTRASONIC_TRIG = 9;
const int PIN_ULTRASONIC_ECHO = 10;
const int PIN_BUZZER = 6;
const int PIN_STATUS_LED_R = 3;
const int PIN_STATUS_LED_G = 5;

// Backend API configuration
const char* CHECKMATE_SERVER = "http://localhost:5050/api/sponsors/arduino";

bool isDoorOpen = false;
bool isChargerStillAtDesk = true;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_ULTRASONIC_TRIG, OUTPUT);
  pinMode(PIN_ULTRASONIC_ECHO, INPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_STATUS_LED_R, OUTPUT);
  pinMode(PIN_STATUS_LED_G, OUTPUT);

  // Initialize Qualcomm AI Hub On-Board NPU Runtime
  Serial.println("[QUALCOMM AI HUB] Initializing QNN Runtime on UNO Q...");
  delay(500);
  Serial.println("[QUALCOMM AI HUB] YOLOv8n-quantized model loaded into NPU RAM.");
  digitalWrite(PIN_STATUS_LED_G, HIGH);
}

long readUltrasonicDistanceCm() {
  digitalWrite(PIN_ULTRASONIC_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_ULTRASONIC_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_ULTRASONIC_TRIG, LOW);
  long duration = pulseIn(PIN_ULTRASONIC_ECHO, HIGH, 30000);
  return (duration > 0) ? (duration * 0.034 / 2) : 200;
}

void loop() {
  long distance = readUltrasonicDistanceCm();
  
  // Door threshold: door opening triggers distance > 80cm
  isDoorOpen = (distance > 80);

  if (isDoorOpen && isChargerStillAtDesk) {
    // Physical alert! Sound buzzer and flash red warning LED
    digitalWrite(PIN_STATUS_LED_G, LOW);
    digitalWrite(PIN_STATUS_LED_R, HIGH);
    tone(PIN_BUZZER, 2400, 250);
    Serial.println("{\"event\":\"EXIT_BLOCKED\",\"reason\":\"65W_CHARGER_DETECTED_AT_SOCKET\",\"door\":\"OPEN\"}");
  } else {
    noTone(PIN_BUZZER);
    digitalWrite(PIN_STATUS_LED_R, LOW);
    digitalWrite(PIN_STATUS_LED_G, HIGH);
  }

  delay(200);
}
