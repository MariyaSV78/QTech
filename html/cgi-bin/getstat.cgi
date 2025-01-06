#!/usr/bin/env python3
# coding: utf-8

# sudo pip install geoip2
import geoip2.database

import os
import sys
import json

# trace cgi errors
import traceback


#import http.cookies

import codecs
from collections import namedtuple

#import timeit
from time import process_time as clock


import numpy as np

from common import json_zip,json_zero,props
from common import add_sqlrecord,show_sqltable,sql_connector
from datetime import datetime,timedelta
import cgi

isTest = False
#isTest = True


def sortByCountry(db,reader):
	from collections import Counter
	countrieslist = Counter()

	for x in db:
		response = reader.city(x[0])
		countrieslist[response.country.name] += 1
#		print('<br>',x,'  countrieslist=',countrieslist)
#	print('<br><br>')

	return countrieslist

def get_stat(Date,newusers,users,connections):
	str = '<table>'
	str += '	<thead>'
	str += '		<tr style="border: 1px solid black;">'
	str += '			<td>Date</td>'
	str += '			<td>№ new users</td>'
	str += '			<td>№ users</td>'
	str += '			<td>№ connections</td>'
	str += '		</tr>'
	str += '	</thead>'

	str += '	<tbody>'
	for n in range(len(Date)):
		str += '	<tr>'
		str += '		<td>{0}</td>'.format(Date[n])
		str += '		<td>{0}</td>'.format(newusers[n])
		str += '		<td>{0}</td>'.format(users[n])
		str += '		<td>{0}</td>'.format(connections[n])
		str += '	</tr>'
	str += '	</tbody>'
	str += '</table>'

	str += '<br>{0} user(s) with {1} total connection(s)'.format(np.sum(users),np.sum(connections))

	return str


def get_fulltable(mycursor,reader):
	mycursor.execute("DESC visitors")
	columntitle = mycursor.fetchall()
#	print([columnname[0] for columnname in columntitle])

	str = '<table>'
	str += '	<thead>'
	str += '		<tr style="border: 1px solid black;">'
	for columnname in columntitle:
		str += '		<td>{0}</td>'.format(columnname[0])
	str += '			<td>City</td>'
	str += '			<td>Country</td>'
	str += '		</tr>'
	str += '	</thead>'

	str += '	<tbody>'
	mycursor.execute("SELECT * FROM visitors ORDER BY sessionTime DESC")
	nIP = [columnname[0] for columnname in columntitle].index('sessionIP')

	for x in mycursor:
		# Replace "city" with the method corresponding to the database
		# that you are using, e.g., "country".
		response = reader.city(x[nIP])

		#response.country.name
		#response.country.iso_code
		#response.subdivisions.most_specific.name
		#response.subdivisions.most_specific.iso_code
		#response.city.name
		#response.postal.code
		#response.location.latitude
		#response.location.longitude

		str += '	<tr>'
		for x0 in x:
			str += '	<td>{0}</td>'.format(x0)
		str += '		<td>{0}</td>'.format(response.city.name)
		str += '		<td>{0}</td>'.format(response.country.name)
		str += '	</tr>'
	str += '	</tbody>'
	str += '</table>'
	return str

def get_table(mycursor,title,reader):
	str = '<table>'
	str += '	<thead>'
	str += '		<tr>'
	str += '			<th colspan="5">{0}</th>'.format(title)
	str += '		</tr>'
	str += '		<tr style="border: 1px solid black;">'
	str += '			<td>IP</td> <td>N connections</td> <td>Spended time,s</td> <td>City</td> <td>Country</td>'
	str += '		</tr>'
	str += '	</thead>'

	str += '	<tbody>'
	for x in mycursor:
		# Replace "city" with the method corresponding to the database
		# that you are using, e.g., "country".
		response = reader.city(x[0])

		#response.country.name
		#response.country.iso_code
		#response.subdivisions.most_specific.name
		#response.subdivisions.most_specific.iso_code
		#response.city.name
		#response.postal.code
		#response.location.latitude
		#response.location.longitude

		str += '	<tr>'
		str += '		<td>{0}</td> <td>{1}</td> <td>{2}</td> <td>{3}</td> <td>{4}</td>'.format(x[0],x[1],x[2],response.city.name,response.country.name)
		str += '	</tr>'
	str += '	</tbody>'
	str += '</table>'
	return str


sys.stderr = sys.stdout
try:
	json_inputdata = sys.stdin.readline() 
	if json_inputdata=='':
		print("Content-type: text/html\n")
		print('<br>Input is empty. Run in the test mode!')
		print('<br>Use: http://prd-mecaqu.centralesupelec.fr/cgi-bin/getstat.cgi?Type=N')
		print('<br> where N=')
		print('<br>    0 -  unsorted data')
		print('<br>    1 -  sorted data by exercice')
		print('<br>    2 -  sorted data by exercice and time')
		print('<br>    3 -  sorted data by exercice and connections')
		print('<br>    4 -  sorted data by day')
		print('<br>    5 -  sorted data by day and time')
		print('<br>    6 -  sorted data by day and connections')
		print('<br>    7 - show new users by time')
		print('<br>')
		isTest = True

	if isTest:
		json_inputdata = '''{"StatType":0}'''
	else:
		sys.stdout = open(os.devnull, 'w')
#	print('<br>json_inputdata=',json_inputdata)
#	print('<br>')

	# Parse JSON into an object with attributes corresponding to dict keys.
	InputData = json.loads(json_inputdata, object_hook=lambda d: namedtuple('InputData', d.keys())(*d.values()))



	fs = cgi.FieldStorage()
#	for key in fs.keys():
#		print("<br>%s = %s" % (key, fs[key].value))
	# http://prd-mecaqu.centralesupelec.fr/cgi-bin/getstat.cgi?StatType=1&x=2
#	print("<br>fs = ",fs)
	if "Type" in fs:
		StatType = int(fs['Type'].value)
		print("<br>Type key exists in the input (Type = {0})".format(StatType))
	else:
		StatType = InputData.StatType

	if "Days" in fs:
		StatDays = int(fs['Days'].value)
		print("<br>Days key exists in the input (Days = {0})".format(StatDays))
	else:
		StatDays = 7



	# This creates a Reader object. You should use the same object across multiple requests as creation of it is expensive.
	reader = geoip2.database.Reader('../Files/GeoLite2-City.mmdb')
	#reader = geoip2.database.Reader("/usr/share/nginx/html/Files/GeoLite2-City.mmdb")

	OutData = lambda:0

	# (id, sessionTime, sessionDuration, usedRAM, calctype, sessionIP
	mydb,mycursor = sql_connector()
	mycursor.execute("SELECT MIN(sessionTime) AS 'Starting time' FROM visitors")
	startingTime = (mycursor.fetchall())[0][0]
	OutData.startingTime = startingTime.strftime("%d-%m-%Y %H:%M:%S")

	mycursor.execute("SELECT MAX(usedRAM) AS 'Max used RAM' FROM visitors")
	MAXusedRAM = (mycursor.fetchall())[0][0]
	OutData.MAXusedRAM = MAXusedRAM

	mycursor.execute("SELECT SUM(sessionDuration) AS 'Total calc time' FROM visitors")
	TotalCalcTime = (mycursor.fetchall())[0][0]
	OutData.TotalCalcTime = TotalCalcTime

	if isTest:
		print ('<br>Statistical measurement started on ',startingTime.strftime("%d-%m-%Y %H:%M:%S"))
		print ('<br>Max used RAM is ',MAXusedRAM,' MB')
		print ('<br>Total simulation time used in server is {0:6.3g} hrs'.format(TotalCalcTime/3600))

	if StatType==0:
		if isTest:
			print('Unsorted data:<br>')
		OutData.table = get_fulltable(mycursor,reader)
	elif StatType==1 or StatType==2 or StatType==3: # sort by time
		if isTest:
			print ('<br><br>Statistics for each exercise:<br>')

		OutData.table = ''
		for nex in range(1,10+1):
			SQLstr = "SELECT sessionIP,COUNT(sessionIP) AS cIP,SUM(sessionDuration) AS sD FROM visitors WHERE calctype={0} GROUP BY sessionIP HAVING cIP>0".format(nex)
			if StatType==2: # sort by time
				SQLstr += " ORDER BY sD DESC"
			elif StatType==3: # sort by connection
				SQLstr += " ORDER BY cIP DESC"
			mycursor.execute(SQLstr)
			if (mycursor.rowcount==0):
				continue
			OutData.table += get_table(mycursor,'Number of connections and server time used for exercise {0}'.format(nex), reader )
			OutData.table += '<br>'
	elif StatType==4 or StatType==5 or StatType==6: # sort by time
		if isTest:
			print ('<br><br>Statistics for {0} day(s) from now:<br>'.format(StatDays))

		OutData.table = ''
		currentTime = datetime.now()
		for nday in range(StatDays):
			Timetmp = currentTime-timedelta(days=nday)
			if Timetmp.date() < startingTime.date():
#				print ('<br>Information is absent for other days<br>')
				break
			day = Timetmp.strftime("%Y-%m-%d")
			SQLstr = "SELECT sessionIP,COUNT(sessionIP) AS cIP,SUM(sessionDuration) AS sD FROM visitors WHERE sessionTime BETWEEN '{0}' AND '{1}' GROUP BY sessionIP HAVING cIP>0".format(day+" 00:00:00",day+" 23:59:59")
			if StatType==5: # sort by time
				SQLstr += " ORDER BY sD DESC"
			elif StatType==6: # sort by connection
				SQLstr += " ORDER BY cIP DESC"
			mycursor.execute(SQLstr) 
			OutData.table += get_table(mycursor,'Number of connections and server time used on {0}'.format(Timetmp.strftime("%d-%m-%Y")), reader )
			OutData.table += '<br>'
	elif StatType==7: # show new users by time
		if isTest:
			print ('<br><br>Statistics for {0} day(s) from now:<br>'.format(StatDays))

		currentTime = datetime.now()

		try:
			mycursor.execute("ALTER TABLE visitors ADD isnew BOOLEAN") 
		except:
			pass
		try:
			mycursor.execute("ALTER TABLE visitors ADD CONSTRAINT preventdupe UNIQUE (sessionIP,isnew)")
		except:
			pass
		mycursor.execute("UPDATE IGNORE visitors SET isnew = true") 
#			mycursor.execute("ALTER TABLE visitors DROP isnew") 

		users = []
		newusers = []
		connections = []
		Date = []
		usersCountries = []
		newusersCountries = []
		nday = 0
		while True:
			Timetmp = currentTime-timedelta(days=nday)
			nday = nday+1
			if Timetmp.date() < startingTime.date():
				break
			day = Timetmp.strftime("%Y-%m-%d")
			SQLstr = "SELECT sessionIP FROM visitors WHERE sessionTime BETWEEN '{0}' AND '{1}'".format(day+" 00:00:00",day+" 23:59:59")
			mycursor.execute(SQLstr)
			connections.append(mycursor.rowcount)

			SQLstr = "SELECT DISTINCT(sessionIP) AS sessionIP FROM visitors WHERE sessionTime BETWEEN '{0}' AND '{1}'".format(day+" 00:00:00",day+" 23:59:59")
			mycursor.execute(SQLstr)
			users.append(mycursor.rowcount)
			usersCountries.append(sortByCountry(mycursor.fetchall(),reader))

			SQLstr = "SELECT sessionIP FROM visitors WHERE isnew = true AND sessionTime BETWEEN '{0}' AND '{1}'".format(day+" 00:00:00",day+" 23:59:59")
			mycursor.execute(SQLstr)
			newusers.append(mycursor.rowcount)
			newusersCountries.append(sortByCountry(mycursor.fetchall(),reader))

			Date.append(Timetmp.strftime("%d-%m-%Y"))


		Allconnections = np.sum(connections)
		Allusers = np.sum(users)

		OutData.usersCountries		= usersCountries[::-1]
		OutData.newusersCountries	= newusersCountries[::-1]
		OutData.users				= users[::-1]
		OutData.newusers			= newusers[::-1]
		OutData.connections			= connections[::-1]
		OutData.Date				= Date[::-1]
		OutData.table				= get_stat(OutData.Date,OutData.newusers,OutData.users,OutData.connections)

	if isTest:
		print(OutData.table)
		print ('<br><br>')
	reader.close()

	if not isTest:
		sys.stdout = sys.__stdout__
		print("Content-type: text/html\n")

	# return json data
	jsondata = props(OutData)

	print (json_zero(jsondata))




except:
	print("\n\n<PRE>")
	traceback.print_exc()


