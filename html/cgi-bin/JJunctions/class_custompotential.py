import numpy as np
from typing import Any, Callable, Protocol, TypeVar, Tuple, Union
import scipy


class CustomPotential:
    '''
    Class to generate data (energies E and wave functions phi(x)) for given
    potentials, using the plane wave basis.

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
    n_samples : int
        Number of sample potentials.
    T : np.ndarray[Any, np.dtype[Any]]
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
                 mass: float = 1., hbar: float = 1.) -> None:

        self.mass = mass
        self.hbar = hbar
        self.N = N  # Length of plane wave basis
        self.xmin = xmin  # xmin
        self.xmax = xmax  # xmax
        self.V = V
        self.n_samples = V.shape[0]
        self.T = self.create_kinetic_energy()

    def create_kinetic_energy(self
                              ) -> np.ndarray[Any, np.dtype[Any]]:
        '''
        Construct the kinetic energy part of the Hamiltonian.

        Parameters
        ----------

        Returns
        -------
        T : np.ndarray[Any, np.dtype[Any]]
            (N x N) array. Kinetic energy part of the Hamiltonian.

        Examples
        --------
        >>> import numpy as np
        >>> import scipy
        >>> rng = np.random.default_rng(42)
        >>> V = rng.random((2,3))
        >>> cpot = CustomPotential(3, 0, 1, V)
        >>> cpot.create_kinetic_energy()
        array([[ 18.09427474, -13.15947253,  13.15947253],
               [-13.15947253,  18.09427474, -13.15947253],
               [ 13.15947253, -13.15947253,  18.09427474]])
        '''

        N = self.N  # N==N
        xmin = self.xmin  # xmin
        xmax = self.xmax  # xmax

        T = np.zeros((N, N))
        delta_x = (xmax-xmin)/N
        L = delta_x*N
        mu = self.mass
        # Build matrix T using the plane wave basis

        for n in range(N):
            for m in range(N):
                if(n == m):
                    T[n, m] = self.hbar**2 * \
                        (-1)**(n-m)*np.pi**2/(mu*L**2)*(N**2+2)/6
                elif(n != m):
                    T[n, m] = self.hbar**2*(-1)**(n-m)*np.pi**2/(mu*L**2) * \
                        1./(np.sin(np.pi*(n-m)/N))**2

        return T

    def find_eigen_state(self, V: np.ndarray[Any, np.dtype[np.float64]],
                         n_state: int
                         ) -> Tuple[float,
                                    np.ndarray[Any, np.dtype[Any]]]:
        '''
        Finds the eigenvector for Hamiltonians with potentials V(x).

        Parameters
        ----------
        V : np.ndarray[Any, np.dtype[np.float64]]
            The potentials of the system.
        n_state : int
            Number indicating the excited state (ground state corresponds to
            `n_state`=0)

        Returns
        -------
        E_a : float
            Energies of the `n_state` state for potential `V`.
        a : np.ndarray[Any, np.dtype[Any]]
            N array. Coefficients in the basis of the H.O. potential.

        Examples
        --------
        >>> import numpy as np
        >>> import scipy
        >>> rng = np.random.default_rng(42)
        >>> V = rng.random((2,3))
        >>> cpot = CustomPotential(3, 0, 1, V)
        >>> cpot.find_eigen_state(V[0], 0)
        (5.496366546067522, array([0.81574651, 1.41220614, 0.58329362]))
        '''
        # 0. Generate matrix of C_nm
        N = self.N  # N==N
        xmin = self.xmin  # xmin
        xmax = self.xmax  # xmax

        delta_x = (xmax-xmin)/N
        L = delta_x*N

        # 1. Build matrix T using the plane wave basis
        T = self.T

        # 2. Build matrix V
        V = np.diag(V)

        # 3. Build matrix H
        if np.can_cast(V.dtype, T.dtype):
            H = np.zeros((N, N), dtype=T.dtype)
            veps = np.zeros((N, N), dtype=T.dtype)
            vaps = np.zeros(N, dtype=T.dtype)
        else:
            H = np.zeros((N, N), dtype=V.dtype)
            veps = np.zeros((N, N), dtype=V.dtype)
            vaps = np.zeros(N, dtype=V.dtype)

        H = T + V

        # 4. Diagonalize matrix H
        vaps, veps = np.linalg.eigh(H)

        # 5. Set bound wave functions to be real and normalize them
        for n in range(N):
            if np.iscomplexobj(veps):
                norm = veps[:, n].conj().T @ veps[:, n]
            else:
                norm = np.dot(veps[:, n], veps[:, n])
            macloc = np.argmax(abs(veps[:, n]))
            veps[:, n] = veps[:, n]*abs(veps[macloc, n])/veps[macloc, n]
            veps[:, n] = veps[:, n]/np.sqrt(delta_x*norm)

        # 6. We choose the vector with n_state-th lowest energy
        # as an approximation of the n_state state
        a = veps[:, n_state]  # Final value of eigenvalues for state n_state
        if not np.iscomplex(vaps[n_state]).sum():
            E_a = vaps[n_state].real.astype(np.float64)  # Value of the energy
        else:
            E_a = vaps[n_state]

        return E_a, a

    def generate_data(self, n_state: int, display: int | None = 100
                      ) -> Tuple[np.ndarray[Any, np.dtype[np.float64]],
                                 np.ndarray[Any, np.dtype[Any]]]:
        '''
        Generates energies and `n_state` excited states for each sample potential.

        Parameters
        ----------
        n_state : int
            Number indicating the excited state (ground state corresponds to
            `n_state`=0)
        display : int | None
            Frequency of updates during solving. If None, the updates 
            are supressed.

        Returns
        -------
        E : np.ndarray[Any, np.dtype[np.float64]]
            (n_sample) array. Energies of the `n_state` state for each potential V.
        a : np.ndarray[Any, np.dtype[Any]]
            (n_sample x N) array. Coefficients in the basis of the H.O. potential
            for each potential V.

        Examples
        --------
        >>> import numpy as np
        >>> import scipy
        >>> rng = np.random.default_rng(42)
        >>> V = rng.random((2,3))
        >>> cpot = CustomPotential(3, 0, 1, V)
        >>> E, a = cpot.generate_data(0, None)
        >>> E
        array([5.49636655, 5.26099885])
        >>> a
        array([[0.81574651, 1.41220614, 0.58329362],
               [0.87865515, 1.40562287, 0.50218469]])
        '''
        data = np.zeros((self.n_samples, self.N))

        # Prepare vectors of energies and coefficients
        E = np.zeros(self.n_samples)
        if np.can_cast(self.V.dtype, self.T.dtype):
            a = np.zeros((self.n_samples, self.N), dtype=self.T.dtype)
        else:
            a = np.zeros((self.n_samples, self.N), dtype=self.V.dtype)
        # Find ground state for each sample
        for i in range(self.n_samples):
            E_new, a_new = self.find_eigen_state(self.V[i, :], n_state)
            if display is not None:
                if i % display == 0:
                    print(f"\rGenerating data: {i}/{self.n_samples}",
                          end='')
            E[i] = E_new
            a[i, :] = a_new
        return E, a

    def evaluate_potential(self
                           ) -> Tuple[np.ndarray[Any, np.dtype[np.float64]],
                                      np.ndarray[Any, np.dtype[np.float64]]]:
        '''
        Evaluate the potentials V(x) and domain x.

        Parameters
        ----------

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
        >>> V = rng.random((2,3))
        >>> cpot = CustomPotential(3, 0, 1, V)
        >>> V, x = cpot.evaluate_potential()
        >>> V
        array([[0.77395605, 0.43887844, 0.85859792],
               [0.69736803, 0.09417735, 0.97562235]])
        >>> x
        array([0.        , 0.33333333, 0.66666667])
        '''
        x = np.arange(self.xmin, self.xmax,
                      (self.xmax - self.xmin)/self.N)
        V = self.V

        return V, x

    def final_wavefunction(self, a: np.ndarray[Any, np.dtype[np.float64]]
                           ) -> Tuple[np.ndarray[Any, np.dtype[Any]],
                                      np.ndarray[Any, np.dtype[np.float64]],
                                      np.ndarray[Any, np.dtype[Any]]]:
        '''
        Returns the final wavefunctions psi(x) for each sample potential.

        Parameters
        ----------
        a : np.ndarray[Any, np.dtype[Any]]
            (n_sample x N) array. Coefficients in the basis of the H.O. potential
            for each potential V.

        Returns
        -------
        waves : np.ndarray[Any, np.dtype[Any]]
            (n_samples x N) array. Wave functions for each potential, with 
            a corrected phase factor.
        x : np.ndarray[Any, np.dtype[np.float64]]
            (N) array. Values in the domain between xmin and xmax.
        a : np.ndarray[Any, np.dtype[Any]]
            (n_sample x N) array. Coefficients in the basis of the H.O. potential
            for each potential V.

        Examples
        --------
        >>> import numpy as np
        >>> import scipy
        >>> rng = np.random.default_rng(42)
        >>> V = rng.random((2,3))
        >>> cpot = CustomPotential(3, 0, 1, V)
        >>> E, a = cpot.generate_data(0, None)
        >>> waves, x, phis = cpot.final_wavefunction(a)
        >>> waves
        array([[0.81574651, 1.41220614, 0.58329362],
               [0.87865515, 1.40562287, 0.50218469]])
        >>> x
        array([0.        , 0.33333333, 0.66666667])
        >>> phis
        array([[0.81574651, 1.41220614, 0.58329362],
               [0.87865515, 1.40562287, 0.50218469]])
        '''
        x = np.arange(self.xmin, self.xmax,
                      (self.xmax - self.xmin)/self.N)
        # Construct matrix of waves
        if np.can_cast(self.V.dtype, self.T.dtype):
            waves = np.zeros((self.n_samples, self.N), dtype=self.T.dtype)
        else:
            waves = np.zeros((self.n_samples, self.N), dtype=self.V.dtype)

        waves = a.copy()
        for i in range(self.n_samples):
            # convention: To choose the phase we make the maximums be first
            w = waves[i, :]
            maxi = scipy.signal.argrelextrema(w, np.greater)[0]
            mini = scipy.signal.argrelextrema(w, np.less)[0]
            idx2 = np.abs(w[maxi]) > 5e-2
            maxi = maxi[idx2]
            idx2 = np.abs(w[mini]) > 5e-2
            mini = mini[idx2]
            if len(maxi) == 0 and len(mini) > 0:
                waves[i, :] = -waves[i, :]
            elif len(mini) > 0 and len(maxi) > 0 and mini[0] < maxi[0]:
                waves[i, :] = -waves[i, :]
        return waves, x, a