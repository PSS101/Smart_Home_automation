#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#define DHTPIN D6   
#define DHTTYPE    DHT22 
const char* ssid = "";
const char* password =  "";
const char* mqttServer = "192.168.1.8";
const int mqttPort = 1883;
WiFiClient espClient;
const char* mqttClientName = "ESP32-Client-LivingRoom";
PubSubClient client(espClient);
long lastReconnectAttempt = 0;
int alert;

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);

  Serial.print("Message: ");
  char message[length + 1];
  memcpy(message, payload, length);
  message[length] = '\0';
  Serial.println(message);
  if(strcmp(topic,"rpi/test/light")==0){
  if (strcmp(message, "on") == 0) {
    digitalWrite(D2,LOW);
  }
  else{
    digitalWrite(D2,HIGH);
  }
  }
  else if(strcmp(topic,"rpi/test/bed")==0){
    if (strcmp(message, "on") == 0) {
    digitalWrite(D5,LOW);
  }
  else{
    digitalWrite(D5,HIGH);
  }
  }
   else if(strcmp(topic,"rpi/alert")==0){
    if (strcmp(message, "check") == 0) {
  if(alert==1){
     client.publish("esp/alert","alert");
     Serial.println("alert");
  }
  else{
client.publish("esp/alert","");
  }
    }
    if (strcmp(message, "reset") == 0) {
      alert = 0;
    }
   }
   
  Serial.println("-----------------------");
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(mqttClientName)) {
      Serial.println("connected");
      client.subscribe("rpi/test/light");
      client.subscribe("rpi/test/bed");
      client.subscribe("rpi/alert");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.setOutputPower(19.25);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  delay(500); 
  pinMode(D2,OUTPUT);
  pinMode(D5,OUTPUT);
  pinMode(D6,INPUT);
  digitalWrite(D2,HIGH);
  digitalWrite(D5,HIGH);
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
 
  lastReconnectAttempt = 0;
}

void loop() {
  int x = digitalRead(D6);
  alert = x==0?1:alert;
  if (!client.connected()) {
    long now = millis();
    if (now - lastReconnectAttempt > 5000) {
      lastReconnectAttempt = now;
      reconnect();
      
    }
  } else {
    client.loop();
  }
  
}