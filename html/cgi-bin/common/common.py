# coding: utf-8

import cgi
import html
import json
import os
import http.cookies

from common.NumpyEncoder import props
 

#from _wall import Wall


def takeName(formData,str,type="s",valdefault=0):
	val = formData.getvalue(str)
	try:
		val = html.escape(val)
	except:
#		print("html.escape(val) = ",val)
		val = valdefault

	if type=="s":
		if val==None and valdefault==0:
			val=""
	if type=="i":
		if val==None:
			val = valdefault
		else:
			try:
				val = int(val)
			except:
#				print("except i=",val)
				val = valdefault
	if type=="f":
		if val==None:
			val = valdefault
		else:
			try:
				val = float(val)
			except:
#				print("except f=",val)
				val = valdefault
	if type=="b":
		if val==None:
			val = valdefault
		else:
			try:
				val = str2bool(val)
			except:
#				print("except b=",val)
				val = valdefault


	return val

def str2bool(v):
	return v.lower() in ("yes", "true", "t", "1")

def htmlTop(title_str):
	print("""Content-type:text/html\n\n
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="utf-8"/>
					<title>{0}</title>
					<link href="/css/well.css" rel="stylesheet" type="text/css" media="all">
					<link href="/css/tooltip.css" rel="stylesheet" type="text/css" media="all">
				</head>
				<body>""".format(title_str))


def htmlTail():
	print("""
			</body>
		</html>
		""")



def check_cookie():
	cookie = http.cookies.SimpleCookie(os.environ.get("HTTP_COOKIE"))

	#	wall = Wall()
	#	session = cookie.get("session")
	#	if session is not None:
	#		session = session.value
	#	user = wall.find_cookie(session)  # Ищем пользователя по переданной куке


	name = cookie.get("name")
	if name is None:
		print("Set-cookie: name=value")
		print("Content-type: text/html\n")
		print("Cookies!!!")
	else:
		print("Content-type: text/html\n")
		print("Cookies:")
		print(name.value)

def compar_imput_data(input_data):
	""" Comparison of imput data with default data (json_inputdata).
		return: True - if input_data = json_inputdata;
				Faule - input_data != json_inputdata;
	"""
	json_inputdata = '''{"calctype": 3,"x_min": -8,"x_max": 8, "n_state": 1, "n": 200, "n_samples": 5000, "n_samples_print": 5, "learning_rate": 0.0005, "training_iter": 100, "batch_size": 64}'''

	# Parse input JSON into dictionary.   
	InputData0 = json.loads(json_inputdata)

	del InputData0["n_samples_print"]
	InputData_D = props(input_data)
	del InputData_D["n_samples_print"]

	equal = True
	# print("InputData_D", InputData_D)
	# print("InputData_0", InputData0)
	# Comparison of InputData and InputData0 (default data)
	for key in InputData0:
		if InputData0.get(key) != InputData_D.get(key):
			equal = False
			break
	
	return equal
