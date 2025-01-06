#******************************************************************************#
#   Licensing: This code is distributed under the GNU LGPL license.
#
#   Modified: Decembre 2023 - January 2024
#
#   Author: MEHDI AYOUZ LGPM CENTRALESUPELEC
#           mehdi.ayouz@centralesupelec.fr
#           
#           MARIYA V. SOSNOVA
#           mariya.v.sosnova@gmail.com
#
#   Optimized for package usage: MARIYA V. SOSNOVA
#           mariya.v.sosnova@gmail.com
#
#******************************************************************************#

import time

from ex7_2D import QM_calculations
import matplotlib.pyplot as plt
from scipy.integrate import simps
from pylab import *
import numpy as np


InputData		= lambda:0
InputData.Dimensionality = 2
InputData.calctype = 8

InputData.Temporal = 1

InputData.isCheckOld = False
InputData.Nkx = 31
InputData.Nky  = 32

#   Set up intial wavepacket;
InputData.k0x = 1
InputData.k0y = 0
InputData.a0x = 30
InputData.a0y = 10
InputData.xc_WP = -25 # center of wave packet
InputData.yc_WP	= 0 # center of wave packet


InputData.epsilon = 1e-5

	#  time parameters
InputData.Nt = 2000
InputData.delta_t = 0.1

	#  Chebyshev's expansion parameters
InputData.Nc_max = 10000
InputData.amin	= 5e-7



OutData = QM_calculations(InputData)
print (type(OutData))
e = 1.6e-19
m = 9.11e-31            #Electron mass in kg
hbar = 1.054e-34        #redused Planck constant in 6.5821e-16 eV*s or 1.054e-34 J*s
h = 2*np.pi*1.054e-34   #Planck constant J*s


# t = OutData.get('time')
# H_average = 	OutData.get('H_average')	
# Delta_X_analytic =	OutData.get('Delta_X_analytic')
# Delta_Y_analytic =	OutData.get('Delta_Y_analytic')
# norma =	OutData.get('norm')
# Heisenberg = OutData.get('Heisenberg')
# Delta_X = OutData.get('Delta_X')
# Delta_Y =	OutData.get('Delta_Y')
# Delta_Px=	OutData.get('Delta_Px')
# Delta_Py =	OutData.get('Delta_Py')
# x_average =	OutData.get('x_average')
# x_average =	OutData.get('y_average')
# px_average = OutData.get('px_average')
# py_average = OutData.get('py_average')
# Heisenberg = OutData.get('Heisenberg')
# Heisenberg_X =	OutData.get('Heisenberg_X')	
# Heisenberg_Y =	OutData.get('Heisenberg_Y')

