volatile int timedelay= 100;
void setup(){
  pinMode(8,OUTPUT);
  pinMode(A0,INPUT);
  attachInterrupt(digitalPinToInterrupt(2), dim, RISING);
//  Serial.begin(9600);
}
void dim(){
  delayMicroseconds(timedelay);
  digitalWrite(8,HIGH);
  delayMicroseconds(100);
  digitalWrite(8, LOW);
}
void loop(){
  int x = analogRead(A0);
  x= float(x)*5/3.3;
  x = constrain(x, 0, 1023);
  x = map(x,0,1023,8000,1000);
  x = int(x/500);
  x = x*500;
  timedelay = x;
  
}