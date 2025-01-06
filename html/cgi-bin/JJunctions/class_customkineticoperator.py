import numpy as np
from typing import Any, Callable, Protocol, TypeVar, Tuple, Union
from .class_custompotential import CustomPotential

class CustomKineticOperator(CustomPotential):
    '''
    Class to generate data (energies E and wave functions phi(x)) for given
    potentials, using the plane wave basis

    Parameters
    ----------
    N : int
        Number of points between `xmin` and `xmax`.
    xmin : float
        Minimal value of the domain.
    xmax : float
        Maximal value of the domain.
    V : np.ndarray[Any, np.dtype[np.float64]]
        (n_samples x N) float-valued matrix encoding potentials for all
        samples.
    mass : float
        (Effective) mass of the particle (by default equal to 1).
    hbar : float
        Planck constant (by default equal to 1).
    quad_kin_coeff : float
        Coefficient of the term proportional to the square
        of momentum in the kinetic energy operator.
    lin_kin_coeff : float
        Coefficient of the term proportional to momentum
        in the kinetic energy operator.
    const_kin_coeff : float
        Coefficient of a constant term in the kinetic energy 
        operator.

    Attributes
    ----------
    N : int
        Number of points between `xmin` and `xmax`.
    xmin : float
        Minimal value of the domain.
    xmax : float
        Maximal value of the domain.
    V : np.ndarray[Any, np.dtype[np.float64]]
        (n_samples x N) float-valued matrix encoding potentials for all
        samples.
    mass : float
        (Effective) mass of the particle.
    hbar : float
        Planck constant.
    quad_kin_coeff : float
        Coefficient of the term proportional to the square
        of momentum in the kinetic energy operator.
    lin_kin_coeff : float
        Coefficient of the term proportional to momentum
        in the kinetic energy operator.
    const_kin_coeff : float
        Coefficient of a constant term in the kinetic energy 
        operator.
    n_samples : int
        Number of sample potentials.
    T : Union[np.ndarray[Any, np.dtype[np.float64]],
              np.ndarray[Any, np.dtype[np.complex128]]]
        (N x N) array. Kinetic energy part of the Hamiltonian.

    Methods
    -------
    find_eigen_state
        Solves the Hamiltonian and returns energy eigenvalues
        and eigenvectors.
    create_kinetic_energy
        Returns a kinetic energy operator.
    generate_data
        Solves Schrödinger equation for all given samples.
    evaluate_potential
        Returns the potentials alongside the domain.
    final_wavefunction
        Returns a wave function with appropriate phase.
    '''

    def __init__(self, N: int, xmin: float, xmax: float,
                 V: np.ndarray[Any, np.dtype[np.float64]],
                 mass: float = 1., hbar: float = 1.,
                 quad_kin_coeff: float = 1.,
                 lin_kin_coeff: float = 0.,
                 const_kin_coeff: float = 0.) -> None:
        super().__init__(N, xmin, xmax, V, mass, hbar)
        self.quad_kin_coeff = quad_kin_coeff
        self.lin_kin_coeff = lin_kin_coeff
        self.const_kin_coeff = const_kin_coeff
        self.T = self.create_kinetic_energy(self.quad_kin_coeff,
                                            self.lin_kin_coeff,
                                            self.const_kin_coeff)

    def create_kinetic_energy(self,
                              quad_kin_coeff: float = 1.,
                              lin_kin_coeff: float = 0.,
                              const_kin_coeff: float = 0.,
                              ) -> Union[np.ndarray[Any, np.dtype[np.float64]],
                                         np.ndarray[Any, np.dtype[np.complex128]]]:
        '''
        Construct the kinetic energy part of the Hamiltonian.

        Parameters
        ----------
        quad_kin_coeff : float
            Coefficient of the term P^2/(2m) in the kinetic energy operator.
        lin_kin_coeff : float
            Coefficient of the term P/m (i.e. momentum divided by mass)
            in the kinetic energy operator.
        const_kin_coeff : float
            Coefficient of a constant term 1/(2m) in the kinetic energy 
            operator (practically just shifts all energy levels).

        Returns
        -------
        T : Union[np.ndarray[Any, np.dtype[np.float64]],
                  np.ndarray[Any, np.dtype[np.complex128]]]
            (N x N) array. Kinetic energy part of the Hamiltonian.

        Examples
        --------
        >>> import numpy as np
        >>> import scipy
        >>> rng = np.random.default_rng(42)
        >>> V = rng.random((2,3))
        >>> ckin = CustomKineticOperator(3, 0, 1, V)
        >>> ckin.create_kinetic_energy()
        array([[ 18.09427474, -13.15947253,  13.15947253],
               [-13.15947253,  18.09427474, -13.15947253],
               [ 13.15947253, -13.15947253,  18.09427474]])

        The method can also take additional parameters, adding a term
        proportional to momentum to the kinetic energy operator
        with the use of `lin_kin_coeff`.

        >>> import numpy as np
        >>> import scipy
        >>> rng = np.random.default_rng(42)
        >>> V = rng.random((2,3))
        >>> ckin = CustomKineticOperator(3, 0, 1, V, lin_kin_coeff=1)
        >>> ckin.create_kinetic_energy(lin_kin_coeff=1).round(3)
        array([[ 14.953+0.j   , -10.018-1.814j,  10.018-1.814j],
               [-10.018+1.814j,  14.953+0.j   , -10.018-1.814j],
               [ 10.018+1.814j, -10.018+1.814j,  14.953+0.j   ]])

        One can also add a constant term to the kinetic energy
        operator using `const_kin_coeff` parameter.

        >>> import numpy as np
        >>> import scipy
        >>> rng = np.random.default_rng(42)
        >>> V = rng.random((2,3))
        >>> ckin = CustomKineticOperator(3, 0, 1, V, \
                                         const_kin_coeff=1)
        >>> ckin.create_kinetic_energy(const_kin_coeff=1)
        array([[ 18.59427474, -13.15947253,  13.15947253],
               [-13.15947253,  18.59427474, -13.15947253],
               [ 13.15947253, -13.15947253,  18.59427474]])
        '''
        N = self.N  # N==N
        xmin = self.xmin  # xmin
        xmax = self.xmax  # xmax

        Q = np.zeros((N, N))
        delta_x = (xmax-xmin)/N
        L = delta_x*N
        mu = self.mass
        # Build matrix T using the plane wave basis

        for n in range(N):
            for m in range(N):
                if(n == m):
                    Q[n, m] = self.hbar**2*np.pi**2/(mu*L**2)*(N**2+2)/6
                elif(n != m):
                    Q[n, m] = self.hbar**2*(-1)**(n-m)*np.pi**2/(mu*L**2) * \
                        1./(np.sin(np.pi*(n-m)/N))**2
        Q *= quad_kin_coeff

        P = np.zeros((N, N), dtype=np.complex128)
        for n in range(N):
            for m in range(N):
                if(n == m):
                    P[n, m] = -self.hbar*np.pi/L
                elif(n != m):
                    P[n, m] = -self.hbar*(-1)**(n-m)*np.pi/L * \
                        (1 + 1j/np.tan(np.pi*(n-m)/N))
        P *= lin_kin_coeff/mu

        I = np.identity(N)*const_kin_coeff/(2*mu)

        if lin_kin_coeff == 0:
            T = Q + I
        else:
            T = Q + P + I

        return T