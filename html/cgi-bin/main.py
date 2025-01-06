#!/usr/bin/env python3

##!/home/mariya/Supelec_QTech_09_11/site_EnsFQ_II_2023/QTech_CUDA_venv/bin/python
# coding: utf-8

 
import os
import re
import sys
import json


# trace cgi errors
import traceback

import codecs
from collections import namedtuple
import cgi
from sklearn.model_selection import train_test_split
from common import compar_imput_data


#import http.cookies

isTest = False

#isTest = True
subtype = 1
calctype = 5

try:

	from datetime import datetime
	from time import process_time
#	import timeit
#	from time import clock # before 3.8

	from common import json_zip,json_zero
	import pickle


# Retrieve the request data from the appropriate field
#	json_inputdata = form.getvalue('request_data')


#	sys.stderr = sys.stdout
#	json_inputdata = sys.stdin.readline()

	content_length_str = os.environ.get('CONTENT_LENGTH', '')
	if content_length_str.isdigit():
		content_length = int(content_length_str)
	else:
		content_length = 0
	json_inputdata = sys.stdin.buffer.read(content_length)
#	json_inputdata = ''

	if json_inputdata == '' or json_inputdata == b'':
		print("Content-type: text/html\n")
		# print('<br>')
		print('Input is empty. Run in the test mode!')
		print('<br>Use: http://qtechedu.centralesupelec.fr/cgi-bin/main.py?calctype=N')
		print('<br>or (for local version) http://localhost:8080/cgi-bin/main.py?calctype=N')
		print('<br> where N is the exercise number')
		print('<br>    0 -  statistics')
		print('<br>')
		print('json_inputdata0 = ', json_inputdata)
		print('<br>')
		isTest = True


#               import os
#
#               print("Current Working Directory:", os.getcwd())
#
#               # Get the path to the script being executed
#               script_filename = os.environ.get('SCRIPT_FILENAME', 'Unknown')
#               print(f"The scrifrom ex4 import QM_calculationspt is being executed from: {script_filename}<br>")
#
#               # Print all environment variables
#               for key, value in os.environ.items():
#                       print(f"{key}: {value}<br>")
#
#
#               import pkg_resources
#
#               # Get a list of installed distributions
#               installed_distributions = pkg_resources.working_set
#
#               # Print information about each installed distribution
#               for distribution in installed_distributions:
#                       print(f"{distribution.project_name} ({distribution.version})<br>")
#


	try:
		clientIP = os.environ["REMOTE_ADDR"]
	except:
		clientIP = []


	if isTest:
		fs = cgi.FieldStorage()
		if "calctype" in fs:
			calctype = int(fs['calctype'].value)
			print("<br>Type key exists in the input (calctype = {0})".format(calctype))

		if calctype==0:
			from common import show_sqltable
			print('<br>Current IP: ',clientIP)
			print('<br>')
			show_sqltable()
			print('<br><br>')
		elif calctype==1:
			if subtype==1:
				json_inputdata = '''{"calctype":1,"subtype":1,"energy_i":-0.2,"l_partial_i":0,"npoints":1000,"r_min":0.01,"r_max":10}'''
			elif subtype==2:
				json_inputdata = '''{"calctype":1,"subtype":2,"energy_f":0.5,"l_partial_f":1, "npoints":1000,"r_min":0.01,"r_max":10}''' 
			elif subtype==3:
				json_inputdata = '''{"calctype":1,"subtype":3,"l_partial_i_ph": 1,"l_partial_f_ph": 2,"n_i":3,"m_i": 0, "quant_def_i": 0.8,"quant_def_f": 0.0148972,"N_E":50,"npoints":100,"r_min":0.5,"r_max":25}'''	
		elif calctype==2:
			json_inputdata = '''{"calctype":2,"npoints_r":1000,"r_min":0.05,"r_max":20,"mass_1":12,"mass_2":15.999,"j_to_print":3,"v_max":4,"j_max":30,"m":0,"m_p":0}'''
		elif calctype==3:
			json_inputdata = '''{"calctype":3,"x_min":-8,"x_max":8,"n_state":1,"n":200,"n_samples":5000,"n_samples_print": 5, "learning_rate":0,"training_iter":100,"batch_size":64}'''		
		
		elif calctype==4:
			json_inputdata = '''{"calctype":4,"N":20,"Ej_Ec":1}'''		
		elif calctype==5:
			if subtype==0:
				json_inputdata = '''{"calctype":5,"subtype":0,"U":1,"E0":0.5,"dp": 10,"Phi_s": 4.7,"Phi_t": 5.3,"d": 10,"S": 157,"V": 7}'''			
			if subtype==1:
				json_inputdata = '''{"calctype":5,"subtype":1,"U":1,"E0":0.5,"dp": 10,"Phi_s": 4.7,"Phi_t": 5.3,"d": 10,"S": 157,"V": 7}'''			
			if subtype==2:
				json_inputdata = '''{"calctype":5,"subtype":2,"U":1,"E0":0.5,"dp": 10,"Phi_s": 4.7,"Phi_t": 5.3,"d": 10,"S": 157,"V": 7}'''			
		elif calctype==8:
				json_inputdata = '''{"calctype":8,"Pot_Type":31,"Type":0,"Nx":50,"Ny":49,"x0":-50,"xL":50,"y0":-50,"yL":50,"slit_d":5,"slit_ls":10,"slit_ly":1,"slit_nslits":3,"V0":100,"mu":1,"xc_WP":-25,"yc_WP":0,"a0x":10,"a0y":30,"k0x":1,"k0y":0,"Nkx":25,"Nky":26,"Nt":60,"dt":0.5,"Nc_max":10000,"amin":5e-7,"epsilon":0.01,"Temporal":3}'''


		else:
			pass
			sys.stdout = open(os.devnull, 'w')
		print('<br>json_inputdata=',json_inputdata)
		print('<br>')

	# Parse JSON into an object with attributes corresponding to dict keys.
	InputData = json.loads(json_inputdata, object_hook=lambda d: namedtuple('InputData', d.keys())(*d.values()))

#	import pprint 
#	# Get the list of user's 
#	# environment variables 
#	env_var = os.environ 
#	# Print the list of user's 
#	# environment variables 
#	print("<br>User's Environment variable:") 
#	pprint.pprint(dict(env_var), width = 1) 
#	print('<br><br>')



	# get session ID
	# add fields
	tmp = namedtuple('InputData',InputData._fields+('sessionID',...))
	for fi in InputData._fields:
		setattr(tmp,fi,InputData.__getattribute__(fi))
	InputData = tmp



	print('<br><br>file list in .', os.listdir("."))
	try:
		os.chdir('cgi-bin')
		print('<br><br>file list in .', os.listdir("."))
	except:
		print('cgi-bin is missing')
	print('<br><br>')



	import uuid
	InputData.sessionID = "SI{0}".format(uuid.uuid1())
#	InputData.sessionID = "SI{0}".format(uuid.uuid4())
	print('<br>InputData.sessionID=',InputData.sessionID)


	## Run calculation in PYTHON
	if InputData.calctype==1:
		from ex1 import QM_calculations
	elif InputData.calctype==2:
		from ex2 import QM_calculations
	elif InputData.calctype==3:
		from ex3 import QM_calculations
	elif InputData.calctype==4:
		from ex4 import QM_calculations
	elif InputData.calctype==5:
		from ex5 import QM_calculations
	elif InputData.calctype==8:
		from ex7_2D import QM_calculations #for ex6 we use this name for to match with QMech
#	from profile import profile
#	from time import sleep
#	run_profiling = profile(QM_calculations(InputData))
#	OutData = run_profiling()

	session_start_datetime = datetime.now()
	if isTest:
		print('<br>')
	wtime1 = process_time()

#	if os.name == 'nt':

	if isTest:
		try:
			#from common import memory_usage
			#rss1 = memory_usage()
			#print('rss1=',rss1,'<br>')
			import resource
			res1 = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
		except:
			res1 = []

	OutData = QM_calculations(InputData)
	try:
		import resource
		res2 = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
		if isTest:
			print('<br>start: res1=',res1)
			print('<br>end: res2=',res2,'<br>')
		OutData['calRAM'] = res2/1024 # in MB
	except:
		res2 = []
		OutData['calRAM'] = 0
#	rss2 = memory_usage()
#	print('rss2=',rss2,'<br>')


	OutData['caltime'] = process_time() - wtime1
	if isTest:
		print ('<br>    Elapsed wall clock time = %g seconds.'  % ( OutData.get('caltime') ))

#	import psutil
#	# gives a system status
#	mem = psutil.virtual_memory()
#	print('<br>used CPU=',psutil.cpu_percent(),'%, memory available=', mem.available/2**30,'GB (total=',mem.total/2**30,'GB), used=',mem.used/2**30,'GB')
#	print('<br>used CPU=%g %%, memory available=%6.4gGB (total=%6.4gGB), used=%6.4gGB'%(psutil.cpu_percent(), mem.available/2**30,mem.total/2**30,mem.used/2**30))

	OutData['sessionID'] = InputData.sessionID
	try:
		from common import add_sqlrecord
		add_sqlrecord(session_start_datetime.strftime('%Y-%m-%d %H:%M:%S'), OutData.get('caltime'),OutData.get('calRAM'), InputData.get('calctype'), clientIP)
	except Exception as e: # work on python 3.x
		if isTest:
			print('<br>There are problems with mySQL!<br>'+ str(e)+'<br><br>')


	if isTest:
		print ('<br> InputData = ', InputData)
		print ('<br> Elapsed wall clock time=', OutData)
		print ('<br>')
	else:
		# json_start_index = OutData.find('{')

	# if json_start_index != -1:
		# Extract JSON content
		# json_data = OutData[json_start_index:]
		sys.stdout = sys.__stdout__

		if InputData.calctype != 3:
			print("Content-type: text/html\n")

		# sys.stdout = sys.__stdout__
		# print ('Content-Type: application/json\n')
		else:
			if (compar_imput_data(InputData)):
				print("Content-type: text/html\n")
				
			else:
				os.system('cls' if os.name == 'nt' else 'clear')

				# print("Content-type: text/html\n")

# return json data: previous version
	# jsondata = props(OutData) - function QM_calculations(InputData)=> diction

# converted the OutData (in format dicctioner) to a binary file. 
	# Execute once for each exercise or if the data by default have changed

	# file = open('../data/OutData_ex3_new.bin','wb')
	# pickle.dump(OutData, file)
	# file.close


	print (json_zero(OutData))


#	print (json_zip(jsondata))
#	print(json.dumps(jsondata))


except Exception as e:
	print("\n\n<PRE>")
	print("\n\nexception1 = ", e)
	traceback.print_exc()
