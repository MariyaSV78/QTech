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
from sympy.physics.wigner import clebsch_gordan
from scipy.signal import find_peaks
from scipy.optimize import curve_fit
from sklearn.model_selection import train_test_split
import random

import json
from collections import namedtuple
from common import props
from common import compar_imput_data
from ML_ex3 import eigen_state_potential, FC_Model, Harmonic_Oscillator, Morse, Training, get_energy, hamiltonian_expectation_value, fix_sign

import pickle
import os

def QM_calculations(InputData):
    """ Approximate the Schrödinger equation solution with Multi-Layer Perceptrons.
    A neural network model (a multi-layer perceptron) is used 
    to find the solutions of the Schrödinger equation in 1-dimension.

    - generate a set of potentials and solve the Schrödinger 
    associated to that potential using numerical methods. 
    
    - get the wave functions and their energies.

    - construct a dataset, which is composed of the potentials as features 
    and wave functions as labels. 
    
    - train the a neural network model such that the loss function, which we chose to be a mean square error
    InputData:
        xmin, xmax: the parameters which determine the domain 
                    D=[xmin, xmax] of the potential V(x)
        n_state: determines the nth excited state of the Schrödinger equation, 
                counting from the ground state (given by `n_state=0`) upwards with growing energy;
        N: the amount of discretisation points into which we divide the domain D 
            higher N corresponds to more precise numerical solution of the Schrödinger equation;
        n_samples: the number of pairs (potential, wave function) (or possibly triples (potential, wave function, energy))
            which constitute the dataset;
        n_samples_print: the number of samples for which the generated data will be displayed;
        k is inferred from the length of the arrays alpha_min and alpha_max.
        n_s_max and  n_s_min:

        learning_rate  (float):  Learning Rate for Adam optimizer
        training_iter: Numer of training iterations
        batch_size: Batch size
        
    OutData:
        For polynomial potential (PP) for samples in the interval [n_s_min : n_s_max]
        V_test:                                 potential for test samples
        E0_test:
        wave_test:                              real phi fot test samples
        alpha_test:
        
       
        #prediction PP
        pred.numpy()[n_s_min : n_s_max ]:       prediction phi
        E[n_s_min : n_s_max ]:                  teoretical E
        E_emp[n_s_min : n_s_max ]:              empirical E
        MSE_PP:                                 test MSE for polynomial potential
        MSE_E_PP

        #prediction HO (harmonic oscillators) n = 10
        pred_HO.numpy():                        prediction phi
        phi0_HO:                                real phi
        potential_HO                            potential 
        E_HO:                                   teoretical E
        E_emp_HO:                               empirical E
        MSE_HO:                                 test MSE for HO
        MSE_E_HO:

        prediction Morse n = 10
        pred_morse.numpy():                     prediction phi
        phi0_morse:                             real phi
        potential_morse:                        potential 
        E_morse :                               teoretical E
        E_emp_morse:                            empirical E
        MSE_morse:                              test MSE for Morse potential
        MSE_E_morse   
    """
     
    OutData	= lambda:0

    n_samples_print = InputData.n_samples_print    

    ###OutData from file OutData_ex3.bin if input_data = json_inputdata

    # input data in JSON format by default.
    # def compar_imput_data(input_data):
    #     """ Comparison of imput data with default data (json_inputdata).
    #         return: True - if input_data = json_inputdata;
    #                 Faule - input_data != json_inputdata;
    #     """
    #     json_inputdata = '''{"calctype": 3,"x_min": -8,"x_max": 8, "n_state": 1, "n": 200, "n_samples": 5000, "n_samples_print": 5, "k": 5, "learning_rate": 0.0005, "training_iter": 100, "batch_size": 64}'''

    #     # Parse input JSON into dictionary.   
    #     InputData0 = json.loads(json_inputdata)

    #     del InputData0["n_samples_print"]
    #     InputData_D = props(InputData)
    #     del InputData_D["n_samples_print"]

    #     equal = True
    #     print("InputData_D", InputData_D)
    #     print("InputData_0", InputData0)
    #     # Comparison of InputData and InputData0 (default data)
    #     for key in InputData0:
    #         if InputData0.get(key) != InputData_D.get(key):
    #             equal = False
    #             break
        
    #     return equal
    
    if (compar_imput_data(InputData)):
        print("json_inputdata = json_inputdata0")
      
        script_directory = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(script_directory,'../data/OutData_ex3.bin')
        file = open(file_path,'rb')
        OutData = pickle.load(file)
        file.close

        out_indices = len(OutData.get("E"))
        if out_indices > n_samples_print:
            out_indices = np.random.choice(out_indices, size = n_samples_print, replace=False)
            # print(len(OutData.get("V")))
            # print(OutData.get("V"))
        for key in ["V", "E", "E_emp", "waves", "pred"]:
            tmp = OutData.get(key)
            if key != "E" and key != "E_emp":
                OutData[key] = tmp[out_indices,:]
            else:
                OutData[key] = tmp[out_indices]
        return OutData
    else:
        print("json_inputdata != json_inputdata0")


    calctype = InputData.calctype
    
    x_max = InputData.x_max     
    x_min = InputData.x_min        
    N = InputData.n   
    n_state = InputData.n_state  
    n_samples = InputData.n_samples  
    # k = InputData.k 

    # n_samples_print = InputData.n_samples_print  

    learning_rate = InputData.learning_rate
    training_iters = InputData.training_iter
    batch_size = InputData.batch_size

    display_step = 10

    # script_directory = os.path.dirname(os.path.abspath(__file__))
    # file_path = os.path.join(script_directory,'/data/model_ex3.bin')

    filepath = "./trained_models/random_potentials/1D/n0/tf_ckpts/" #''
 
    # Generate alphas

    # alpha_min = [round(-10** (-i) * 100, 2) for i in range(k)]
    # alpha_max = [round(10 ** (-i)* 100, 2) for i in range(k)]
    # alpha_min[-1] = alpha_max[-1]*7.5 #0
    # alpha_max[-1] *= 15

    # alpha_min = np.array(alpha_min)/50
    # alpha_max = np.array(alpha_max)/50

    # print('alpha_min', alpha_min)
    # print('alpha_max', alpha_max)

    # k = alpha_min.shape[0]
    # r_alpha = np.random.random((int(n_samples*1), k)) # Values between 0 and 1
    # alpha = r_alpha*(alpha_max - alpha_min)+ alpha_min # random alpha

###################################
    alpha_min = np.array([-150,-10,0.3,-0.1,0])/50
    alpha_max = np.array([50,5,1.0,0.1,0.25])/50

    k = alpha_min.shape[0]

    r_alpha = np.random.random((int(n_samples*0.8), k)) # Values between 0 and 1
    alpha1 = r_alpha*(alpha_max - alpha_min)+ alpha_min # random alpha

    alpha_min2 = np.array([-10,-1,0.1,0,0])
    alpha_max2 = np.array([5,1,1.0,0,0])

    r_alpha = np.random.random((int(n_samples*0.2), k)) # Values between 0 and 1
    alpha2 = r_alpha*(alpha_max2 - alpha_min2)+ alpha_min2 # random alpha
    alpha = np.concatenate((alpha1, alpha2))

    n_samples = alpha.shape[0]
#######################################

    data_gen = eigen_state_potential(alpha_min, alpha_max, N, x_min, x_max)

    ### Generate the energies, wavefunctions and potentials for polynomial function
    E0, a, alpha = data_gen.generate_data(n_samples, alpha, n_state)
    waves, x, phis = data_gen.final_wavefunction( x_min, x_max, N, a)
    V, _ = data_gen.evaluate_potential( x_min, x_max, N, alpha)
    E_poly = E0

    
    ### Generate H.O data
    ho = Harmonic_Oscillator(N=N, omega_min=0.2, omega_max=1.0,
                         x0_min=-0.005, x0_max=0.005)  #
    # ho = Harmonic_Oscillator(N=N, omega_min=np.sqrt(2*7.5), omega_max=np.sqrt(2*15),
    #                      x0_min=0, x0_max=np.sqrt(200/15))  #
    ho.xmax = x_max
    ho.xmin = x_min

    phi0_HO, xh, omega, x0, potential_HO = ho.generate_data(10, n_state)
    # E0_HO = E0_HO*omega[0]*(1./2.+n_state) #in the notebook tmp_E

    
    ### Generate Morse Data
    morse = Morse(N=N,  x_min=-8, x_max=8, xe_min=-0.5,
              xe_max=0.5, De_max=7, De_min=3) 

    phi0_morse, xm, a, De, xe, potential_morse = morse.generate_data(10, n_state, True)
    
    mu = 1
    lamb = np.sqrt(2*mu*De[0])/a[0]
    # E0_Morse = E0_Morse*(- a[0]*a[0]/(2*mu)*(lamb - n_state-1/2)**2)  
    
    # Split train and test
    idx_train, idx_test, wave_train, wave_test = train_test_split(np.arange(V.shape[0]),
                                                                waves, test_size=0.33, random_state=123)
    V_train = V[idx_train, :]
    V_test = V[idx_test, :]
    # E0_test = E0[idx_test]

    alpha_train = alpha[idx_train]
    alpha_test = alpha[idx_test]


    # Train the model from scratch
    fc_model = FC_Model(input_size=N)
    train = Training(fc_model, learning_rate, training_iters,
                 batch_size, display_step, early_stopping=20, filepath=filepath,
                 restore=False)#True - use defolt model 
 
    training_loss = train.fit(V_train, wave_train, V_test, wave_test, save=False) #False save=False


    # Evalution of the predictions on the validation dataset

    ###### MLP predictions for PP
    pred = fc_model(V_test)
    MSE_PP = train.loss(pred, wave_test)
    # print("Test MSE for polynomial potential: %f" % MSE_PP)

        # MKP: I have added the dependance on N to the parameters of the 2 function below:
    E = get_energy(wave_test, V_test, x)
    E_emp = get_energy(pred.numpy(), V_test, x)
    MSE_E_PP =  np.mean((E - E_emp)**2)
    # print('MSE(E) for polynomial potential: ', MSE_E_PP) 



    ###### Test with HO
        # Predict wavefunctions
    pred_HO = fc_model(potential_HO) 
    pred_HO = fix_sign(phi0_HO, pred_HO)

    MSE_HO = train.loss(pred_HO, phi0_HO)
    # print("Test MSE for HO: %f" % MSE_HO)

        # MKP: I have added the dependance on N to the parameters of the 2 function below:
    E_HO = get_energy(phi0_HO, potential_HO, xh)
    E_emp_HO = get_energy(pred_HO.numpy(), potential_HO, xh)
    MSE_E_HO = np.mean((E_HO - E_emp_HO)**2)
    # print('MSE(E) for HO: ', MSE_E_HO)



    ###### Test with Morse
        # Predict wavefunctions
    pred_morse = fc_model(potential_morse) 
    pred_morse = fix_sign(phi0_morse, pred_morse)

    MSE_morse = train.loss(pred_morse, phi0_morse)
    # print("Test MSE for Morse potential: %f" % MSE_morse)

        # MKP: I have added the dependance on N to the parameters of the 2 function below:
    E_morse = get_energy(phi0_morse, potential_morse, xm)
    E_emp_morse = get_energy(pred_morse.numpy(), potential_morse, xm)
    MSE_E_morse = np.mean((E_morse - E_emp_morse)**2)
    # print('MSE(E) for Morse potential: ', MSE_E_morse)

     
    # output #############################################################
    out_indices = np.arange(E.size)
    if E.size > n_samples_print:
        out_indices = np.random.choice(out_indices, size = n_samples_print, replace=False)

    #test PP
    # OutData.E0 = E0_test #[n_s_min : n_samples_print ]
    OutData.V = V_test[out_indices, :]          #potential
    OutData.waves = wave_test[out_indices, :]   #real phi
    OutData.x = x
  
    OutData.alpha = alpha_test[out_indices, :]
    OutData.training_loss = list(zip(*training_loss))
    #prediction PP
    OutData.pred = pred.numpy()[out_indices, :] #prediction phi
    OutData.E = E[out_indices]               #teoretical E
    OutData.E_emp = E_emp[out_indices]       #empirical E
    OutData.MSE_PP = MSE_PP.numpy()
    OutData.MSE_E_PP = MSE_E_PP

    #prediction HO n = 10
    OutData.pred_HO = pred_HO.numpy()       #prediction phi
    OutData.phi0_HO = phi0_HO               #real phi
    OutData.potential_HO = potential_HO     #potential 
    OutData.E_HO = E_HO                     #teoretical E
    OutData.E_emp_HO = E_emp_HO             #empirical E
    OutData.MSE_HO = MSE_HO.numpy()
    OutData.MSE_E_HO = MSE_E_HO
    OutData.omega = np.round(omega, 3)

    #prediction Morse n = 10
    OutData.pred_morse = pred_morse.numpy()       #prediction phi
    OutData.phi0_morse = phi0_morse               #real phi
    OutData.potential_morse = potential_morse     #potential 
    OutData.E_morse = E_morse                     #teoretical E
    OutData.E_emp_morse = E_emp_morse             #empirical E
    OutData.MSE_morse = MSE_morse.numpy()
    OutData.MSE_E_morse = MSE_E_morse   


    return props(OutData)
