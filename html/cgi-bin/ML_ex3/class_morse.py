import numpy as np
from scipy.special import eval_genlaguerre

class Morse:
    '''
    Class to generate potentials and wavefunctions of decoupled Morse potentials.
    Attributes:
    a_min (float): minimum value of Morse parameter a
    a_max (float): maximum value of Morse parameter a
    m (float): Mass
    xe_min (float): minimum value of Morse parameter xe
    xe_max (float): maximum value of Morse parameter xe
    hbar (float): h bar
    De_min (float): minimum value of Morse parameter De
    De_max (float): maximum value of Morse parameter De
    xmin (int): minimum value of x
    xmax (int): maximum value of x
    N (int): number of points of the domain
    a (np.array): Values of Morse parameters a
    xe (np.array): Values of Morse parameters xe
    De (np.array): Values of Morse parameters De
    '''

    def __init__(self, a_min=0.05, a_max=0.1, hbar=1, De_min=0.1, De_max=0.5, xe_min=-5,
                 xe_max=5, m=1, x_min=-30, x_max=30, N=100):
        self.a_min = a_min  # a ~ U(a_min, a_max)
        self.a_max = a_max
        self.m = m
        self.xe_min = xe_min
        self.xe_max = xe_max
        self.hbar = hbar
        self.De_min = De_min
        self.De_max = De_max
        self.xmin = x_min
        self.xmax = x_max
        self.N = N  # Number of points of the grid
        self.a = None
        self.xe = None
        self.De = None

    def generate_a(self, N):
        '''
        Generate Morse parameters a, xe, De
        Args:
          N (int): number of samples
        '''
        if N == None:
            N = 100
        self.a = np.random.uniform(self.a_min, self.a_max, N).reshape(-1, 1)
        self.xe = np.random.uniform(self.xe_min, self.xe_max, N).reshape(-1, 1)
        self.De = np.random.uniform(self.De_min, self.De_max, N).reshape(-1, 1)

    def generate_data(self, N=None, n=None, new_a=True):
        '''
        Generates N random data points from the energetic level n
        Args:
          N (int): number of samples
          n (int)_ energetic level
          new_a (boolean): if True, new parameters are generated
        Returns:
          phi (np.array): Wavefunctions
          x (np.array): x grid
          a (np.array): Values of a
          De (np.array): Values of De
          xe (np.array): Values of xe
          potential (np.array): V(x)
        '''
        if new_a or self.a.any() == None or self.xe.any() == None or self.De.any() == None:
            self.generate_a(N)

        x = np.arange(self.xmin, self.xmax, (self.xmax -
                      self.xmin)/self.N)  # Grid of x values
        lamb = np.sqrt(2*self.m*self.De)/(self.a*self.hbar)
        lamb = lamb.reshape(-1, 1)
        ones = np.repeat(1, N)
        x_mat = np.tensordot(x, ones, axes=0).T

        y = (x_mat-self.xe)*self.a
        z = 2*lamb*np.exp(-y)

        exp = np.exp(-1/2*z)  # exponential term
        pot = z**(lamb - n - 1/2)  # Potential term

        laguerre = eval_genlaguerre(n, 2*lamb - 2*n - 1, z)

        phi_n = pot*exp*laguerre

        h = (self.xmax - self.xmin)/self.N
        # np.sqrt(factorial(int(n)) * (2*lamb - 2*n - 1)/gamma(2*lamb - n)) # Normalization constant
        C = 1./np.sqrt(np.sum(phi_n*phi_n*h, axis=1))
        C = C.reshape(-1, 1)

        phi_n = C*phi_n

        potential = self.De*(np.exp(-2*y) - 2*np.exp(-y))

        return phi_n, x, self.a, self.De, self.xe, potential

    def get_energy(self, n, a=None, De=None):
        '''
        Returns analytical energy.
        Args:
          n (int): Energetic level
          a (np.array): Values of a
          De (np.array): Values of De
        Returns:
          E (np.array): energy for every sample
        '''
        if a.any() == None:
            a = self.a
        if De.any() == None:
            De = self.De
        lamb = np.sqrt(2*self.m*De)/(a*self.hbar)
        E = - self.hbar*self.hbar*a*a/(2*self.m)*(lamb - n-1/2)**2
        return E.flatten()