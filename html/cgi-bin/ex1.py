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
#   Optimized for package usage: MARIYA V. SOSNOVA
#           mariya.v.sosnova@gmail.com
#
#******************************************************************************#

import mpmath as mp
import numpy as np
from common import json_zip,json_zero,props
from sympy.physics.wigner import wigner_3j 
from sympy.physics.wigner import clebsch_gordan



whitm = np.vectorize(mp.whitm)
whitw = np.vectorize(mp.whitw)

coulombf = np.vectorize(mp.coulombf)
coulombg = np.vectorize(mp.coulombg)


def integrate(y, x):
    # return y.sum() * (x[2] - x[1])
    return np.trapz(y, x)


def get_norm(y, x):
    return integrate(y**2, x)


def wf_localized(k, m, z):
    y1 = whitm(k, m, z)
    y2 = whitw(k, m, z)
    return y1.astype(float), y2.astype(float)


def wf_Coulomb(l_partial, eta, z):
    f1 = coulombf(l_partial, eta, z)
    f2 = coulombg(l_partial, eta, z)
    return f1.astype(float), f2.astype(float)


def QM_calculations(InputData):
    OutData = lambda:0

    mp.pretty = True

    calctype = InputData.subtype

    r_min = InputData.r_min
    r_max = InputData.r_max
    npoints = InputData.npoints
    r = np.linspace(r_min, r_max, npoints)  # box parameter 10 (r_max=10)

    if calctype == 1:
        energy_i = InputData.energy_i
        # def_quant_i = InputData.def_quant_i
        # n_i = InputData.n_i

        l_partial_i = InputData.l_partial_i

        k = np.sqrt(1 / (-2 * energy_i))
        m = np.sqrt(l_partial_i * (l_partial_i + 1) + 0.25)

        scale = np.sqrt(1 / (-8 * energy_i))
        z = r / scale

        OutData.r_i = r
        OutData.y1, OutData.y2 = wf_localized(k, m, z)

        OutData.norm_y2 = get_norm(OutData.y2, r)

    elif calctype == 2:
        energy_f = InputData.energy_f
        l_partial_f = InputData.l_partial_f

        eta = -np.sqrt(1 / (2 * energy_f))
        scale = np.sqrt(1 / (2 * energy_f))
        z = r / scale

        OutData.r_f = r
        OutData.chi_f1, OutData.chi_f2 = wf_Coulomb(l_partial_f, eta, z)

        OutData.norm_f2 = get_norm(OutData.chi_f2, r)

    elif calctype == 3:
        # energy grid
        nE = InputData.N_E 
        npoints = InputData.npoints

        # initial wave function
        quant_def_i = InputData.quant_def_i
        quant_def_f = InputData.quant_def_f
        n_i = InputData.n_i
        l_partial_i = InputData.l_partial_i_ph
        l_partial_f = InputData.l_partial_f_ph
        m_i = InputData.m_i


        energy_i = -1/(2*(n_i - quant_def_i)**2);  # energy and ang momentum  # box parameter

        k = np.sqrt(1 / (-2*energy_i))
        m = np.sqrt(l_partial_i * (l_partial_i + 1) + 0.25)
        scale = np.sqrt(1 / (-8 * energy_i))
        z = r / scale
        dr=r[2]-r[1]

        _, chi_i = wf_localized(k, m, z)

        norm = get_norm(chi_i, r)
         
        # final wave functions
        au2cm = 5.291772e-9
        au2ev = 27.2114
        energy_max=27. #eV
        energy_max=energy_max/au2ev+energy_i # maximum scattering electron energy


        chi_f = np.zeros([nE, npoints],dtype =float)
        r_fi = np.zeros(nE,dtype =float)
        energy_f = np.zeros(nE,dtype =float)

        for i_energy in range(nE):
            energy_f[i_energy] = energy_max/nE * (i_energy + 1)
            eta = -np.sqrt(1./(2*energy_f[i_energy]))
            scale = np.sqrt(1./(2.*energy_f[i_energy]))
            z = r / scale
            
            for ip in range(npoints):
                z=r[ip] / scale
                coul_f=coulombf(l_partial_f,eta, z)
                coul_g=coulombg(l_partial_f,eta, z)
                
                chi_f[i_energy,ip]=coul_f * np.cos(np.pi * quant_def_f) + coul_g * np.sin(np.pi * quant_def_f)
                
                r_fi[i_energy] = r_fi[i_energy] + chi_f[i_energy,ip] * r[ip]* chi_i[ip]*dr

            # wave function should be energy-normalized    
            wf_normalization_factor = np.sqrt(2./(np.pi * np.sqrt(2*energy_f[i_energy])))
            chi_f[i_energy,:] = chi_f[i_energy,:] * wf_normalization_factor
            r_fi[i_energy] = r_fi[i_energy] * wf_normalization_factor
        
        
        # PI cross section
        cross_section = np.zeros(nE,dtype =float)
        cross_section2 = np.zeros(nE,dtype =float)

        # averaged over initial polarizations
        for i_energy in range(nE):
            cross_section[i_energy]=(clebsch_gordan(l_partial_i, 1, l_partial_f, 0, 0, 0))**2  \
                *abs(r_fi[i_energy])**2 /3. * 4* np.pi**2 /137.*(energy_f[i_energy] - energy_i)

        # PI cross section for initially polarized atoms
        for i_energy in range(nE):
            cross_section2[i_energy]=(clebsch_gordan(l_partial_i, 1, l_partial_f, m_i, 0, m_i)*\
                                        clebsch_gordan(l_partial_i, 1, l_partial_f, 0, 0, 0))**2  \
                *abs(r_fi[i_energy])**2 /3. *4*np.pi**2 /137.*(energy_f[i_energy] - energy_i)



        OutData.r_ph = r
        OutData.chi_i = chi_i * np.sqrt(norm)
        OutData.chi_f = chi_f[nE-1,:]
        OutData.energy_i = energy_i
        OutData.norm_chi_ph = norm

        OutData.r_fi = r_fi
        OutData.energy_f = (energy_f-energy_i)*au2ev
        OutData.cross_section = cross_section*(au2cm)**2
        OutData.cross_section2 = cross_section2*(au2cm)**2

    return props(OutData)

