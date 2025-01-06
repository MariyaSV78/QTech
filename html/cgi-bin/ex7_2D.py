#*************************************************************#
#    July 2019
#    Author: Mehdi Ayouz lgpm Centralesupelec (cs)
#    mehdi.ayouz@centralesupelec.fr
#    Co-authors: V. Kokoouline (University of Centrale Florida), 
#     JM Gillet and PE Janolin (spms, cs)
#    input: Nx, Ny, x0, xL, y0, yL, mu, delta_t, V(x,y) 
#    input wave packet parameters : xc_WP (center), k0x (energy), a0x (width)
#    input wave packet parameters : yc_WP (center), k0y (energy), a0y (width)
#    output : time-evolution of psi[0:Nx-1,0:Ny-1] at each delta_t step    
#
#
#   Optimized and improved for package usage by Alexander V. KOROVIN
#    a.v.korovin73@gmail.com
#
#*************************************************************# 


import matplotlib
# Force matplotlib to not use any Xwindows backend.
matplotlib.use('Agg')
#import matplotlib.pyplot as plt

import matplotlib.pyplot as plt
import matplotlib.animation as animation
# for animation
# for gif
#sudo apt install imagemagick
# for mp4
#sudo apt-get install ffmpeg
from mpl_toolkits.mplot3d import Axes3D
from common import json_zip,json_zero,props


#
from pylab import *
#from mpl_toolkits.mplot3d import Axes3D


import numpy as np
from numpy import *

from scipy import special
from scipy.interpolate import interp1d as interp1d

from time import process_time



#from Quantum_wells7_2D import *
from Quantum_mechanics import ci
from Quantum_mechanics import func_timetest
from Quantum_mechanics import Get_Initial_Wave_Packet2D
from Quantum_mechanics import Get_Analytical_Solution2D
from Quantum_mechanics import Get_Propagator_Chebyshev_Expansion,Get_Chebyshev_Coefficients
from Quantum_mechanics import Get_Heisenberg_Uncertainty2D
from Quantum_mechanics import Get_Kinetic_Operator2D,Get_Hamiltonian_Operator2D
from Quantum_mechanics import Get_Constant_Grid2D,Get_Constant_K2D,Get_Potential_Operator2D,Get_E_min_max2D
from Quantum_mechanics import Get_Fourrier_Transform_WF2Dsingle
from Quantum_mechanics import Get_Observables2Dsingle,Get_Heisenberg_Uncertainty2Dsingle
from Quantum_mechanics import Get_Profile
from Quantum_mechanics import Get_E_min_max2D

from common import SaveVideo




def QM_calculations(InputData):
	OutData		= lambda:0
	InputData.Dimensionality = 2

	print ('<br>Time-dependent Schrodinger equation solving')
	print ('<br>Free propagation of a 2D Gaussian wave packet ')
	print(type(OutData))
	# Temporal used to make different calculations:
	# Temporal==0 or Temporal==1 show only barrier profile
	# Temporal==2 as 0,1 + show only WP profile
	# Temporal==3 run temporal evolution calculations
	# Temporal==4 run transmittance calculations
	Temporal	= InputData.Temporal	if hasattr(InputData, 'Temporal')	else 1

	isCheckOld	= InputData.isCheckOld	if hasattr(InputData, 'isCheckOld')		else False

	sessionID	= InputData.sessionID	if hasattr(InputData, 'sessionID')		else ''



	Nkx			= InputData.Nkx		# 31
	Nky			= InputData.Nky		# 32

#   Set up intial wavepacket;
	k0x			= InputData.k0x			# 1
	k0y			= InputData.k0y			# 0
	a0x			= InputData.a0x			# 30
	a0y			= InputData.a0y			# 10
	xc_WP		= InputData.xc_WP		# -25 # center of wave packet
	yc_WP		= InputData.yc_WP		# 0 # center of wave packet


	epsilon		= InputData.epsilon		# 1e-5

	#  time parameters
	Nt			= InputData.Nt			# 2000
	delta_t		= InputData.delta_t		# 0.1

	#  Chebyshev's expansion parameters
	Nc_max		= InputData.Nc_max		# 10000
	amin		= InputData.amin		# 5e-7



	if not hasattr(InputData, 'Pot_Type'):
		InputData.Pot_Type = 20

	Lambda = 2*pi/sqrt(k0x**2 + k0y**2)#max(k0x,k0y)
	if not hasattr(InputData, 'ls'):
		InputData.ls = 0
		if(InputData.Pot_Type==31):
			InputData.ls = 2*Lambda
		elif(InputData.Pot_Type==32 or InputData.Pot_Type==33):
			InputData.ls = Lambda/2
	# print("x-coordinate for which the diffraction spot could be observed is ls**2/Lambda=%g"%(InputData.ls**2/Lambda+(InputData.xL+InputData.x0)/2.))
	# print("y coordinate for which the diffraction spot could be observed is ls**2/Lambda=%g"%(InputData.ls**2/Lambda))
	# print("Lambda/ls=%g"%(Lambda/InputData.ls))



	## main procedure
	OutData,InputData = Get_Profile(InputData)
	if hasattr(OutData,'Error'): # return error message if there is an error
		return props(OutData)
	Emax,Emin,pxmax,pymax,OutData.Eshift = Get_E_min_max2D(OutData.V,InputData.delta_x,InputData.delta_y,InputData.mu)
	OutData.V -= OutData.Eshift

	print('<br>pxmax=%g, pymax=%g'%(pxmax,pymax))
	print('<br>Emin=%g'%Emin)
	print('<br>Emax=%g'%Emax)
	print('<br>Eshift=%g'%OutData.Eshift)
	if(pxmax < k0x or pymax < k0y):
		OutData.Error	= 'Attention pxgrid<k0x or pygrid<k0y : increase Nx and Ny or decrease k0x and k0y'
		return props(OutData)
#		sys.exit('Attention pxgrid<k0x or pygrid<k0y : increase Nx and Ny or decrease k0x and k0y') 


#   Build the grid for FT
	OutData.kx,delta_kx,_,OutData.ky,delta_ky,_	= Get_Constant_K2D(Nkx,InputData.delta_x0,Nky,InputData.delta_y0)

	if Temporal==0 or Temporal==1: # return only barrier profile
		print('<br>return barrier profile')
		print('<br>OutData=',OutData.__dict__)
		return props(OutData)

#   Generate an intial wavepacket
	Psi			= Get_Initial_Wave_Packet2D(OutData.x-xc_WP,OutData.y-yc_WP,k0x,a0x,k0y,a0y)
	Psi_FT		= Get_Fourrier_Transform_WF2Dsingle(Psi,OutData.x,InputData.delta_x,OutData.y,InputData.delta_y,OutData.kx,OutData.ky)

	if Temporal < 3: # show WP and barrier profile
		OutData.psi		= abs(Psi)**2
		OutData.psi_FT	= abs(Psi_FT)**2

		print('<br>return WP parameters')
		print('<br>OutData=',OutData.__dict__)
		return props(OutData)


	if isCheckOld:
		func_timetest(Get_Kinetic_Operator2D,(Nx,Ny,InputData.mu,OutData.x,InputData.delta_x,OutData.y,InputData.delta_y,InputData.Type),Get_Kinetic_Operator_old,(Nx,Ny,InputData.mu,InputData.delta_x,InputData.delta_y,InputData.Type))
#	Tx,Ty = Get_Kinetic_Operator2D(Nx,Ny,InputData.mu,OutData.x,InputData.delta_x,OutData.y,InputData.delta_y,Type)
	Tx,Ty = Get_Kinetic_Operator2D(OutData.x,OutData.y,InputData.mu,InputData.LBOXx,InputData.LBOXy,InputData.Type)
	#print('<br>V=',OutData.V[23:27,:])
	#print('<br>Tx=',Tx)
	#print('<br>Ty=',Ty)
	if isCheckOld:
		func_timetest(Get_Hamiltonian_Operator2D,(InputData.Nx,InputData.Ny,Tx,Ty,OutData.V), Get_Hamiltonian_Operator_old,(InputData.Nx,InputData.Ny,Tx,Ty,OutData.V))
	H = Get_Hamiltonian_Operator2D(InputData.Nx,InputData.Ny,Tx,Ty,OutData.V)
	#print('<br>H=',H)

	norm			= np.zeros(Nt, float)
	H_average		= np.zeros(Nt, float)
	Delta_X			= np.zeros(Nt, float)
	Delta_Y			= np.zeros(Nt, float)
	Delta_Px		= np.zeros(Nt, float)
	Delta_Py		= np.zeros(Nt, float)
	Delta_X_analytic= np.zeros(Nt, float)
	Delta_Y_analytic= np.zeros(Nt, float)
	x_average		= np.zeros(Nt, float)
	y_average		= np.zeros(Nt, float)
	px_average		= np.zeros(Nt, float)
	py_average		= np.zeros(Nt, float)
	Heisenberg		= np.zeros(Nt, float)
	Heisenberg_X	= np.zeros(Nt, float)
	Heisenberg_Y	= np.zeros(Nt, float)
	time			= np.zeros(Nt, float)

	#   Bessel coefficients for Chebyshev expansion
	r = delta_t*(Emax - Emin)/2.
	z = -ci*delta_t/r
	Nc = int(max(2.0,r)) #nombre de paremtre Chebyshev de devloppement

	a,Nc = Get_Chebyshev_Coefficients(Nc,Nc_max,amin,r)
	print('<br>a=',a)
	print('<br>Nc=',Nc)

	OutData.Nc				= Nc
	OutData.psi_t			= []
	OutData.psi_FT_t		= []
	OutData.psi_analytic_t	= []
	time					= np.linspace(0,(Nt-1)*delta_t,Nt)

	# create plot of temporal evolution
	if Temporal==5: 	#	create and save video
		fig = plt.figure()
		ax = fig.add_subplot(111, projection='3d')
		ax.set_title ("Temporal evolution", fontsize=16)
		ax.set_xlabel("$x$ (u.a.)", fontsize=14)
		ax.set_ylabel("$y$ (u.a.)", fontsize=14)
		ax.set_zlabel("$|\Psi(x,t)|^2$", fontsize=14)
		X,Y = np.meshgrid(OutData.x,OutData.y, sparse=False, indexing='ij')
	#	KX,KY=np.meshgrid(OutData.kx,OutData.ky, sparse=False, indexing='ij')

	#   Save the intial wave paket boundary values
	psi0_x0_xL_y0_yL = np.concatenate(([Psi[[0,-1],int(InputData.Ny/2)], Psi[int(InputData.Nx/2),[0,-1]]]))

	#    >>>>>>>>  the main time integration loop <<<<<<<<
	for it in range(Nt):
		if it==0:
			Psi1	= dot(H,Psi.flatten()).reshape((InputData.Nx,InputData.Ny))
		else:
			Psi,Psi1	= Get_Propagator_Chebyshev_Expansion(Psi.flatten(),H,a,z)
			Psi			= Psi.reshape((InputData.Nx,InputData.Ny))
			Psi1		= Psi1.reshape((InputData.Nx,InputData.Ny))

		norm[it],H_average[it] = Get_Observables2Dsingle(Psi,Psi1,InputData.delta_x,InputData.delta_y,OutData.Eshift)
		Psi_FT	= Get_Fourrier_Transform_WF2Dsingle(Psi,OutData.x,InputData.delta_x,OutData.y,InputData.delta_y,OutData.kx,OutData.ky)
		Heisenberg[it], Heisenberg_X[it], Heisenberg_Y[it], x_average[it], px_average[it], Delta_X[it], Delta_Px[it], y_average[it], py_average[it], Delta_Y[it], Delta_Py[it] =\
		Get_Heisenberg_Uncertainty2Dsingle(
			Psi,OutData.x,
			InputData.delta_x0,
			InputData.delta_x,
			OutData.y,
			InputData.delta_y0,
			InputData.delta_y,
			OutData.kx,
			delta_kx,
			OutData.ky,
			delta_ky,
			psi_FT=Psi_FT,
			Type=InputData.Type
			)


#		if(it%it_plot==0):
#            fig = plt.figure(it)
#            ax = fig.gca(projection='3d')
#            X, Y=meshgrid(OutData.x,OutData.y)
#            cset = ax.contourf(X, Y, abs(transpose(Psi))**2, zdir='z',
#						offset=-(abs(transpose(Psi))**2).max(), cmap=cm.coolwarm)
#            ax.plot_surface(X, Y, abs(transpose(Psi))**2)
#            surf = ax.plot_surface(X, Y, abs(transpose(Psi))**2,rstride=1,
#						cstride=1, cmap=cm.jet,linewidth=0, antialiased=False)
#            ax.set_xlabel('$x$',size=20)
#            ax.set_ylabel('$y$',size=20)
#            ax.set_title('$|\Psi(x,y)|^2$',size=20)
#            ax.set_zlim3d(-(abs(Psi)**2).max(), (abs(Psi)**2).max())
#            ax.set_xlim3d(x0, xL)
#            ax.set_ylim3d(y0, yL)
#            fig.colorbar(surf)
#            plt.show()
#            pause(0.5)

		OutData.psi_t.append(abs(Psi)**2)
		OutData.psi_FT_t.append(abs(Psi_FT)**2)
		if(InputData.Pot_Type==20):
			if isCheckOld:
				func_timetest(Get_Analytical_Solution2D,(Psi,Nx,Ny,a0x,a0y,k0x,k0y,OutData.x,xc_WP,OutData.y,yc_WP,InputData.mu,time[it]),Get_Analytic_Solution_old,(Psi,Nx,Ny,a0x,a0y,k0x,k0y,OutData.x,xc_WP,OutData.y,yc_WP,InputData.mu,time[it]))
			Psi_analytic,Delta_X_analytic[it],Delta_Y_analytic[it]=\
				Get_Analytical_Solution2D(Psi,InputData.Nx,InputData.Ny,a0x,a0y,k0x,k0y,OutData.x,xc_WP,OutData.y,yc_WP,InputData.mu,time[it])
			#print('<br>Delta X=%g  Delta X_analytic=%g'%(Delta_X[it],Delta_X_analytic[it]))
			#print('<br>Delta Y=%g  Delta Y_analytic=%g'%(Delta_Y[it],Delta_Y_analytic[it]))
			OutData.psi_analytic_t.append(abs(Psi_analytic)**2)

		# plot temporal evolution
		if Temporal==5: 	#	create and save video
			ax.contourf(X, Y, abs(Psi)**2)

#			figure(it)
#			cp = plt.contourf(X, Y, abs(transpose(Psi))**2)
#			#cp = plt.contourf(X, Y, transpose(Vpot)/Vpot.max()*(abs(transpose(Psi))**2).max())
#			plt.colorbar(cp)
#			plt.title('$|\Psi(x,y)|^2$',size=20)
#			plt.xlabel('$x$ (u.a.)',size=20)
#			plt.ylabel('$y$ (u.a.)',size=20)
#			plt.show()
#			pause(0.5)

		deviation_x0_xL_y0_yL = abs( np.concatenate(([Psi[[0,-1],int(InputData.Ny/2)], Psi[int(InputData.Nx/2),[0,-1]]]))-psi0_x0_xL_y0_yL )
		print('<br>time=%g  norm=%g  <E>=%g  Delta_x0=%g Delta_xL=%g'%(time[it],norm[it],H_average[it],deviation_x0_xL_y0_yL[0],deviation_x0_xL_y0_yL[1]))
		if np.logical_and.reduce(deviation_x0_xL_y0_yL>epsilon):
			break


	if(InputData.Pot_Type==20):
		print('<br><br>u...')
		for i in range(int(InputData.Nx/2.),InputData.Nx):
			u = OutData.y*pi*InputData.ls/Lambda/(OutData.x[i] + 1e-15)
			I = sin(u)/(u + 1e-15)
			I[u==0] = 1

	#		Psi_plot+=np.zeros(1000,float)
	#		y_plot=np.zeros(1000,float)
	#		y_plot=np.linspace(y0,yL-delta_y,1000)
	#		Psi_plot=interp1d(OutData.y, abs(Psi[i,:]/Psi[i,int(Ny/2.)])**2, kind='cubic')

	#		figure(i*10)
			error = sum(abs(abs(Psi[i,:]/Psi[i,int(InputData.Ny/2.)])**2-abs(I)**2))

	#		#y,abs(Psi[i,:]/Psi[i,int(Ny/2.)])**2,'-k'
	#		plot(y_plot,Psi_plot(y_plot),'-k',lw=2)
	#		plot(OutData.y,abs(I)**2,'--or',lw=2)
	#		xlabel("$y$ (u.a.)",size=20)
	#		ylabel("Intensity",size=20)
	#		legend(["Numerical","Analytical"])
	#		ylim(min(abs(I)**2),max(abs(I)**2))
	#		xlim(y0,yL)

			if InputData.ls != 0:
				F = (InputData.ls/2.)**2/(Lambda*OutData.x[i] + 1e-15)
				print("<br>x[%d]=%g Lambda/ls=%g Fresnel number=%g error=%g"%(i,OutData.x[i],Lambda/InputData.ls,F,sum(error)))
	#		show()

			OutData.Delta_X_analytic = Delta_X_analytic
			OutData.Delta_Y_analytic = Delta_Y_analytic

	print ('<br>Time-dependent Schrodinger equation solving')
	print ('<br>  Normal end of execution.')
	print ('<br>')


	it += 1
	if it>Nt:
		it = Nt
	OutData.time				= time[:it]
	OutData.H_average			= H_average[:it]
	OutData.Delta_X_analytic	= Delta_X_analytic[:it]
	OutData.Delta_Y_analytic	= Delta_Y_analytic[:it]
	OutData.norm				= norm[:it]
	OutData.Heisenberg			= Heisenberg[:it]
	OutData.Delta_X				= Delta_X[:it]
	OutData.Delta_Y				= Delta_Y[:it]
	OutData.Delta_Px			= Delta_Px[:it]
	OutData.Delta_Py			= Delta_Py[:it]
	OutData.x_average			= x_average[:it]
	OutData.y_average			= y_average[:it]
	OutData.px_average			= px_average[:it]
	OutData.py_average			= py_average[:it]
	OutData.Heisenberg			= Heisenberg[:it]
	OutData.Heisenberg_X		= Heisenberg_X[:it]
	OutData.Heisenberg_Y		= Heisenberg_Y[:it]


#	create and save video
	# if Temporal==5: 	#	create and save video
	# 	print ('<br>Create video...')
	# 	wtime1 = process_time( )
	# 	OutData.video_fname = '../video_ex8/'+InputData.sessionID+'_video.gif'

		# SaveVideo(ax,OutData.video_fname,OutData.time)
		# print ('<br>Video %s created in %g seconds.'  % (OutData.video_fname, process_time( ) - wtime1 ))

	# print("ex7_2D",type(OutData))
	return props(OutData)
	


