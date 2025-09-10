
#include <WiFi.h>
#include <PubSubClient.h>
const char* ssid = "Shanna";
const char* password = "pv@1968_";
const char* mqttServer = "192.168.1.8";
const int mqttPort = 1883;
WiFiClient espClient;
const char* mqttClientName = "ESP32-Client-LivingRoom";
PubSubClient client(espClient);
#include <SPI.h>
#include <MFRC522.h>
#define RST_PIN 0
#define SS_PIN 5
MFRC522 mfrc522(SS_PIN, RST_PIN);
MFRC522::MIFARE_Key key;
String uid;
String card_info;
#define RXD2 16//RX
#define TXD2 17 //TX

// Enable Config
byte enable_config[]={
  0xFD, 0xFC, 0xFB, 0xFA, 0x04, 0x00, 0xFF, 0x00, 0x01, 0x00, 0x04, 0x03, 0x02, 0x01,
};
byte end_config[]={
  0xFD, 0xFC, 0xFB, 0xFA, 0x02, 0x00, 0xFE, 0x00, 0x04, 0x03, 0x02, 0x01,
};
byte read_params[] = { 
  0xFD, 0xFC ,0xFB, 0xFA, 0x02, 0x00, 0x61, 0x00, 0x04, 0x03, 0x02, 0x01,
};
byte set_baud[] = {
  0xFD, 0xFC, 0xFB, 0xFA, 0x04, 0x00, 0xA1, 0x00, 0x01, 0x00, 0x04, 0x03, 0x02, 0x01,
};
byte engineering_mode[] = {
  0xFD, 0xFC, 0xFB, 0xFA, 0x02, 0x00, 0x62, 0x00, 0x04, 0x03, 0x02, 0x01,
};
int i =  0;
int j=0;
int k=0;
int alert=0;
float md=0,sd=0;
int endString[] = {4,3,2,1};
int endString2[] = {248,247,246,245};
int mmdata[]={0,0,0,0,0,0};
long lastReconnectAttempt = 0;
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message: ");
  char message[length + 1];
  memcpy(message, payload, length);
  message[length] = '\0';
  Serial.println(message);
   if(strcmp(topic,"rpi/alert")==0){
    alert = atoi(message);
   }
  Serial.println("-----------------------");
}

void reconnect() {
  if (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(mqttClientName)) {
      client.subscribe("rpi/alert");
      Serial.println("connected");
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
  pinMode(14, OUTPUT);
  digitalWrite(14,HIGH);
  pinMode(19,INPUT_PULLDOWN);
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
  SPI.begin();
  mfrc522.PCD_Init();
  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);
  mmwave();
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
  int door = rfid();
  if (door == 1) {
    digitalWrite(14, LOW);
    char buf[32];
    snprintf(buf, sizeof(buf), "door opened,%s%s",uid,card_info);
    client.publish("esp/door",buf);
    delay(4000);
    digitalWrite(14, HIGH);
    client.publish("esp/door", "door clossed");
    Serial.println(uid);
    Serial.println(card_info);
  }
   int x = digitalRead(19);
  if(x==1 && alert==1){
    
  while (Serial2.available()) {
    
    int b = Serial2.read();
    /*
    Serial.print("0x");
    if(b<10){
      Serial.print("0");
    }

    Serial.print(b,HEX);
    Serial.print(" ");*/
    if (b== endString2[j]){
      j++;
    }
    else{
      j--;
    }
    j= constrain(j,0,4);
    if(j==4){
      j=0;
      k=0;
      md = float(mmdata[1])/100.00;
      sd = float(mmdata[3])/100.00;
      Serial.println("Intruder Alert");
      Serial.print("Movement target dist: "+String(md)+" m");
      char buf[16];
      snprintf(buf, sizeof(buf), "%f",md);
      client.publish("esp/door/alert", buf);
      switch(mmdata[0]){
        case 0:
          Serial.print(" No target");
          break;
        case 1:
          Serial.print(" Moving target");
          break;
        case 2:
          Serial.print(" Stationary target");
          break;
        case 3:
          Serial.print(" Moving and Stationary target");
      }
      Serial.print(" Stat target dist: "+String(sd)+" m");
      Serial.print(" Detected at: "+String(float(mmdata[5])/100.00)+" m");
      Serial.println();
    }
    else{
      k++;
      if(k>8 && k<15){
        mmdata[k-9] = b;
      }
      
    }
    }

    if(md <2.5 && md>0.5){
      digitalWrite(12,HIGH);
    }
    else{
      digitalWrite(12, LOW);
    }
    delay(5000);
  }
}








int check(byte* buffer, byte bufferSize, int count) {
  byte dataBlock[] = {
    0x8a, 0x28, 0x60, 0x95,
    0x8b, 0xed, 0xb2, 0x4f,
    0x36, 0x90, 0xb9, 0xdc,
    0xb7, 0x60, 0x65, 0x4e
  };
  for (byte i = 0; i < bufferSize; i++) {
    if (buffer[i] == dataBlock[i]) {
      count++;
    }
  }
  if (count == 16) {

    return 1;
  } else {
    return -1;
  }
}
String dump_byte_array(byte* buffer, byte bufferSize) {
  String s = "";
  for (byte i = 0; i < bufferSize; i++) {
    if(i!=bufferSize-1){
      s += String(buffer[i], HEX) + "-";
    }
    else{
      s+=String(buffer[i])+",";
    }
    
  }
  return s;
}
int rfid() {
  if (!mfrc522.PICC_IsNewCardPresent())
    return -1;
  if (!mfrc522.PICC_ReadCardSerial())
    return -1;
  uid = dump_byte_array(mfrc522.uid.uidByte, mfrc522.uid.size);
  MFRC522::PICC_Type piccType = mfrc522.PICC_GetType(mfrc522.uid.sak);
  card_info = String(mfrc522.PICC_GetTypeName(piccType));
  byte sector = 1;
  byte blockAddr = 4;
  byte trailerBlock = 7;
  MFRC522::StatusCode status;
  byte buffer[18];
  byte size = sizeof(buffer);
  status = (MFRC522::StatusCode)mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, trailerBlock, &key, &(mfrc522.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("PCD_Authenticate() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return -1;
  }
  status = (MFRC522::StatusCode)mfrc522.MIFARE_Read(blockAddr, buffer, &size);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("MIFARE_Read() failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
  }
  int val = check(buffer, 16, 0);
  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
  if (val == 1) {
    Serial.println("Door opened");
    return 1;
  } else {
    return -1;
  }
}

void mmwave(){
  Serial.println("enable config");
  Serial2.write(enable_config, sizeof(enable_config));
  delay(200);
  Serial.println("read config");
   Serial2.write(read_params, sizeof(read_params));
  delay(200);
  Serial.println("eng mode config");
   Serial2.write(engineering_mode, sizeof(engineering_mode));
  delay(200);
  Serial.println("end config");
   Serial2.write(end_config, sizeof(end_config));
  delay(200);
  Serial.println("config complete");
}