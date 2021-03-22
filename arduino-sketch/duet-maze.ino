#include "Servo.h"      // include the servo library

Servo servoMotor;       // creates an instance of the servo object to control a servo
int servoPin = 3;       // Control pin for servo motor
int initialDegree = 0;
int servoDegree = 90;

void setup() {
  Serial.begin(9600);
  servoMotor.attach(servoPin);  // attaches the servo on pin 3 to the servo object
  servoMotor.write(initialDegree);
  while (Serial.available() <= 0) {
    Serial.println("hello"); // send a starting message
    delay(300);              // wait 1/3 second
  }
}
 
void loop() {
  if (Serial.available() > 0){
    int inString = Serial.read();
    if (inString == 'x') {
      // read the incoming byte:
      int inByte = Serial.read();
      // read the sensor:
      int sensorValue = analogRead(A0);
      // print the results:
      Serial.print(sensorValue);
      Serial.print(",");
 
      // read the sensor:
      sensorValue = analogRead(A1);
      // print the results:
      Serial.print(sensorValue);
      Serial.print(",");
 
      // read the sensor:
      int flag = 0;
      sensorValue = analogRead(A2);
      // Serial.print(sensorValue);
      if (sensorValue < 50){
        flag = 1; 
      }
      Serial.println(flag);
    }
    if (inString == 'y'){
      servoMotor.write(servoDegree);
    }
    if (inString == 'z'){
      servoMotor.write(initialDegree);
    }
  }

}
