# -*- coding:utf-8 -*-

#import threading
import thread
import serial, time
from flask import Flask, render_template, make_response, request
from httplib2 import Http
from struct import unpack
#from flask.ext.autoindex import AutoIndex
#import os.path
#import thread
from apscheduler.scheduler import Scheduler

sched = Scheduler()
sched.start()

app = Flask(__name__)

#AutoIndex(app, browse_root = os.path.curdir + '/static')

ser = serial.Serial(
    port='/dev/ttyUSB0',
    baudrate='38400',
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    bytesize=serial.EIGHTBITS,

)
class TH350:
    def __init__(self):
        self.IS = '\x00'
        url = "http://192.168.0.8:9090/sendsms?phone=13013786354&text="
        self.value = 'started'

TH = TH350()

SMS = Http()
URL = "http://192.168.0.8:9090/sendsms?phone=13013786354&text="

if not ser.isOpen():
    ser.open()


def SendSMS(InnerS):
    for i in range(8):
        if InnerS[i] == 1:
            URL = URL + "警報" + i + "On,"
        else:
            URL = URL + "警報" + i + "Off,"
    SMS.request(URL,'GET')




@app.route('/')
def index():
    return render_template("index.htm")


@app.route('/getva')
def returnv():
    #global TH
    #print TH.value
    return TH.value






#@app.route("/getva")
def getv():
    #global ser
    #global TH
    #while True:
    ser.flushInput()
    ser.write('\x01\x03\x75\x95\x00\x1b\x0f\xe1')
    time.sleep(0.04)
    if ser.inWaiting() == 59:

        TH.value = ser.read(59)
        if TH.IS != TH.value[16]:#without threading,perhapse delayed
            TH.IS = TH.value[16]
            #SendSMS(format(TH.IS,'08b'))
            thread.start_new_thread(SendSMS,(format(TH.IS,'08b'),))
        return TH.value

    else:
        getv()


@app.route('/test/<username>')
def testuser(username):
    return username

@app.route('/WriteS',methods=['POST'])
def WrS():
    WriteSingle = request.data
    ser.write(WriteSingle)
    r = ser.read()
    #print WriteSingle[4]
    return str(len(WriteSingle))

@app.route('/run')
def run():
    ser.write('\x01\x06\x9c\x41\x00\x01\x36\x4e')
    r = ser.read(8)
    return "TH300 is Running ..."

@app.route('/stop')
def stop():
    ser.write('\x01\x06\x9c\x41\x00\x00\xf7\x8e')
    r = ser.read(8)
    return "TH300 stopped......"

def RecordData():
    da = open('text','a')
    da.write(TH.value)


@app.route('/csv')
def ConvertCSV():
    csvtxt = open('./TH300/data/record.csv','w')
    da = open('text','rb')
    csv = ''
    records = da.read()
    for i in range(len(records)/59):
        da.seek(i*59 + 3)
        data = unpack('>hhhhhh',da.read(12))
        csv = csv + str(float(data[0])/100-100) + ',' + str(float(data[1])/100-100) \
        + ',' + str(float(data[2])/100) + ',' + str(float(data[3])/10) + ',' + str(float(data[4])/10) \
        + ',' + str(float(data[5])/100) + '\n'
        #for j in range(6):
        #    csv = csv + str(data[j]) + ','
        #csv = csv + '\n'
    csvtxt.write(csv)
    return 'converted to csv!!'


@app.route('/data')
def data():
    da = open("./TH300/data/record.csv",'r')
    response = make_response(da.read())
    response.headers['Content-Disposition'] = 'attachment;filename=record.csv'
    return response


@app.route('/sms')
def sms():
    return "sms"

@app.route('/email')
def email():
    return "email"



sched.add_interval_job(getv,seconds=1)
sched.add_interval_job(RecordData,seconds=5) 
#t = threading.Timer(1.0,getv)
#t.start()
'''def thread1():
    threading.Timer(1,getv)
    #time.sleep(1)
    thread1()
'''

if __name__=='__main__':
    app.run('0.0.0.0',port=8080,debug=True)
    #thread.start_new_thread(getv,(0.2,)) 
    #sched.add_interval_job(getv,seconds=1)
