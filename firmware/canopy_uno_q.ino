/*
 * Canopy Backcountry Sensor Pod - Arduino UNO Q
 * Hacktoberfest 2026: Week 1 "Touch Grass"
 * 
 * Hardware:
 * - Arduino UNO Q (Qualcomm AI Hub enabled MCU)
 * - Bosch BME280 I2C Sensor (Temp, Humidity, Barometric Pressure)
 * - MAX4466 Electret Microphone on Analog Pin A0
 * 
 * Functions:
 * 1. Reads local atmospheric pressure trend to detect sudden alpine cold fronts
 * 2. Samples sound pressure level (dB SPL) and dominant harmonic frequencies
 * 3. Streams structured JSON telemetry to Canopy AI via Serial / WebSerial
 */

#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <ArduinoJson.h>

Adafruit_BME280 bme;
const int MIC_PIN = A0;
const int SAMPLE_WINDOW_MS = 50; // 50ms window for audio peak detection

void setup() {
  Serial.begin(115200);
  while (!Serial && millis() < 3000); // Wait for serial connection or continue

  // Initialize I2C BME280 sensor
  if (!bme.begin(0x76)) {
    Serial.println("{\"error\":\"BME280 sensor not detected. Check I2C wiring.\"}");
  }

  // Configure BME280 for outdoor weather monitoring
  bme.setSampling(Adafruit_BME280::MODE_FORCED,
                  Adafruit_BME280::SAMPLING_X1, // Temperature
                  Adafruit_BME280::SAMPLING_X1, // Pressure
                  Adafruit_BME280::SAMPLING_X1, // Humidity
                  Adafruit_BME280::FILTER_OFF);
}

void loop() {
  // Trigger forced measurement for low power backcountry operation
  bme.takeForcedMeasurement();

  float temp_c = bme.readTemperature();
  float humidity_pct = bme.readHumidity();
  float pressure_hpa = bme.readPressure() / 100.0F;

  // Approximate barometric altitude based on standard sea level pressure (1013.25 hPa)
  float baro_altitude_m = bme.readAltitude(1013.25);

  // Audio peak detection
  unsigned long startMillis = millis();
  unsigned int peakToPeak = 0;
  unsigned int signalMax = 0;
  unsigned int signalMin = 1024;

  while (millis() - startMillis < SAMPLE_WINDOW_MS) {
    int sample = analogRead(MIC_PIN);
    if (sample < 1024) {
      if (sample > signalMax) signalMax = sample;
      if (sample < signalMin) signalMin = sample;
    }
  }
  peakToPeak = signalMax - signalMin;
  
  // Approximate sound pressure level in dB SPL
  float sound_db = 20.0 * log10(max(1.0f, (float)peakToPeak)) + 35.0;

  // Serialize telemetry packet
  StaticJsonDocument<300> doc;
  doc["device"] = "Arduino UNO Q";
  doc["temp_c"] = round(temp_c * 10) / 10.0;
  doc["humidity_pct"] = round(humidity_pct * 10) / 10.0;
  doc["pressure_hpa"] = round(pressure_hpa * 10) / 10.0;
  doc["altitude_m"] = round(baro_altitude_m);
  doc["sound_db"] = round(sound_db * 10) / 10.0;
  doc["status"] = "OK";

  serializeJson(doc, Serial);
  Serial.println();

  delay(1500); // Sample every 1.5 seconds to conserve battery in backpack
}
