#******************************************************************************#
#
#   Schrodinger_1D is the main program for solving schrodinger equation 
#          using Discret variable representation (DVR) 
#                and Fourier Grid Hmiltonian (FGH) methods 
#
#   Discussion:
#    Prticle submitted to differnet potential square-well, barrier  
#    harmonic, H2 molecule and so on..
#
#
#
#   Licensing:
#
#    This code is distributed under the GNU LGPL license.
#
#   Modified:
#
#    January 17th 2017
#
#   Author:
#
#    MEHDI AYOUZ LGPM CENTRALESUPELEC
#    mehdi.ayouz@centralesupelec.fr
#    Bat DUMAS C421. 0141131603
#
#   Optimized and improved for package usage by Alexander V. KOROVIN
#    a.v.korovin73@gmail.com
#
#   input:
#   N, x0, xL, mu, V0
#  
#   output : 
#   E[0:N-1] (eigen energies)
#   psi[0:N-1,0:N-1] (normalized eigen fonctions along x[0:N-1] as row 
#                      and for each eigen value as columne    
#******************************************************************************#

from math import *
from pylab import *

from .constants import ci

#*****************************************************************************#
#   Initial Wave Packet Psi(x,t=0)
def Get_Initial_Wave_Packet(x,k0,a0):
	return (2/(pi*a0**2))**(1/4)*exp(-(x/a0)**2+ci*k0*x)

def Get_Initial_Wave_Packet_old(N,x,k0,a0,delta_x):
	Psi=np.zeros(N,complex)

	for i in range(N):
		Psi[i]=(2./(pi*a0**2))**(1./4.)*exp(-x[i]**2/a0**2)*exp(ci*k0*x[i])

	return Psi

#*************************************************************#
def Get_Initial_Wave_Packet2D(x,y,k0x,a0x,k0y,a0y):
	Ax = (2/(pi*a0x**2))**(1/4)*exp(-(x/a0x)**2)*exp(ci*k0x*x)
	Ay = (2/(pi*a0y**2))**(1/4)*exp(-(y/a0y)**2)*exp(ci*k0y*y)
	Psi=	np.einsum( 'x,y->xy',Ax,Ay )

	return Psi
