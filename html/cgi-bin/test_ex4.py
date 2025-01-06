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

from ex4 import QM_calculations
import matplotlib.pyplot as plt
from scipy.integrate import simps
# from sklearn.model_selection import train_test_split

from pylab import *
import numpy as np
from Quantum_mechanics import au_to_amu, au_to_Ang, au_to_eV, au_to_sec, Ryd, au_cm, au_debye


InputData = lambda:0

InputData.calctype = 4
InputData.n = 20
InputData.EC =  3*10**(-9) 
InputData.x = 5


OutData = QM_calculations(InputData)

energies = OutData.get('energies')
n_g = OutData.get('n_g')


print ('energies =', energies)
print ('n_g =', n_g)

for j in range (3):
    plt.plot(n_g, energies[:, j]/3*10**(-9))  
    plt.savefig(f"j") 
