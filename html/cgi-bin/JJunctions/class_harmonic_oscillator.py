import numpy as np
from typing import Any, Callable, Protocol, TypeVar, Tuple, Union
import scipy

class HarmonicOscillator:
    '''
    Class to generate data (energies E and wave functions phi(x)) of harmonic 
    oscillator for given quadratic potentials, using the plane wave basis

    Parameters
    ----------
    N : int
        Number of points between `xmin` and `xmax`.
    xmin : float
        Minimal value of the domain.
    xmax : float
        Maximal value of the domain.
    x0 : np.ndarray[Any, np.dtype[np.float64]]
        (n_samples) array. Centres of the potentials for all
        samples.
    omega : np.ndarray[Any, np.dtype[np.float64]]
        (n_samples) array. Angular frequencies of the potentials 
        for all samples.
    mass : float
        (Effective) mass of the particle (by default equal to 1).
    hbar : float
        Reduced Planck constant (by default equal to 1).

    Attributes
    ----------
    N : int
        Number of points between `xmin` and `xmax`.
    xmin : float
        Minimal value of the domain.
    xmax : float
        Maximal value of the domain.
    x0 : np.ndarray[Any, np.dtype[np.float64]]
        (n_samples) array. Centres of the potentials for all
        samples.
    omega : np.ndarray[Any, np.dtype[np.float64]]
        (n_samples) array. Angular frequencies of the potentials 
        for all samples.
    mass : float
        (Effective) mass of the particle (by default equal to 1).
    hbar : float
        Reduced Planck constant (by default equal to 1).
    n_samples : int
        Number of sample potentials.

    Methods
    -------
    generate_data
        Solves Schrödinger equation for all given samples.
    evaluate_potential
        Returns the potentials alongside the domain.
    '''

    def __init__(self, N: int, xmin: float, xmax: float,
                 x0: np.ndarray[Any, np.dtype[np.float64]],
                 omega: np.ndarray[Any, np.dtype[np.float64]],
                 mass: float = 1., hbar: float = 1.):

        self.N = N  # Length of plane wave basis
        self.xmin = xmin  # xmin
        self.xmax = xmax  # xmax
        self.x0 = x0
        self.omega = omega
        self.mass = mass
        self.hbar = hbar
        self.n_samples = omega.shape[0]

    def generate_data(self, n_state: int
                      ) -> Tuple[np.ndarray[Any, np.dtype[np.float64]],
                                 np.ndarray[Any, np.dtype[np.float64]]]:
        '''
        Generates energies and `n_state` excited states for each sample potential.

        Parameters
        ----------
        n_state : int
            Number indicating the excited state (ground state corresponds to
            `n_state`=0)

        Returns
        -------
        E : np.ndarray[Any, np.dtype[np.float64]]
            (n_sample) array. Energies of the `n_state` state for each 
            potential.
        phis : np.ndarray[Any, np.dtype[np.float64]]
            (n_sample x N) array. Coefficients of the wave function 
            for each potential.

        Examples
        --------
        >>> import numpy as np
        >>> import scipy
        >>> rng = np.random.default_rng(42)
        >>> omega = rng.random((3,1))
        >>> x0 = rng.random((3,1))-1/2
        >>> hpot = HarmonicOscillator(3, 0, 1, x0, omega)
        >>> E, phis = hpot.generate_data(0)
        >>> E
        array([0.38697802, 0.21943922, 0.42929896])
        >>> phis
        array([[1.01972577, 1.02783458, 0.95063949],
               [1.09662169, 1.00851927, 0.88335143],
               [0.94345826, 1.030681  , 1.02351511]])
        '''
        x = np.arange(self.xmin, self.xmax,
                      (self.xmax - self.xmin)/self.N)
        sigma_inv = np.sqrt(self.mass*self.omega/self.hbar).reshape(-1, 1)
        all_x = (x - self.x0)*sigma_inv

        herm = scipy.special.eval_hermite(n_state, all_x)  # H_n(x/sigma)
        exp = np.exp(- all_x**2/2)  # Exponential term

        phis = exp*herm

        h = (self.xmax - self.xmin)/self.N
        # 1/np.sqrt(2**n * math.factorial(int(n))) * np.sqrt(sigma_inv)# Normalization constant
        C = 1./np.sqrt(np.sum(phis*phis*h, axis=1))
        C = C.reshape(-1, 1)
        phis = C*phis  # exp*herm

        E = self.hbar*self.omega*(n_state+1/2)
        E = E.flatten()

        return E, phis

    def evaluate_potential(self
                           ) -> Tuple[np.ndarray[Any, np.dtype[np.float64]],
                                      np.ndarray[Any, np.dtype[np.float64]]]:
        '''
        Evaluate the potentials V(x) and domain x.

        Parameters
        ----------
        N : int
            Number of points between `xmin` and `xmax`.
        xmin : float
            Minimal value of the domain.
        xmax : float
            Maximal value of the domain.

        Returns
        -------
        V : np.ndarray[Any, np.dtype[np.float64]]
            (n_samples x N) float-valued matrix encoding potentials for all
            samples.
        x : np.ndarray[Any, np.dtype[np.float64]]
            (N) array. Values in the domain between xmin and xmax.

        Examples
        --------
        >>> import numpy as np
        >>> import scipy
        >>> rng = np.random.default_rng(42)
        >>> omega = rng.random((3,1))
        >>> x0 = rng.random((3,1))-1/2
        >>> hpot = HarmonicOscillator(3, 0, 1, x0, omega)
        >>> V, x = hpot.evaluate_potential()
        >>> V
        array([[0.01166692, 0.0055368 , 0.06596312],
               [0.01586102, 0.05261756, 0.11077569],
               [0.08338236, 0.00746264, 0.01345296]])
        >>> x
        array([0.        , 0.33333333, 0.66666667])
        '''
        x = np.arange(self.xmin, self.xmax,
                      (self.xmax - self.xmin)/self.N)
        V = (x-self.x0)**2 * 1/2*self.mass*self.omega**2

        return V, x