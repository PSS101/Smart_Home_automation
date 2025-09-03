#include<WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_Sensor.h>
#include <DHT22.h>
#define DHTPIN 6    
const char* ssid = "";
const char* password =  "";
const char* mqttServer = "192.168.1.8";
const int mqttPort = 1883;
WiFiClient espClient;
const char* mqttClientName = "ESP32-Client-LivingRoom";
PubSubClient client(espClient);
long lastReconnectAttempt = 0,t=0,t_prev=0;
int alert;
DHT22 dht22(DHTPIN);
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
    digitalWrite(7,LOW);
  }
  else{
    digitalWrite(7,HIGH);
  }
  }
  else if(strcmp(topic,"rpi/test/bed")==0){
    if (strcmp(message, "on") == 0) {
    digitalWrite(5,LOW);
  }
  else{
    digitalWrite(5,HIGH);
  }
  }
   else if(strcmp(topic,"rpi/alert")==0){
    if (strcmp(message, "check") == 0) {
 
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
  

  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  delay(500); 
  pinMode(2,OUTPUT);
  pinMode(7,OUTPUT);
  pinMode(1,INPUT);
  digitalWrite(2,HIGH);
  digitalWrite(7,HIGH);
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
 
  lastReconnectAttempt = 0;
}

void loop() {
  int x = digitalRead(1);
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

  t = millis();
  float t = dht22.getTemperature();
  float h = dht22.getHumidity();
  if(t-t_prev>10000){
    if(alert==1){
     client.publish("esp/alert","alert");
     Serial.println("alert");
    }
    else{
        client.publish("esp/alert","");
    }
    if(!t.isnan() && !h.isnan()){
      String mssg = String(t)+','+String(h)
      char* buf[sizeof(mssg)];
      mssg.toCharArray(buf, sizeof(buf));
      client.subscribe("esp/weather",buf);
    }
  }
  
}