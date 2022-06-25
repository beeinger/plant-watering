#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#define PUMP D3

const char *ssid = "";
const char *password = "";
const String baseURL = "http://plant-watering.beeinger.dev/api/v1/machine/";
const int WATERING_TIME = 20*1000;
const int PING_INTERVAL = 10*1000;
WiFiClient client;
HTTPClient http;

bool shouldWaterThePlant(){
  Serial.println("Fetching should water");
  http.useHTTP10(true);
  http.begin(client, baseURL + "status");
  http.GET();

  DynamicJsonDocument doc(2048);
  deserializeJson(doc, http.getStream());

  bool shouldWater = doc["shouldWater"].as<bool>();
  // TODO: try to move this line above
  http.end();
  Serial.println(shouldWater);
  
  return shouldWater;
}

void ping(String url){
  http.useHTTP10(true);
  http.begin(client, baseURL + url);
  http.GET();
  http.end();
}

void pingStartup(){
  Serial.println("Pinging start up");
  ping("startup");
}

void pingWateringDone(){
  Serial.println("Pinging watering done");
  ping("done-watering");
}

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
     delay(500);
     Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println(WiFi.localIP());
  pingStartup();
  
  pinMode(PUMP, OUTPUT);
  digitalWrite(PUMP, HIGH);
}

void loop() {
  if(shouldWaterThePlant()){
    digitalWrite(PUMP, LOW);
    delay(WATERING_TIME);
    digitalWrite(PUMP, HIGH);
    pingWateringDone();
  }
  delay(PING_INTERVAL);
}