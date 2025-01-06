#******************************************************************************#
#   Licensing:
#
#    This code is distributed under the GNU LGPL license.
#
#   Modified:
#
#    August 17th 2023
#
#   Author:
#
#    MEHDI AYOUZ LGPM CENTRALESUPELEC
#    mehdi.ayouz@centralesupelec.fr
#    Bat DUMAS C421. 0141131603
#
#   Optimized and improved for package usage by Alexander V. KOROVIN
#    a.v.korovin73@gmail.com & M.SOSNOVA mariya.v.sosnova@gmail.com
#
#******************************************************************************#

from ex1 import QM_calculations
import matplotlib.pyplot as plt
# import matplotlib
# matplotlib.use('TkAgg')
import numpy as np
from scipy.integrate import simps
from sympy.physics.wigner import clebsch_gordan


InputData = lambda:0

InputData.energy_i = -1 / 5  # box parameter
InputData.l_partial_i = 0  # box parameter

InputData.energy_f = 1 / 2  # box parameter
InputData.l_partial_f = 1  # box parameter

InputData.npoints = 1000  # box parameter
InputData.r_min = 0.01
InputData.r_max = 10


InputData.npoints_ph = 100
InputData.r_min_ph = 0.5
InputData.r_max_ph = 25
InputData.n_i = 3
InputData.m_i = 0
InputData.mu_i = 1.3479
InputData.N_E = 50
InputData.l_partial_i_ph = 0  # box parameter
InputData.l_partial_f_ph = 0  # box parameter
InputData.quant_def_i = 0.8
InputData.quant_def_f = 0.8833

InputData.subtype = 3

OutData = QM_calculations(InputData)

r_ph = OutData.get('r_ph')
chi_f = OutData.get('chi_f')

r_fi = OutData.get('r_fi')
cross_section = OutData.get('cross_section')
cross_section2 = OutData.get('cross_section2')

energy_in = OutData.get('energy_i')
energy_f = OutData.get('energy_f')


nE = 50
iE = nE-1

print ('initial energy is',energy_in)

print('Energy-normalized final state for energy E=',energy_f[iE]*27.3,'eV')
plt.title('Final state $\chi_f(r)$')
plt.plot(r_ph, chi_f, '-r', label='continuum Coulomb function')
plt.legend(loc='best', fancybox=True, shadow=True)
plt.ylim(-2, 2)
plt.grid()
plt.show()

print('energy_fi', energy_f)
print('Photoinization cross section for Na in the ground state 3S')
plt.plot(energy_f, cross_section, '-g', label='c.s.')
plt.plot(energy_f, cross_section2, '-g', label='c.s.')

plt.legend(loc='best', fancybox=True, shadow=True)
#plt.ylim(-2, 2)
plt.grid()
plt.show() 

