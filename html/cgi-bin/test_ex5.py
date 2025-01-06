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

from ex5 import QM_calculations
import matplotlib.pyplot as plt
from scipy.integrate import simps
from pylab import *
import numpy as np

InputData = lambda:0
InputData.subtype = 1
InputData.calctype = 5
   
InputData.U = 1   #U in J
InputData.E0 = 0.5  #E0 in J
InputData.dp = 10    #dp in A

InputData.Phi_s = 4.7        #Phi_s in J
InputData.Phi_t = 5.3       #Phi_t in J
InputData.V = 0.3                    #V in V
InputData.d = 10            #d in m
InputData.S = 157           #S in m^2
print (type(InputData))



OutData = QM_calculations(InputData)

e = 1.6e-19
m = 9.11e-31            #Electron mass in kg
hbar = 1.054e-34        #redused Planck constant in 6.5821e-16 eV*s or 1.054e-34 J*s
h = 2*np.pi*1.054e-34   #Planck constant J*s


Ar = OutData.get('Ar')
Br = OutData.get('Br')
Cr = OutData.get('Cr')
Dr = OutData.get('Dr')

Ai = OutData.get('Ai')
Bi = OutData.get('Bi')
Ci = OutData.get('Ci')
Di = OutData.get('Di')

z_min = OutData.get('z_min')
z_max = OutData.get('z_max')
z = OutData.get('z')
barrier_energy_values = OutData.get('barrier_energy_values')
wf_energy_values = OutData.get('wf_energy_values')
T1 = OutData.get('T1')
E = OutData.get('E')

V0 = OutData.get('V0')
J = OutData.get('J')
J_1 = OutData.get('J_1')
J_2 = OutData.get('J_2')
J_3 = OutData.get('J_3')

print(type(OutData))

if InputData.subtype == 1 or InputData.subtype == 0:
    print(f"A={Ar}{Ai}j")
    print(f"B={Br}{Bi}j, C={Cr}{Ci}j")
    print(f"D={Dr}{Di}j")
    print(f"wf_energy_values={wf_energy_values}")


    # Plot the energy and wave function dependencies
    fig, ax1 = plt.subplots()

    ax1.set_ylabel('z, $\AA$')
    ax1.set_xlabel('Energy, eV')
    ax1.plot(barrier_energy_values, z*1e9, 'black')

    ax1.tick_params(axis='y')
    ax1.axvline(x=InputData.E0/e, color='red', linestyle='--')
    ax1.axvline(x=InputData.U/e, color='green', linestyle='--')
    # Add labels near the vertical dashed lines
    ax1.text(InputData.E0/e-0.01, z_max*1e9, 'E0', color='red', verticalalignment='bottom', horizontalalignment='right')
    ax1.text(InputData.U/e-0.01,  z_max*1e9, 'U', color='green', verticalalignment='bottom', horizontalalignment='right')

    ax2 = ax1.twiny()  
    color = 'tab:blue'
    ax2.plot(np.real(wf_energy_values),  z*1e9, color=color)

    ax2.set_ylim([-3.9, 4.9])
    ax2.set_xlim([-1.45, 1.7])
    ax1.set_xlim([-0.005, 1.1])

    ax2.set_xticks([])

    plt.savefig('ex5')

if InputData.subtype == 2 or InputData.subtype == 0:
    print(J, J_1, J_2, J_3)

    # Plot each interval's I(V) dependency
    plt.plot(V0, J * InputData.S, label="All Range: general expression for I_t", color='black')
    plt.scatter(V0, J_1 * InputData.S, label="Low-Voltage Range", color='blue')
    plt.scatter(V0, J_2 * InputData.S, label="Intermediate-Voltage Range", color='red')
    plt.scatter(V0, J_3 *InputData.S, label="High-Voltage Range", color='green')
    # plt.plot(V4, J_4, label="High-Voltage Range (if eV > phi + mu)", color='orange')

    # Add labels and legend
    plt.xlabel('Voltage (V)')
    plt.ylabel('Current (I)')
    plt.title('Current-Voltage Dependency')
    plt.legend()
    # plt.ylim([0,2e-6])

    # Show the plot
    plt.grid(True)
    plt.savefig('ex5_2')