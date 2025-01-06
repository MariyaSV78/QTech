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

import numpy as np
from math import * 
from pylab import *  # for plot 

import json
from common import props
from JJunctions import CustomKineticOperator, CustomPotential, HarmonicOscillator, PCallable, format_latex, construct_potentials, hamiltonian_charge, v, energies_transmon_approx

def QM_calculations(InputData):
    """
    In this notebook, we want to present the basics of quantum computation like qubits and simple quantum mechanical operations 
    that one can subject them to, as well as the physical systems which underlay their real-world realisation.

    For the interface we consider only one case: when the tunnelling energy E_J is not small, but comparable to or larger than the junction charging energy E_C. 
    For some selected values of E_J/E_C we can observe how the energy levels evolve with changing coupling parameters.


    
    InputData:
        In order to tackle the problem numerically, we need to transform the Hilbert space of our theory, which is infinite-dimensional, to an unitary space which is finite. 
        We will do that be considering only a finite number of states around the n=n_g value of the number operator.

        We will be concerned with the following parameters:

        - `N`: the dimension of the unitary space mathcal{H}=\mathbb{C}^N of our model: 20 (to observe three states), increasing N leads to increasing of states;
        
        - `ng`: the number operator offset n_g : (-1;1)
        - `n`: the value of the number operator for the vector `v(N, n)`.

        - `EC`: the junction charging energy E_C - const.
        - `EJ`: the Josephson tunnelling energy E_J; in our case the quantity of x = EC/EJ is interesting in interval (~0;50) for example.
      
    OutData:
        - energy for all states
 
    """
     
    OutData	= lambda:0

    N = InputData.N   
    x = InputData.Ej_Ec

    EC = 3*10-9
    EJ = x * EC 
    n_g = np.linspace(-1, 1, 81)  

#######################################
    energies = np.array([np.linalg.eigvalsh(hamiltonian_charge(N, EC,
                                                            EJ, i))[:3]
                     for i in np.linspace(-1, 1, 81)])

     
# output #############################################################
  
    
    
    OutData.energies = energies/EC   
    OutData.n_g = n_g
    
    
    return props(OutData)
