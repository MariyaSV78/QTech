# coding: utf-8


##	Uninstalling mysql:
#	sudo apt-get purge mysql-server
#	sudo apt-get autoremove
#	sudo apt-get autoclean
##	Re-Installing mysql:
#	sudo apt-get update
#	sudo apt-get install mysql-server

# ? pip3 install mysql-connector
# ? gedit /etc/mysql/my.cnf
# ? gedit /etc/mysql/mysql.conf.d/mysqld.cnf
# sudo pip3 install  mysql-connector-python-rf

try:
    import mysql.connector
except ImportError:
    pass

def sql_connector(DB="EnsPhys"):
	mydb = mysql.connector.connect(
		host="localhost",
		user="root",
		passwd="Cs+2052019",
		database=DB
	)

	mycursor = mydb.cursor(buffered=True)
	return mydb,mycursor

def create_sqlDB(DB="EnsPhys"):
	print('<br>create db:')
	mydb = mysql.connector.connect(
		host="localhost",
		user="root",
		passwd="Cs+2052019",
	)

	mycursor = mydb.cursor(buffered=True)

	print('<br>create db '+DB)
	mycursor.execute("CREATE DATABASE "+DB) # create db
#	show_sqlDB(DB)

def show_sqlDBs():
	mydb = mysql.connector.connect(
		host="localhost",
		user="root",
		passwd="Cs+2052019",
	)
	mycursor = mydb.cursor(buffered=True)

	print('<br>show existing DBs:')
	mycursor.execute("SHOW DATABASES") # show existing db
	for x in mycursor:
		print('<br>',x)

def create_sqltable(DB="EnsPhys",table='visitors'):
	mydb,mycursor = sql_connector(DB)

	print('<br>create table '+table)
	mycursor.execute("CREATE TABLE "+table+" (id INT AUTO_INCREMENT PRIMARY KEY,sessionTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, sessionDuration FLOAT(10,6), usedRAM FLOAT(10,2), calctype INT, sessionIP VARCHAR(15))")
	show_sqltables(DB)

def insertfield_sqltable(field,DB="EnsPhys",table='visitors'):
	mydb,mycursor = sql_connector(DB)

	print('<br>insert field '+field+' to table '+table)
	mycursor.execute("ALTER TABLE "+table+" ADD COLUMN "+field) 
	mydb.commit()

def clear_sqltable(DB="EnsPhys",table='visitors'):
	mydb,mycursor = sql_connector(DB)

	print('<br>clear table:')
	mycursor.execute("TRUNCATE TABLE "+table)
	mydb.commit()

def delete_sqlDB(DB="EnsPhys"):
	mydb = mysql.connector.connect(
		host="localhost",
		user="root",
		passwd="Cs+2052019",
	)
	mycursor = mydb.cursor(buffered=True)

	print('<br>delete DB '+DB)
	mycursor.execute("DROP DATABASE IF EXISTS "+DB)
	mydb.commit()

def delete_sqltable(DB="EnsPhys",table='visitors'):
	mydb,mycursor = sql_connector(DB)

	print('<br>delete table '+table)
	mycursor.execute("DROP TABLE IF EXISTS "+table+" CASCADE")
 # DROP [TEMPORARY] TABLE [IF EXISTS] table_name [, table_name] [RESTRICT | CASCADE]
	mydb.commit()

def show_sqltable(DB="EnsPhys",table='visitors'):
	mydb,mycursor = sql_connector(DB)

	print('<br>show table '+table)
	mycursor.execute("SELECT * FROM "+table) # all rows, or add WHERE with conition (for example: id='1')
	myresult = mycursor.fetchall()
	print('with ',mycursor.rowcount,' total number of rows') 
	for x in myresult:
		print('<br>',x)

def show_sqltables(DB="EnsPhys"):
	mydb,mycursor = sql_connector(DB)

	print('<br>show existing tables in '+DB)
	mycursor.execute("SHOW TABLES")
	for x in mycursor:
		print('<br>',x)




def add_sqlrecord(session_start_datetime,caltime,usedRAM,calctype,clientIP,DB="EnsPhys",table='visitors',isSave=True):
	mydb,mycursor = sql_connector(DB)

	sql = "INSERT INTO "+table+" (sessionTime,sessionDuration,usedRAM,calctype,sessionIP) VALUES (%s, %s, %s, %s, %s)"
	val = (session_start_datetime, caltime,usedRAM, calctype, clientIP)
	mycursor.execute(sql, val) # or executemany if val is an aaray
	print('<br> mysql: ',mycursor.rowcount, " record(s) was inserted. ") 

	if isSave:
		mydb.commit()
		mycursor.close()
		mydb.close()

