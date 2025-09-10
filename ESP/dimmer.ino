volatile bool zc = false;
volatile uint16_t timedelay = 100;
const uint16_t gate_pulse = 500;
void setup() {
  pinMode(PB1, OUTPUT);
  digitalWrite(PB1, LOW);
  pinMode(A3, INPUT);
  attachInterrupt(0, zeroCross, RISING);
}

void loop() {
  uint16_t x = analogRead(A3);
  timedelay = map(x, 0, 1023, 8000, 1000); 
  timedelay = uint16_t(timedelay/1000)*1000;
  if (zc) {
    uint32_t start = micros();
    while (micros() - start < timedelay);
    PORTB |= (1 << PB1);                  
    start = micros();
    delayMicroseconds(gate_pulse); 
    PORTB &= ~(1 << PB1);                   
    zc = false;
  }
}

void zeroCross() {
  zc = true;
}
