#******************************************************************************#
#   Licensing: This code is distributed under the GNU LGPL license.
#
#   Modified: Decembre 2023 - Juin 2024
#
#   Author: MEHDI AYOUZ LGPM CENTRALESUPELEC
#           mehdi.ayouz@centralesupelec.fr
#
#           VIATCHESLAV KOKOOULINE University of Central Florida, USA 
#           vyacheslav.kokoulin@ucf.edu
#
#   Optimized for package usage: MARIYA V. SOSNOVA
#           mariya.v.sosnova@gmail.com
#
#******************************************************************************#

import mpmath as mp
import numpy as np
from common import json_zip,json_zero,props

# Define the conditions for energy dependency
def barrier_energy(z, d, U):
    out = np.zeros_like(z)
    cond = z <= 0
    out[cond] = 0
    cond = np.logical_and(z > 0,  z < d)
    out[cond] = U/1.6e-19
    cond = z >= d
    out[cond] = 0
    return out
    
# Define the conditions for wave function dependency
def wave_function(z, d, x, k, kappa):
    out = np.zeros_like(z, dtype=np.complex64)
    cond = z <= 0
    out[cond] = np.exp(1j*k*z[cond]) + x[0]*np.exp(-1j*k*z[cond])
    cond = np.logical_and(z > 0,  z < d)
    out[cond] = x[1]*np.exp(-kappa*z[cond]) + x[2]*np.exp(kappa*z[cond])
    cond = z >= d
    out[cond] = x[3]*np.exp(1j*k*z[cond])
    return out


def QM_calculations(InputData):
    OutData = lambda:0

    calctype = InputData.subtype

    e = 1.6e-19
    m = 9.11e-31            #Electron mass in kg
    hbar = 1.054e-34        #redused Planck constant in 6.5821e-16 eV*s or 1.054e-34 J*s
    h = 2*np.pi*1.054e-34   #Planck constant J*s


    U = InputData.U * e
    E0 = InputData.E0 * e
    dp = InputData.dp * 1e-10
    
    Phi_s = InputData.Phi_s * e
    Phi_t = InputData.Phi_t * e
    V = InputData.V 
    d = InputData.d * 1e-10
    S = InputData.S * 1e-18

 
    # if calctype == 1 or calctype == 0:
    k = (np.sqrt(2 * m * E0)/hbar)
    kappa = (np.sqrt(2 * m * (U - E0))/hbar)



    M = np.array([[1,-1,-1,0], 
            [-1j*k, kappa, -kappa, 0], 
            [0, np.exp(-kappa*dp), np.exp(kappa*dp), -np.exp(1j*k*dp)], 
            [0, -kappa*np.exp(-kappa*dp), kappa*np.exp(kappa*dp), -1j*k*np.exp(1j*k*dp)]])

    N = np.array([-1, -1j*k, 0, 0])

    x = np.linalg.solve(M,N)


    # Plotting the propagation of a wave function through the barrier

    # Define the range of z values
    z_min = -4*d
    z_max = (4 + 1)*d

    z = np.linspace(z_min, z_max, 100)  # Adjust the range as needed

    # Calculate the energy values for each z
    barrier_energy_values = barrier_energy(z, dp, U)
    wf_energy_values = wave_function(z, dp, x, k, kappa)

    T1 = np.abs(x[3])**2
    E = np.linspace(0.001e-19, 1e-19, 10)

    OutData.Ar = x[0].real
    OutData.Ai = x[0].imag
    OutData.Br = x[1].real
    OutData.Bi = x[1].imag
    OutData.Cr = x[2].real
    OutData.Ci = x[2].imag
    OutData.Dr = x[3].real
    OutData.Di = x[3].imag

    OutData.z_min = z_min
    OutData.z_max = z_max
    OutData.z = z
    OutData.barrier_energy_values = barrier_energy_values
    OutData.wf_energy_values = np.real(wf_energy_values)
    OutData.T1 = T1
    OutData.E = E
        
# if calctype == 2 or calctype == 0:
    V0 = np.linspace(0.01, V, 100)
    ds = np.zeros_like(V0)
    phi = np.zeros_like(V0)
    beta = np.zeros_like(V0)

    # Low-Voltage Range : phi >> eV
    cond1 = V0 < 0.5
    ds[cond1] = d 
    phi[cond1] = (Phi_s + Phi_t) / 2
    beta[cond1]= 1

    # Intermediate-Voltage Range : eV < phi
    cond2 = V0 <= Phi_t / e
    ds[cond2] = d 
    phi[cond2] = (Phi_s + Phi_t - e*V0[cond2]) / 2
    beta[cond2] =  1 - (e*V0[cond2])**2/96 * (Phi_s - e*V0[cond2] / 2)

    # High-Voltage Range: eV > phi_t
    cond3 = V0 > Phi_t / e
    ds[cond3] = d * Phi_s / (e*V0[cond3]) / (1 + (Phi_s - Phi_t)/(e*V0[cond3])) 
    phi[cond3] = Phi_s / 2
    beta[cond3] = 23/24

    A = (2 * beta * np.sqrt(2 * m)) / hbar #eq.19
    J0 = e / (4 * hbar * (beta * np.pi)**2)

    J = (J0 / ds**2) * (phi * np.exp(-A * ds * np.sqrt(phi))
                -(phi + e*V0) * np.exp(-A * ds * np.sqrt(phi + e*V0)))

    
    # Low-Voltage Range : phi >> eV

    J_L1 = ((e**2) * np.sqrt(2 * m)) / (beta * (2 * np.pi * hbar)**2) #eq.22
    J_1 = J_L1  * (V0 * np.sqrt(phi) / ds) * np.exp(-A * ds * np.sqrt(phi))  #eq.21
    J_1[~cond1] = np.nan
    OutData.J_1 = J_1 * S


    # Intermediate-Voltage Range : eV < phi
    J_L2 = e / (2*np.pi*h) #eq.

    J_2 = (J_L2/ds**2) * ((Phi_s - e*V/2) * np.exp(-A * ds * np.sqrt(Phi_s - e*V0/2)) - (Phi_s + e*V0/2) * np.exp(-A * ds * np.sqrt(Phi_s + e*V0/2))) #eq.23
    J_2[V0 < 0.5] = np.nan
    J_2[cond3] = np.nan
    OutData.J_2 = J_2 * S

    # High-Voltage Range: eV > phi_t

    F = V0/ds
    A3 = 2 * beta * Phi_s**(3/2) * np.sqrt(m)/(e*F*hbar)
    J_L3 = e**3 * (F/beta)**2 / (8*np.pi*h*Phi_s)

    J_3 = J_L3 * (np.exp(-A3) - (1 + (2*e*V)/Phi_s)*np.exp(-A3 * np.sqrt(1 + (2 * e * V0) / Phi_s))) #eq.24

    J_3[cond1] = np.nan
    J_3[cond2] = np.nan


    OutData.V0 = V0
    OutData.J = J * S
    OutData.J_3 = J_3 * S

# if calctype == 3 or calctype == 0:
    # sensitivity of STM. Dependence of current on bqrrier thickness
    delta_d = 3e-20

    tunneling_current = (J0 / d) * np.sqrt(phi/2)* V * np.exp( - A * d *np.sqrt(phi/2))

    tunneling_current_2 = (J0 / (d+delta_d)) * np.sqrt(phi/2)* V * np.exp( - A * (d+delta_d) *np.sqrt(phi/2))

    OutData.Sens = (tunneling_current - tunneling_current_2)*S/delta_d

    return props(OutData)
