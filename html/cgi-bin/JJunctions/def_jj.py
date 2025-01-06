import numpy as np
from typing import Any, Callable, Protocol, TypeVar, Tuple, Union


T = TypeVar('T')


class PCallable(Protocol):
    """
    Helper `typing.Protocol` class. 

    Parameters
    ----------
    x : TypeVar('T')
        First input variable.
    *args : float
        Positional arguments.

    Returns
    -------
    TypeVar('T')
        Output.               
    """

    def __call__(self, x: T, *args: float) -> T: ...



def format_latex(number: float, precision: int = 2) -> str:
    r'''
    Returns a float as a string formatted in scientific notation
    in LaTeX format.

    Parameters
    ----------
    number : float
        Number to be formatted.
    precision : int
        Precision up to which mantissa is supposed to be displayed.

    Returns
    -------
    number_tex : str
        String containing the float formatted in scientific notation
        in LaTeX format.

    Examples
    --------
    >>> format_latex(539850)
    '5.40\\times 10^{+5}'
    >>> format_latex(0.00937859, 4)
    '9.3786\\times 10^{-3}'
    '''

    number_tex = f'{number:0.{precision}e}'.split('e')
    number_tex[1] = (number_tex[1][0] +
                     number_tex[1][1:].lstrip('0'))
    number_tex = r'\times 10^{'.join(number_tex)
    number_tex += '}'

    return number_tex   



def construct_potentials(function: PCallable,
                         parameters: np.ndarray[Any,
                                                np.dtype[np.float64]],
                         x: np.ndarray[Any, np.dtype[np.float64]]
                         ) -> np.ndarray[Any, np.dtype[np.float64]]:
    '''
    Returns the final wavefunctions psi(x) for each sample potential.

    Parameters
    ----------
    function : Callable
        Potential as a function of position and parameters.
    parameters : np.ndarray[Any, np.dtype[np.float64]]
        (n_samples x n_parameters) array. Parameters of the potentials.
    x : np.ndarray[Any, np.dtype[np.float64]]
        (N) array. Values in the domain between xmin and xmax.

    Returns
    -------
    np.ndarray[Any, np.dtype[np.float64]]
        (n_samples x N) array. Potentials evaluated on the domain `x`
        with parameters given by `parameters`

    Examples
    --------
    >>> import numpy as np
    >>> import scipy
    >>> f = lambda x, *A: A[0] + A[1]*x + A[2]*x**2
    >>> params = np.array([[1,0,0], [0,1,0], [0,0,1]])
    >>> x = np.linspace(0,4,6)
    >>> construct_potentials(f, params, x)
    array([[ 1.  ,  1.  ,  1.  ,  1.  ,  1.  ,  1.  ],
           [ 0.  ,  0.8 ,  1.6 ,  2.4 ,  3.2 ,  4.  ],
           [ 0.  ,  0.64,  2.56,  5.76, 10.24, 16.  ]])
    '''
    f: Callable[[np.ndarray[Any, np.dtype[np.float64]]],
                np.ndarray[Any, np.dtype[np.float64]]] = lambda a: function(x, *a)
    

    return np.apply_along_axis(f, 1, parameters)

################################################################################

def hamiltonian_charge(N: int, EC: float, EJ: float, ng: float
                       ) -> np.ndarray[Any, np.dtype[np.float64]]:
    r'''
    Returns a Hamiltonian of the voltage-biased Cooper-pair box
    in the number operator basis, given its parameters.

    Parameters
    ----------
    N : int
        Dimension of the unitary space.
    EC : float
        Value of the juction charging energy $E_C$.
    EJ : float
        Value of the tunnelling energy $E_J$.
    ng : float
        An occupation number offset $n_g$ from the biasing
        voltage.

    Returns
    -------
    H : np.ndarray[Any, np.dtype[np.float64]]
        (N x N) array; the Hamiltonian of the system.

    Examples
    --------
    >>> hamiltonian_charge(3, 1, 1/2, 1/4)
    array([[ 6.25, -0.25,  0.  ],
           [-0.25,  0.25, -0.25],
           [ 0.  , -0.25,  2.25]])
    '''

    diag = 4*EC*(np.diag(np.arange(N)-(N-1)//2)
                 - ng*np.identity(N))**2

    offdiag = np.zeros((N, N))
    for i in range(1, N-1):
        offdiag[i-1, i] = 1
        offdiag[i+1, i] = 1
    offdiag[1, 0] = 1
    offdiag[N-2, N-1] = 1

    offdiag = -1/2*EJ*offdiag
    H: np.ndarray[Any, np.dtype[np.float64]] = diag + offdiag

    return H


def v(N: int, n: int) -> np.ndarray[Any, np.dtype[np.float64]]:
    r'''
    Returns a number operator eigenvector to the eigenvalue
    n.

    Parameters
    ----------
    N : int
        Dimension of the unitary space.
    n : int
        The eigenvalue of the number operator.

    Returns
    -------
    v : np.ndarray[Any, np.dtype[np.float64]]
        (N) array; a unit vector.

    Examples
    --------
    >>> v(3,0)
    array([0., 1., 0.])
    '''
    if n < -(N//2)-(N % 2-1) or n > N//2:
        raise Exception(("The parameter n is out of bounds. "
                         "The range of n is "
                         f"[{-(N//2)-(N%2-1)}, {N//2}]"))
    v = np.zeros(N)
    v[-(-(N//2)-(N % 2-1))+n] = 1
    return v


###################################################################

def energies_transmon_approx(m: int | np.ndarray[Any,
                                                 np.dtype[np.int64]],
                             EJ: float | np.ndarray[Any,
                                                    np.dtype[np.float64]],
                             EC: float | np.ndarray[Any,
                                                    np.dtype[np.float64]]
                             ) -> np.ndarray[Any, np.dtype[np.float64]]:
    r'''
    Returns an approximate energy of a state for a transmon system 
    obtained from a quartic approximation of the potential.

    Parameters
    ----------
    m : int | np.ndarray[Any, np.dtype[np.int64]
        An excitation level or an array of them.
    EJ : float | np.ndarray[Any, np.dtype[np.float64]]
        One value of the parameter $E_J$ or an array of them.
    EC : float | np.ndarray[Any, np.dtype[np.float64]]
        One value of the parameter $E_C$ or an array of them.

    Returns
    -------
    np.ndarray[Any, np.dtype[np.float64]]
        An array of approximated energies.

    Examples
    --------
    >>> energies_transmon_approx(0, 1, 1)
    array([0.16421356])
    >>> energies_transmon_approx(np.arange(3),
    ... np.array([[10],[20],[30]]),
    ... 1)
    array([[ -5.77786405,   2.16640786,   9.11067977],
           [-13.92544468,  -2.27633404,   8.3727766 ],
           [-22.50403331,  -8.01209992,   5.47983346]])
    '''
    E = -EJ + np.sqrt(8*EJ*EC)*(m+1/2) - EC/12*(6*m**2+6*m+3)
    if type(E) == np.ndarray:
        return E
    else:
        return np.array([E])