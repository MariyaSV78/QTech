import numpy as np

# MKP: I have changed the name of the function to hamiltonian_expectation_value
def hamiltonian_expectation_value(φ,
                                  potential,
                                  xmin=-8,
                                  xmax=8,
                                  N=100,
                                  hbar=1,
                                  m=1):
    '''
    Function to calculate the empirical energy of a wavefunction
    Args:
      φ (np.array): Wavefunctions
      potential (np.array): potential V(x)
      xmin (int): minimum value of x
      xmax (int): maximum value of x
      N (int): number of grid points
      hbar (float): h bar
      m (float): mass
    Returns:
      E (np.array): empirical energies
    '''
    # Normalize φ just in case
    h = (xmax - xmin)/N

    def energy(φ, potential, h):
        '''
          Calculates the empirical energy for one wavefunction
          Args:
            φ (np.array): Wavefunctions
            potential (np.array): potential V(x)
            h (float): lattice size
          Returns:
            E (float): empirical energy 
        '''
        C = 1./np.sqrt(np.sum(φ*φ*h))
        φ = C*φ
        # We first calculate the second derivative of φ
        # We add 0 at the extrema.
        φr = np.concatenate((φ[1:], np.zeros(1)), axis=0)
        # It makes sense because φ(x)->0 at x->+-inf
        φl = np.concatenate((np.zeros(1), φ[:-1]), axis=0)

        deriv = (φr - 2.0*φ + φl)/(h*h)
        return np.sum((-hbar*hbar/(2*m)*φ*deriv + potential*(φ*φ))*h)

    E = np.array([energy(φ[i, :], potential[i, :], h)
                 for i in range(φ.shape[0])])
    return E

def fix_sign(arr, arr2):
    r'''
    Given a two arrays, returns a second array with a sign corrected 
    to minimise their difference.

    Parameters
    ----------
    arr : np.ndarray[Any, np.dtype[np.float64]]
        A reference array.
    arr2 : np.ndarray[Any, np.dtype[np.float64]]
        An array which sign should be corrected in reference to `arr`.

    Returns
    -------
    np.ndarray[Any, np.dtype[np.float64]]
        The `arr2` array with a sign corrected.

    Examples
    --------
    >>> import numpy as np
    >>> y = np.array([[2, 3, 4], [3, 2, 4]])
    array([[2, 3, 4],
           [3, 2, 4]])
    >>> fix_sign(y, -y)
    array([[2, 3, 4],
           [3, 2, 4]])
    '''
    diffs = np.vstack((
        np.abs(arr - arr2).sum(axis=-1),
        np.abs(arr + arr2).sum(axis=-1)))
    argmin = np.argmin(diffs, axis=0)
    return (-1)**argmin.reshape(-1,1) * arr2


# MKP: A new function which calculates energy. It is more precise, but slightly slower than the previous one:
#      explicitly, it is still O(n) like the previous function, but it is ~2.5 slower in the limit of large N.
def get_energy(waves, Vs, x, mass=1., hbar=1.):
    '''
    Function to calculate the empirical energy of a wavefunction
    Args:
      waves (np.array): Wavefunctions
      Vs (np.array): potentials V(x)
      x (np.array): Values of x
      mass (float): mass
      hbar (float): h bar
    Returns:
      Es (np.array): energies
    '''
    
    N = x.shape[0]  # N==N
    delta_x = x[1]-x[0]

    T = np.zeros((N, N))
    L = delta_x*N

    for n in range(N):
        for m in range(N):
            if(n == m):
                T[n, m] = hbar**2*(-1)**(n-m)*np.pi**2/(mass*L**2)*(N**2+2)/6
            elif(n != m):
                T[n, m] = hbar**2*(-1)**(n-m)*np.pi**2/(mass*L**2) * \
                    1./(np.sin(np.pi*(n-m)/N))**2

    Es = np.zeros((waves.shape[0]))
    for i in range(Es.shape[0]):
        H = T + np.diag(Vs[i])
        Es[i] = (waves[i].T @ H @ waves[i]) / (waves[i].T @ waves[i])

    return Es