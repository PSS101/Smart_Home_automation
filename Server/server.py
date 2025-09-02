from flask import Flask,request,send_file,jsonify
import time
import paho.mqtt.client as mqtt
import paho.mqtt.subscribe as Subscribe
import smtplib
import ssl
import socket
import requests
from email.mime.text import MIMEText
import imutils
import cv2

face_cascade = cv2.CascadeClassifier('/home/rpi4/.local/lib/python3.11/site-packages/cv2/data/haarcascade_frontalface_default.xml')

port = 8080
email = "noreply8384@gmail.com"
passs = 'jeak pjov ctvz kvey'
remail = 'saishanmukhapanidepu@gmail.com'
mqtt_broker="192.168.1.8"
mqtt_topic = "home/livingroom"
host = socket.gethostname()
ip = socket.gethostbyname(host)
msg = f'''
Server started on ip address: {ip}

Host name: {host}
	  
Port: {port}
          
MQTT port: 1883

MQTT broker: {mqtt_broker}
'''

message = MIMEText(msg,'plain')
message['Subject'] = "Server started"
message['From'] = email
server=None
imgalert = 0
w=""

try:
	server = smtplib.SMTP('smtp.gmail.com',587)
	server.starttls()
	server.set_debuglevel(False)
	server.login(email,passs)
	server.sendmail(email,remail,message.as_string())
	server.quit()
	print("email sent")
except requests.exceptions.RequestException as e:
	print(e)


def on_message(client,userdata,mssg):
	if (mssg.topic == 'esp/alert'):
		alertmsg = mssg.payload.decode()
		global imgalert
		imgalert = 1 if alertmsg == 'alert' else 0
		print(alertmsg)
		print(imgalert)
	elif(mssg.topic == 'esp/weather'):
		m = mssg.payload.decode()
		global w
		w = m
		print(w)

client=mqtt.Client(mqtt.CallbackAPIVersion.VERSION2,'server')
client.connect(mqtt_broker,port=1883)
client.subscribe('esp/alert')
client.subscribe('esp/weather')

client.on_message = on_message
client.loop_start()




app = Flask(__name__)
@app.route("/pic")
def takepic():
	client.publish("rpi/alert","check")
	
	global imgalert
	print(imgalert)
	if(imgalert==1):
		
		c = cv2.VideoCapture(0)
		if c.isOpened():
			for i in range(15):
				ret,img = c.read()
			ret,img = c.read()
			
			if ret:
				grayimg = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
				face = face_cascade.detectMultiScale(grayimg,scaleFactor=1.1,minNeighbors=5)
				print(len(face))
				if(not len(face)==0):
					client.publish('rpi/alert','reset')
					imgalert = 0
				for(x,y,w,h) in face:
					cv2.rectangle(img,(x,y),(x+w,y+h),(0,0,255),2)
				path = '/home/rpi4/Downloads/img.png'
				cv2.imwrite(path,img)
			c.release()
			cv2.destroyAllWindows()
			print('img taken')
		return send_file('/home/rpi4/Downloads/img.png',mimetype='image/png')
	else:
		return ""

@app.route("/room",methods=['POST'])
def hello_world():
        data = request.get_json()
        device = data['device']
        if(device=='light'):
        	print(data['Light'])
        	client.publish("rpi/test/light",data['Light'])
        elif(device=='bed'):
	        print(data['BedLight'])
        	client.publish("rpi/test/bed",data['BedLight'])
        return "check console"


@app.route("/weather")
def weather():
	global w
	return jsonify({'mssg':w})

@app.route('/resetalert',methods=['POST'])
def resetalert():
	client.publish('rpi/alert','reset')
	global imglaert
	imgalert = 0
	return "reset alert"
if __name__ == '__main__':
	app.run(debug=False,host='0.0.0.0',port=port)
        
