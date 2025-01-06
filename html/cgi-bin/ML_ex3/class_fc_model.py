# MKP: I modified the model in such a way that if one initialises the model with
#      the `with_energy` parameter being True, the dimension of the output is
#      augmented by 1 to account for the energy being the output alongside the
#      the wave functions.
import tensorflow as tf

class FC_Model(tf.keras.Model):
    '''
    Subclassed keras tf.keras.Model API. The input will be the potential V(x)
    and the output will be the wave function φ_n(x).
    Args:
      input_size (int): Number of x points
      with_energy (bool): Include energy alongside the wave function φ_n(x)
    Attributes:
      input_size (int): Number of x points
      fc1 (layer): First  fully cinnected layer with 512 filters and relu activation function
      dropout1 (layer): Dropout layer with dropout parameter of 0.2
      fc2 (layer): Second  fully cinnected layer with 256 filters and relu activation function
      dropout2 (layer): Dropout layer with dropout parameter of 0.2
      fc3 (layer): Third  fully cinnected layer with 256 filters and relu activation function
      dropout3 (layer): Dropout layer with dropout parameter of 0.2
      fc4 (layer): Fourth  fully cinnected layer with 128 filters and relu activation function
      dropout4 (layer): Dropout layer with dropout parameter of 0.2
      out (layer): Output layer predicting φ_n(x)
    '''

    def __init__(self,
                 name='fc_model', input_size=100,
                 n1=256, n2=256, n3=128, n4=128, drop=0.1,
                 with_energy=False, # MKP: I added the `with_energy` parameter
                 **kwargs):
        self.input_size = input_size
        self.with_energy = with_energy
        super(FC_Model, self).__init__(name=name, **kwargs)

        # Fully connected layer.

        self.fc1 = tf.keras.layers.Dense(n1,  activation='relu')
        # Apply Dropout (if is_training is False, dropout is not applied).
        self.dropout1 = tf.keras.layers.Dropout(rate=5*drop)

        # Fully connected layer.
        self.fc2 = tf.keras.layers.Dense(n2,  activation='relu')
        # Apply Dropout (if is_training is False, dropout is not applied).
        self.dropout2 = tf.keras.layers.Dropout(rate=3*drop)

        # Fully connected layer.
        self.fc3 = tf.keras.layers.Dense(n3, activation='relu')
        # Apply Dropout (if is_training is False, dropout is not applied).
        self.dropout3 = tf.keras.layers.Dropout(rate=4*drop)

        # Fully connected layer.
        self.fc4 = tf.keras.layers.Dense(n4, activation='relu')
        # Apply Dropout (if is_training is False, dropout is not applied).
        self.dropout4 = tf.keras.layers.Dropout(rate=2*drop)

        # Output layer (fully connected with input_size neurons and linear activation function )
        self.out = tf.keras.layers.Dense(self.input_size+self.with_energy, activation='linear') # MKP: I have changed so that the output depends on `with_energy` parameter

    @tf.function
    def call(self, inputs, is_training=False):
        '''
        Forward pass of the fully connected model

        Args:
          inputs (tensor): X data to pass through the network (V(x))
          is_training (bool): If training, True, otherwise, False

        Returns:
          out (tensor): Output tensor containing the values of φ_n(x)
        '''
        x = tf.reshape(inputs, tf.constant([-1, self.input_size]))
        x = self.fc1(x)
        x = self.dropout1(x, training=is_training)
        x = self.fc2(x)
        x = self.dropout2(x, training=is_training)
        x = self.fc3(x)
        x = self.dropout3(x, training=is_training)
        x = self.fc4(x)
        x = self.dropout4(x, training=is_training)
        out = self.out(x)
        return out