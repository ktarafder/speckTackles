import time
import board
#import Adafruit_DHT
#import adafruit_dht
import pyrebase
import random
import RPi.GPIO as GPIO
from gpiozero import Servo, Device
from time import sleep
from gpiozero.pins.rpigpio import RPiGPIOFactory

#Device.pin_factory = RPiGPIOFactory()

config = {
    "apiKey" : "AIzaSyAUedVF1Fx7zMnMYQezY4hsGJZM506w--I",
    "authDomain" : "spectacles-a6a47.firebaseapp.com",
    "databaseURL" : "https://spectacles-a6a47-default-rtdb.firebaseio.com/",
    "storageBucket" : "spectacles-a6a47.appshot.com"
    }

firebase = pyrebase.initialize_app(config)
db = firebase.database()
ProjectBucket = db.child("ProjectBucket")

LED22 = 22;
servo_pin = 23
current_mode  = GPIO.getmode()
GPIO.setup(24,GPIO.IN)
GPIO.cleanup()

GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)
GPIO.setup(LED22,GPIO.OUT)


Create a Servo object
servo = Servo(servo_pin)

Function to set the servo angle
def set_angle(angle):
    # Convert the angle to a value between -1 and 1
    if (angle <= 0):
       angle = 1
    if (angle >=180):
       angle = 179
    value = (angle / 90) - 1
    servo.value = value
    #sleep(1)

valServo = -1
#set_angle(170)
while True:
   led22 = ProjectBucket.child("Light2").get().val()
   angle = ProjectBucket.child("Degree").get().val()

   #print(led22)
   if (led22 is None):
       continue
   elif (led22 % 2 == 1):
     GPIO.output(LED22,GPIO.HIGH)
   else:
     GPIO.output(LED22,GPIO.LOW)
   set_angle(180-angle*2)
   #if (angle != valServo):
   #      print(angle)
    #  try:
     #    set_angle(angle)
    #     valServo = angle
     # except:
      #s   set_angle(valServo)
