
#include<WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_Sensor.h>
#include <DHT22.h>
#define DHTPIN 4
int ppm=0, lpg=0;

#define ANALOGPIN 33
const char* ssid = "Shanna";
const char* password =  "pv@1968_";
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
   if(strcmp(topic,"rpi/alert")==0){
    if (strcmp(message, "check") == 0) {
 
    }
    if (strcmp(message, "reset") == 0) {
      alert = 0;
    }
   }
   
  Serial.println("-----------------------");
}

void reconnect() {
  if (!client.connected()) {
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
    delay(100);
    yield();
  
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  delay(500); 
  pinMode(34,INPUT);
  pinMode(33,INPUT);

 
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
 
  lastReconnectAttempt = 0;
}

void loop() {
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
  
   
    for(int i=0;i<10;i++){
       ppm += analogRead(33);
     
      delay(2); 
      yield();
    }
    ppm/=10;
    ppm=ppm*2;

    for(int i=0;i<10;i++){
       lpg += analogRead(34);
      delay(2); 
      yield();
    }
    lpg/=10;
    lpg=lpg*2-1845;
  
  if(t-t_prev>10000){
    t_prev=t;
    float temp = dht22.getTemperature();
    yield();
    float h = dht22.getHumidity();
    yield();
    
    
    if(alert==1){
     client.publish("esp/alert","alert");
     Serial.println("alert");
    }
    else{
        client.publish("esp/alert","");
    }
    if(!isnan(temp) && !isnan(h)){
      char buf[32];
      snprintf(buf, sizeof(buf), "%.2f,%.2f,%d,%d", temp, h,ppm,lpg);
      client.publish("esp/weather",buf);
     
     
    }
  }
      ppm=0;
    lpg=0;
     


  
}
