#******************************************************************************#
#   Licensing: This code is distributed under the GNU LGPL license.
#
#   Modified: Decembre 2023 - January 2024
#
#   Author: MEHDI AYOUZ LGPM CENTRALESUPELEC
#           mehdi.ayouz@centralesupelec.fr
#
#           VIATCHESLAV KOKOOULINE University of Central Florida, USA 
#           vyacheslav.kokoulin@ucf.edu
#
#           MICHAL PAWELKIEWICH LGPM CENTRALESUPELEC
#           michal.pawelkiewicz@centralesupelec.fr
#
#   Optimized for package usage: MARIYA V. SOSNOVA
#           mariya.v.sosnova@gmail.com
#
#******************************************************************************#

import time

from ex3 import QM_calculations
import matplotlib.pyplot as plt
from scipy.integrate import simps
# from sklearn.model_selection import train_test_split

from pylab import *
import numpy as np
from Quantum_mechanics import au_to_amu, au_to_Ang, au_to_eV, au_to_sec, Ryd, au_cm, au_debye


InputData = lambda:0

InputData.calctype = 3
InputData.x_max = 8   
InputData.x_min = -8     
InputData.n = 200
InputData.n_state = 1 
InputData.n_samples = 5000
InputData.n_samples_print = 1500

InputData.learning_rate = 0.0005
InputData.training_iter = 100
InputData.batch_size = 64


OutData = QM_calculations(InputData)

x = OutData.get('x')
alpha = OutData.get('alpha')

#test PP
# E0 = OutData.get('E0')
V = OutData.get('V')         #potential
waves = OutData.get('waves') #real phi

#prediction PP
pred = OutData.get('pred')          #prediction phi
E = OutData.get('E')                #teoretical E
E_emp = OutData.get('E_emp')        #empirical E
MSE_PP = OutData.get('MSE_PP')
MSE_E_PP = OutData.get('MSE_E_PP')

#prediction HO n = 10
pred_HO = OutData.get('pred_HO')                #prediction phi
phi0_HO = OutData.get('phi0_HO')                #real phi
potential_HO = OutData.get('potential_HO')      #potential 
E_HO = OutData.get('E_HO')                      #teoretical E
E_emp_HO  = OutData.get('E_emp_HO')             #empirical E
MSE_HO = OutData.get('MSE_HO')
MSE_E_HO = OutData.get('MSE_E_HO')

#prediction Morse n = 10
pred_morse = OutData.get('pred_morse')                #prediction phi
phi0_morse = OutData.get('phi0_morse')                #real phi
potential_morse = OutData.get('potential_morse')      #potential 
E_morse = OutData.get('E_morse')                      #teoretical E
E_emp_morse = OutData.get('E_emp_morse')              #empirical E
MSE_morse = OutData.get('MSE_morse') 
MSE_E_morse = OutData.get('MSE_E_morse')  

train_loss = OutData.get('training_loss')  


print ('training_loss = ', train_loss)

print ('E_morse =', type(E_morse))
print ('E_emp_morse =', type(E_emp_morse))
print ('MSE_morse =', type(MSE_morse))
print ('MSE_E_morse =', type(MSE_E_morse))
print ('potential_morse =', type(potential_morse))
print ('phi0_morse =', type(phi0_morse))
print ('pred_morse =', type(pred_morse))

print ('E_emp_HO =', type(E_emp_HO))
print ('E_HO =', type(E_HO))
print ('MSE_HO =', type(MSE_HO))
print ('MSE_E_HO =', type(MSE_E_HO))
print ('potential_HO =', type(potential_HO))
print ('phi0_HO =', type(phi0_HO))
print ('pred_HO =', type(pred_HO))

print ('E_emp =', type(E_emp))
print ('E =', type(E))
print ('waves =', type(waves))
print ('MSE_PP =', type(MSE_PP))
print ('MSE_E_PP =', type(MSE_E_PP))
print ('pred =', type(pred))

# y = np.full_like(x, E[0])

plt.plot(E_HO, E_HO, label='Horizontal Line', color='red')  # plot energy levels
plt.plot(E_HO, E_emp_HO, '.r')
plt.savefig("enrgy_HO_use_file_5000.png")

fig, ax = plt.figure(), plt.axes()
plt.plot(x, phi0_HO[0], color='blue')  # plot energy levels
plt.plot(x, pred_HO[0], 'r')
plt.plot(x, potential_HO[0], 'g')
plt.savefig("WF_HO_use_file_5000.png")



fig, ax = plt.figure(), plt.axes()
plt.plot(E, E, label='Horizontal Line', color='blue')  # plot energy levels
plt.plot(E, E_emp, '.b')
plt.savefig("energy_PP_use_file_5000.png")

fig, ax = plt.figure(), plt.axes()
plt.plot(x, waves[0], color='blue')  # plot energy levels
plt.plot(x, pred[0], 'r')
plt.plot(x, V[0], 'g')
plt.savefig("WF_PP_use_file_5000.png")

fig, ax = plt.figure(), plt.axes()
plt.plot(E_morse, E_morse, label='Horizontal Line', color='blue')  # plot energy levels
plt.plot(E_morse, E_emp_morse, '.b')
plt.savefig("energy_morse_use_file_5000.png")

fig, ax = plt.figure(), plt.axes()
plt.plot(x, phi0_morse[0], color='blue')  # plot energy levels
plt.plot(x, pred_morse[0], 'r')
plt.plot(x, potential_morse[0], 'g')
plt.savefig("WF_morse_use_file_5000.png")