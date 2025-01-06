#******************************************************************************#
#
#   Licensing:
#
#    This code is distributed under the GNU LGPL license.
#
#   Modified:
#
#    August 19th 2023
#
#   Author:
#
#    MEHDI AYOUZ LGPM CENTRALESUPELEC
#    mehdi.ayouz@centralesupelec.fr
#  
#   Optimized for package usage by Mariya V. SOSNOVA
#   mariya.v.sosnova@gmail.com
#
#******************************************************************************#
import time

from ex2 import QM_calculations
import matplotlib.pyplot as plt
from scipy.integrate import simps

from pylab import *
import numpy as np
from Quantum_mechanics import au_to_amu, au_to_Ang, au_to_eV, au_to_sec, Ryd, au_cm, au_debye



InputData = lambda:0

InputData.npoints_r = 1000  #The total number of grid point

InputData.r_min = 0.05      #Minimal distance of the grid point
InputData.r_max = 20        #Maximal distance of the grid point

InputData.mass_1 = 12       #Mass 1 in u.
InputData.mass_2 = 15.999   #Mass 2 in u.
		
InputData.j_to_print = 3 #Maximum j to be displayed and computed
InputData.v_max = 4 #Maximum v to be displayed and computed < Nr !!!!!!!!
		
InputData.j_max = 30
InputData.m = 0
InputData.m_p = 0
InputData.j_max = 30
InputData.calctype = 2

re = 1.128323                           #2.13          # in a.u.
De = 90543                              #  in 1/cm  or 11.26 in eV
W = 0                                   # in 1/cm
alpha = 2.2992                          # in a.u. or 1.8677  in 1/A


N_r = 1000


OutData = QM_calculations(InputData)

#dict
# omega = OutData.omega
V = OutData.get('V')  #in Ryd
psi = OutData.get('psi')
r_A = OutData.get('r_A')
Bv = OutData.get('Bv')  #in Ryd

D = OutData.get('D')
I1 = OutData.get('I1')
I2 = OutData.get('I2')

N_r = V.shape[0]
E = OutData.get('E') #in Ryd

Delta_P = OutData.get('Delta_P')
Delta_R = OutData.get('Delta_R')
R = OutData.get('R')
P = OutData.get('P')
Convoluted_Intensity = OutData.get('Convoluted_Intensity')
Energy = OutData.get('Energy')

# print("omega=",omega,"1/cm = ",omega,"a.u.") #*Ryd
# print("E=",E)
# print("V=",V)
# print("psi=",psi)
# print("r=",r)


# by default, display j=0 on the top of the graphe with the potential energy curve
j = 0

#plot potential energy in Ryd
plt.plot(r_A, V[j])

# plot probailities (|psi|**2) shifted by energy
for v in range(InputData.v_max - 1):
    Delta = (E[j,v+1] - E[j,v]) * (1 - 0.05)
    maxval = (abs(psi[j,v,:])**2).max()
    plt.plot(r_A, (E[j,v] + abs(psi[j,v,:])**2 * Delta/maxval), '-r') # Ryd
    
    plt.annotate('$(vj)=($'+str(v)+str(j)+')', xy=(1.4, E[j,v]*1.03),xytext=(1.4,E[j,v]*1.03),xycoords='data',size=16)


# plot energy levels
plt.plot([r_A.min(), r_A.max()], E[[j, j], :InputData.v_max], '-k')

plt.ylim(V[j].min(), V[j,-1])
plt.show() 


# plot w.f.
j = 0
for v in range(InputData.v_max):
    plt.plot(r_A, psi[j,v])  
plt.show() 

# plot Rotetional constant
j = 0
plt.plot(np.arange(Bv[j].size), Bv[j],'o')  
plt.show() 

#plot D(r)
plt.plot(r_A,D)
xlabel("$r(\\AA)$",size=20)
ylabel("$D(r) (Debye)$",size=20)
xlim(0.05,2.9)
ylim(-0.5,0.5)
plt.show() 

#plor I1
import seaborn # type: ignore

x_axis_labels = np.zeros(InputData.v_max)
y_axis_labels = np.arange(InputData.v_max)
s= seaborn.heatmap(I1[0:InputData.v_max,0:InputData.v_max],annot=True, xticklabels=x_axis_labels, yticklabels=y_axis_labels)
s.set(xlabel="$(vj)=(v0)$", ylabel="$(v'j')=(v'0)$")
plt.show() 


#plot I2
v=0
vp=1

mp=0
m=0
y_axis_labels=np.arange(InputData.j_to_print)
x_axis_labels=np.arange(InputData.j_to_print) 
for imp in range(-InputData.j_to_print+1, InputData.j_to_print): 
    for im in range(-InputData.j_to_print+1,InputData.j_to_print):
        if(imp==mp and im==m):
            #print(abs(mp),abs(m),j_to_print-1)
            s= seaborn.heatmap(I2[0:InputData.j_to_print,0:InputData.j_to_print,imp,im],annot=True, xticklabels=x_axis_labels[0:InputData.j_to_print], yticklabels=y_axis_labels[0:InputData.j_to_print],)
            s.set(xlabel="$(vj)="+str(v)+"j$", ylabel="$(v'j')="+str(vp)+"j'$")
            s.set(title="$(m'm)=("+str(imp)+str(im)+")$")
            s.xaxis.tick_top() # x axis on top

plt.show() 


#plot Delta_R and Delta_P

max_P_R=max(max(R[0:InputData.j_max-2]),max(P[0:InputData.j_max-2]))

plt.plot(Delta_R[0:InputData.j_max-2],R[0:InputData.j_max-2]/max_P_R,'ob')

plt.plot(Delta_P[0:InputData.j_max-2],P[0:InputData.j_max-2]/max_P_R,'or')

maxloc_R=argmax(R[0:InputData.j_max-1]/max_P_R);maxloc_P=argmax(P[0:InputData.j_max-1]/max_P_R)

x_R=Delta_R[maxloc_R]; y_R=R[maxloc_R]/max_P_R+0.05*R[maxloc_R]/max_P_R
x_P=Delta_P[maxloc_P]; y_P=P[maxloc_P]/max_P_R+0.05*P[maxloc_P]/max_P_R

annotate('$R$', xy=(x_R,y_R),xytext=(x_R,y_R),xycoords='data',size=15)
annotate('$P$', xy=(x_P,y_P),xytext=(x_P,y_P),xycoords='data',size=15)
xlabel("Energy (cm$^{-1}$)",size=20)
ylabel("Relative intensity",size=20)
ylim(0,1.2)
plt.gca().invert_xaxis()

plt.show() 


# convolution
# Energy = np.linspace(min(Delta_P[0:InputData.j_max])+20/Ryd,max(Delta_R[0:InputData.j_max]),len(Convoluted_Intensity))

# im = plt.imread("../img/Carbon_monoxide_IR_rotational-vibrational_spectrum_v2.png")
plt.plot(Energy,Convoluted_Intensity,'k')

plt.xlabel("Energy, $E_{vj}$ (cm$^{-1}$)",size=20)
plt.ylabel("Relative intensity, $I$",size=20)

ylim(0,1.2)
plt.gca().invert_xaxis()
plt.show()
