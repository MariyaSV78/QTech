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


import numpy as np
# from scipy.linalg.lapack import zgeev
from math import * 
from pylab import *  # for plot 
from sympy.physics.wigner import clebsch_gordan
from scipy.signal import find_peaks
# from scipy.optimize import curve_fit

import json
from collections import namedtuple
from common import json_zip,json_zero,props
import pickle
import os


from Quantum_mechanics import Get_Profile,Get_Potential_Operator,Get_Constant_Grid,Get_Constant_K,Get_Kinetic_Operator,Get_Hamiltonian_Operator
from Quantum_mechanics import Get_Ordered_Eigen_States,Get_Wave_Functions_Normalization,Get_Wave_Functions_Localization,Get_Heisenberg_Uncertainty,Get_Fourrier_Transform_WF
from Quantum_mechanics import au_to_amu, au_to_Ang, au_to_eV, au_to_sec, Ryd, au_cm, au_debye
from Quantum_mechanics import Get_Rotational_Constant


def QM_calculations(InputData):
    """ Spectroscopy of molecules
        This functions use for calculation:
   
        V:
        psi:
        E:
        Bv:
        D:
        I1:
        I2:

            Delta_P:
            Delta_R:
            P:   
            R:

            Convoluted_Intensity:
        Energy: """
     
    OutData	= lambda:0
 
    ###OutData from file OutData_ex2.bin

    # input data in JSON format by default.
    json_inputdata = '''{"calctype":2,"npoints_r":1000,"r_min":0.05,"r_max":20,"mass_1":12,"mass_2":15.999,"j_to_print":3,"v_max":4,"j_max":30,"m":0,"m_p":0}'''
 	
    # Parse input JSON into dictionary.   
    InputData0 = json.loads(json_inputdata)
    InputData_D = props(InputData)
    equal = True
    print("InputData_D", InputData_D)
    print("InputData_0", InputData0)
    # Comparison of InputData and InputData0 (default data)
    for key in InputData0:
        if InputData0.get(key) != InputData_D.get(key):
            equal = False
            break
    
    # if InputData = InputData0 => getv data from OutData_ex2.bin       
    if (equal):
        print("json_inputdata = json_inputdata0")   
        script_directory = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(script_directory,'../data/OutData_ex2.bin')
        file = open(file_path,'rb')
        OutData = pickle.load(file)
        file.close
        return OutData

    else:
        print("json_inputdata != json_inputdata0")


    # calctype = InputData.calctype

    N_r = InputData.npoints_r        #The total number of grid point

    r_min = InputData.r_min          #Minimal distance of the grid point
    r_max = InputData.r_max          #Maximal distance of the grid point

    m1 = InputData.mass_1            #Mass 1 in u.
    m2 = InputData.mass_2            #Mass 2 in u.
		
    #v_max = InputData.v_max
    j_max = InputData.j_max



    # in the code
    re = 1.128323                           #2.13          # in a.u.
    De = 90543                              #  in 1/cm  or 11.26 in eVmodel_selection
    W = 0                                   # in 1/cm
    alpha = 2.2992                          # in a.u. or 1.8677  in 1/A
    v_max = 10                        # maximum to be put in the code


    # conversion
    mu = m1*m2/(m1+m2)
    mu = mu/au_to_amu                            #*1e-2/6.02e23/9.2e-31
    
    print("mu=",mu*au_to_amu,"amu = ",mu,"a.u.")
    
    alpha = alpha*au_to_Ang 
    De = De/Ryd                             #/au_eV
    re = re/au_to_Ang

    omega = alpha*np.sqrt(2*De/mu)
    xe = omega/(4*De)

    # get coordinates of r
    delta_r = (r_max - r_min) / N_r
    r = np.linspace(r_min, r_max - delta_r, N_r)
    dr =  delta_r*np.ones(r.shape)

      
    V = np.zeros((j_max, N_r),float)
    E = np.zeros((j_max, v_max),float)
    psi = np.zeros((j_max, v_max, N_r),float)
    Bv = np.zeros((j_max, v_max),float)



    for j in range(j_max):
        V[j,:] = De*(1-np.exp(-alpha*(r - re)))**2 + W + j*(j+1)/(2*mu*r**2) #0.5*omega**2*mu*(r[i]-re)**2 #


        LBox = delta_r*N_r
        T = Get_Kinetic_Operator(r, mu, LBox, 0)

        H = T + diag(V[j])
        Efull, P = eigh(H)
        E[j] = Efull[:v_max]
        print(f'Diagonalization done for j = {j}')

        # norm with DVR transformation (integration)
        psi[j] = Get_Wave_Functions_Normalization(P[:, :v_max].transpose(), dr)

        # rotational constant
        Bv[j],_,_ = Get_Rotational_Constant(psi[j],mu,V[j],r,dr)

   
    # Selection rules
        # I1
    a0 = 1.47773
    a1 = -0.517427
    a2 = -0.146225
    a3 = 0.0349042

    D=np.zeros(N_r,float)
    D=a0+a1*r+a2*r**2+a3*r**3 
   
    I1 = np.zeros((N_r,N_r), float) #here for j=j'=0
    for i in range(v_max):
        I1 = np.einsum('vr,r,wr->vw',psi[i],D,psi[i])*delta_r 


        # I2
    I2=np.zeros((j_max,j_max,2*j_max+1,2*j_max+1),float) #here I(j',j,m',m)   

    v=0
    vp=1

    for jp in range(j_max):      
        for mp in range(-jp,jp+1):    
            for j in range(j_max):  
                C1=clebsch_gordan( j, 1, jp, 0, 0, 0) #j1,j2,j3,m1,m2,m3
                A=np.sqrt(3*(2*j+1)/(4*np.pi*(2*jp+1)))
                for m in range(-j,j+1): 
                    C2=clebsch_gordan( j, 1, jp, m, 0, mp)
                    I2[jp,j,mp,m]=A*2*np.sqrt(np.pi/3)*C1*C2



    #Carbon_monoxide_IR_rotational-vibrational_spectrum
    
    k_T = 300  # in Kelvin to be chosen by the user 
    v = 0      # to be chosen by the user
    vp = 1     # to be chosen by the user

    au_K = 3.1577465e5
    k_T = k_T/au_K

    c=137.
    epsilon0=1./(4*pi) #4*pi*epsilon0=1

    Intensity=np.zeros((j_max,j_max),float)

        
    R=np.zeros(j_max-1,float)
    Delta_R=np.zeros(j_max-1,float)
    P=np.zeros(j_max-1, float)
    Delta_P=np.zeros(j_max-1,float)

    for j in range(j_max):
        for m in range(-j,j+1):
            for jp in range(j_max):
                Intensity[jp,j] += abs(I2[jp,j,m,m]*I1[vp,v])**2
        Intensity[:,j] /= (2*j+1)
   
    for j in range(j_max):

        if(j <  j_max-1): #jp = j+1
            Delta_R[j] = E[j+1][vp]-E[j][v]
            nu = Delta_R[j]/(2*pi) # h=2pi
            C = pi*nu/(3*epsilon0*c)
            R[j] = Intensity[j+1][j]*C*(2*j+1)*exp(-E[j][v]/k_T)  
        
        if(j > 0): #jp = j-1
            Delta_P[j-1]=E[j - 1][vp]-E[j][v]
            nu=Delta_P[j-1]/(2*pi) # h=2pinp.
            C=pi*nu/(3*epsilon0*c)
            P[j-1]=Intensity[j-1][j]*C*(2*j+1)*exp(-E[j][v]/k_T)
    
    # convolution
    Ne=500000
    Energy0=np.zeros(Ne,float)
    Energy0=np.linspace(min(Delta_P[0:j_max])+20/Ryd,max(Delta_R[0:j_max]),Ne)
    Convoluted_Intensity0=np.zeros(Ne,float)
    
    c=137.
    h=2*pi
    M=m1+m2
    M=M/au_to_amu
    A=sqrt(M/(2*pi*k_T))
    print('T=',k_T*au_K,'K ','M=',M*au_to_amu,'amu' )
    delta_Energy=Energy0[1]-Energy0[0]
    # print(Energy[0]*Ryd,'-->',Energy[Ne-1]*Ryd,'with a step of',delta_Energy*Ryd,' 1/cm')

    for ie in range(Ne):
        nu=Energy0[ie]/h
        for iplot in range(j_max - 1):
            nu0R=Delta_R[iplot]/h
            nu0P=Delta_P[iplot]/h
            Convoluted_Intensity0[ie] +=(c/nu0R*A*R[iplot]*exp(-M*(c*(nu/nu0R-1))**2/(2*k_T))+c/nu0P*A*P[iplot]*exp(-M*(c*(nu/nu0P-1))**2/(2*k_T)))*delta_Energy


    # Energy = Energy0[Convoluted_Intensity0 > np.max(Convoluted_Intensity0)*0.08] #1e-10
    # Convoluted_Intensity = Convoluted_Intensity0[(Convoluted_Intensity0 > np.max(Convoluted_Intensity0)*0.08) ]

    # Convoluted_Intensity [Convoluted_Intensity < 1.2e-10] = 0
    
    peaks, _ = find_peaks(Convoluted_Intensity0)
    print ('find_peaks', peaks)
    index_of_peaks=[]
    for i in peaks:
        if i + 5 > len(Convoluted_Intensity0):
            break
        for k in range(i - 4, i + 5):
            if i - 5 < 0:
                break
            index_of_peaks.append(k)
    
    print('index_of_peaks', index_of_peaks, len(index_of_peaks)) #for 50000,
    index_of_peaks = np.array(index_of_peaks)

    for i in range(1, len(index_of_peaks)):
        if index_of_peaks[i] - index_of_peaks[i - 1] > 1:
            Convoluted_Intensity0[index_of_peaks[i]] = 0
            Convoluted_Intensity0[index_of_peaks[i - 1]] = 0
    # Extract data for the detected peaks using array slicing
    Energy = Energy0[index_of_peaks] #index_of_peaks.flatten()
    Convoluted_Intensity = Convoluted_Intensity0[index_of_peaks] #    without cutting off minimal values



    print ('new_Convoluted_Intensity', Convoluted_Intensity, len(Convoluted_Intensity))
    # print ('new_Energy', new_Energy, len(new_Energy))

        # # Open the file in write mode and write the data
    
        # with open(file_path, 'w') as file:
        #     for item in index_of_peaks:
        #         file.write(str(item) + '\n')
        
        
    # # Define a Lorentzian function
    # def lorentzian(x, A, x0, gamma):
    #     return A / ((x - x0) ** 2 + gamma ** 2)

    # # Initial guess for the Lorentzian parameters (you can adjust these)
    # initial_guess = [1.0, new_Energy[0], 0.01]

    # # Perform the curve fitting
    # popt, _ = curve_fit(lorentzian, new_Energy, new_Convoluted_Intensity, p0=initial_guess)

    # # Extract the optimized parameters
    # A, x0, gamma = popt

    # # Generate the Lorentzian curve
    # fit_curve = lorentzian(new_Energy, A, x0, gamma)

    # # Plot the data and the Lorentzian fit
    # plt.figure(figsize=(8, 6))
    # plt.plot(new_Energy, new_Convoluted_Intensity, 'b.', label='Data')
    # plt.plot(new_Energy, fit_curve, 'r-', label='Lorentzian Fit')
    # plt.xlabel('Energy')
    # plt.ylabel('Convoluted Intensity')
    # plt.legend()
    # plt.show()



    # output #############################################################
    
    OutData.r_A = r*au_to_Ang
    OutData.V = V*Ryd
    OutData.psi = psi
    OutData.E = E*Ryd
    OutData.Bv = Bv*Ryd
    
    # OutData.omega = omega*Ryd

    OutData.D = D*au_debye
    OutData.I1 = I1
    OutData.I2 = I2

    OutData.Delta_P = Delta_P*Ryd
    OutData.Delta_R = Delta_R*Ryd
    OutData.P = P #/np.max(np.max(R),np.max(P))   
    OutData.R = R #/np.max(np.max(R),np.max(P))

    # OutData.Intensity = Intensity

    OutData.Convoluted_Intensity = Convoluted_Intensity/max(Convoluted_Intensity)
    OutData.Energy = Energy*Ryd

    return props(OutData)
