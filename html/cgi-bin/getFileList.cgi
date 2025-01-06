#!/usr/bin/env python3
# coding: utf-8
 
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


from common import json_zip,json_zero,props

isTest = False
#isTest = True



sys.stderr = sys.stdout
try:
	json_inputdata = sys.stdin.read() 
	if json_inputdata=='':
		print("Content-type: text/html\n")
		print('<br>')
		print('Input is empty. Run in the test mode!')
		print('<br>')
		print('json_inputdata0=',json_inputdata)
		print('<br>')
		isTest = True

	if isTest:
		json_inputdata = '''{"nex":1,"folder":"TD"}'''
	else:
		sys.stdout = open(os.devnull, 'w')
	print('<br>json_inputdata=',json_inputdata)
	print('<br>')

	# Parse JSON into an object with attributes corresponding to dict keys.
	InputData = json.loads(json_inputdata, object_hook=lambda d: namedtuple('InputData', d.keys())(*d.values()))

	print('<br>InputData=',InputData)


	mypath = '''../{0}/{1}/'''.format(InputData.folder,InputData.nex)
	print('<br>mypath=',mypath)

	OutData = lambda:0

	from os import listdir
	from os.path import isfile, join
	OutData.filenames = [f for f in listdir(mypath) if isfile(join(mypath, f))]

	#import os.path
	#fname, extension = os.path.splitext(filename)

	print ('<br>')
	print(OutData.filenames)


	if isTest:
		print('<br>OutData=',OutData)


	if not isTest:
		sys.stdout = sys.__stdout__
		print("Content-type: text/html\n")

	# return json data
	jsondata = props(OutData)
	# jsondata = OutData

	print (json_zero(jsondata))




except:
	print("\n\n<PRE>")
	traceback.print_exc()













