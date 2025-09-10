
#include<WiFi.h>
#include <PubSubClient.h>
const char* ssid = "Shanna";
const char* password =  "pv@1968_";
const char* mqttServer = "192.168.1.8";
const int mqttPort = 1883;
WiFiClient espClient;
const char* mqttClientName = "ESP32-Client-LivingRoom";
PubSubClient client(espClient);
long lastReconnectAttempt = 0,t=0,t_prev=0;
void callback(char* topic, byte* payload, unsigned int length) {
  int rgb[3];
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);

  Serial.print("Message: ");
  char message[length + 1];
  memcpy(message, payload, length);
  message[length] = '\0';
  Serial.println(message);
  if(strcmp(topic,"rpi/rgb")==0){
     char* token;
     char* rest = message; // Pointer to the remaining part of the string
      for(int i=0;i<3;i++){
        token = strtok_r(rest, ",", &rest); // Use strtok_r for reentrancy
        rgb[i] = atoi(token);// Process or store the extracted token
      }
      analogWrite(26,rgb[0]);
      analogWrite(13,rgb[1]);
      analogWrite(14,rgb[2]);
   }
   else if(strcmp(topic,"rpi/dim")==0){
    int x = atoi(message);
    dacWrite(25,x);
   }
   
  Serial.println("-----------------------");
}

void reconnect() {
  if (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(mqttClientName)) {
      Serial.println("connected");
      client.subscribe("rpi/rgb");
      client.subscribe("rpi/dim");
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
  pinMode(25,OUTPUT);
  pinMode(26,OUTPUT);
  pinMode(13,OUTPUT);
  pinMode(14,OUTPUT);
  digitalWrite(26,HIGH);
  digitalWrite(13,LOW);
  digitalWrite(14,LOW);

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

  
  
  
      
  }

