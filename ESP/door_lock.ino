
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
long lastReconnectAttempt = 0;
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message: ");
  char message[length + 1];
  memcpy(message, payload, length);
  message[length] = '\0';
  Serial.println(message);
  Serial.println("-----------------------");
}

void reconnect() {
  if (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect(mqttClientName)) {
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
  pinMode(17, OUTPUT);
  digitalWrite(17,HIGH);
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
  SPI.begin();
  mfrc522.PCD_Init();
  for (byte i = 0; i < 6; i++) {
    key.keyByte[i] = 0xFF;
  }
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
    digitalWrite(17, LOW);
    char buf[32];
    snprintf(buf, sizeof(buf), "door opened,%s%s",uid,card_info);
    client.publish("esp/door",buf);
    delay(4000);
    digitalWrite(17, HIGH);
    client.publish("esp/door", "door clossed");
    Serial.println(uid);
    Serial.println(card_info);
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