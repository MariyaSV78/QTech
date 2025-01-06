import tensorflow as tf
from sklearn.metrics import mean_absolute_error


class Training():
    '''
    Performs the training of the autoencoder model using mean absolute error loss

    Args:
    net (Model): Model to train
    learning_rate (float): Learning Rate for Adam optimizer
    training_iters (int): Numer of training iterations
    batch_size (int): Batch size
    display_step (int): Number of iterations to wait to print the current performance of the model
    early_stopping (int): Number of epochs to wait for the validation loss to increase before performing early stopping
    filepath (str): File path to store and recover the model weights
    restore (bool): If true, it looks for existing weights to reestore them

    Attributes: 
    net (Model): Model to train
    learning_rate (float): Learning Rate for Adam optimizer
    training_iters (int): Numer of training iterations
    batch_size (int): Batch size
    display_step (int): Number of iterations to wait to print the current performance of the model
    stopping_step (int): How many epochs we have waited so far without the validation loss decreasing
    early_stopping (int): Number of epochs to wait for the validation loss to increase before performing early stopping
    filepath (str): File path to store and recover the model weights
    restore (bool): If true, it looks for existing weights to reestore them
    loss (function): Loss function to optimize. In this case, mean square error
    optimizer (tf.Optimizer): Adam optimizer for the learning steps
    ckpt (tf.Checkpoint): Checkpoint that stores weights and optimizer state
    manager (tf.CheckpointManager): Controls that not too many checkpoint files are stored 
    '''
    
    def __init__(self,
                 net,
                 learning_rate,
                 training_iters,
                 batch_size,
                 display_step,
                 early_stopping=50,
                 filepath=None,
                 restore=True,
                 loss=tf.keras.losses.MeanSquaredError(), # MKP: I have added the parameter allowing for a custom loss function
                 supress_logging=False):
        self.losses = []
        self.net = net
        self.learning_rate = learning_rate
        self.training_iters = training_iters
        self.batch_size = batch_size
        self.display_step = display_step
        self.stopping_step = 0
        self.loss = loss
        self.early_stopping = early_stopping
        self.optimizer = tf.keras.optimizers.Adam(self.learning_rate)
        self.filepath = filepath
        self.supress_logging = supress_logging
        self.ckpt = tf.train.Checkpoint(optimizer=self.optimizer, net=self.net)
        self.manager = tf.train.CheckpointManager(
            self.ckpt, directory=filepath, max_to_keep=3)
        if restore:
            self.ckpt.restore(self.manager.latest_checkpoint)
            if self.manager.latest_checkpoint:
                if not self.supress_logging:
                    print("Restored from {}".format(
                        self.manager.latest_checkpoint))
            else:
                if not self.supress_logging:
                    print("Initializing from scratch.")

    def loss_val(self, x_val, y_val):
        '''
        Computes the validation loss 
        Args:
        x_val(tensor): batch of validation sample
        y_val (tensor): labels for validation
        Returns:
         val_loss(tensor): validation loss
        '''
        pred_val = self.net(x_val, False)
        val_loss = self.loss(pred_val, y_val)
        return val_loss

    def early_stop(self, epoch, val_loss, stop):
        '''
        Assesses if we have to stop training
        Args:
         epoch (int): current epoch
         val_loss (tensor): current validation loss
         stop (bool): early stop parameter
        Returns:
         stop(bool): True if the models stops training, false if it continues training
         '''
        # Store best validation loss
        if epoch == 0:
            self.best_loss = val_loss
        else:
            if val_loss < self.best_loss:
                self.stopping_step = 0
                self.best_loss = val_loss
            else:
                # If the validation loss does not decrease, we increase the number of stopping steps
                self.stopping_step += 1
        # If such number reaches the maximum, we stop training
        if self.stopping_step == self.early_stopping:
            stop = True
            if not self.supress_logging:
                print('Early stopping was triggered, epoch =%f\n' % epoch)
        return stop

    # Optimization process.
    @tf.function()
    def run_optimization(self, x, y):
        '''
        Performs one step of the learning process. It calculates the loss function and
        appies backpropagation algorithm to update the weights.

        Args:
        x (tensor): Samples of training data used to train the model
        y (tensor): Labels for training data

        Returns:
        -
        '''
        # Wrap computation inside a GradientTape for automatic differentiation.
        with tf.GradientTape() as g:
            # Forward pass.
            pred = self.net(x)
            # Compute loss.
            loss = self.loss(pred, y)

        # Variables to update, i.e. trainable variables.
        trainable_variables = self.net.trainable_variables

        # Compute gradients.
        gradients = g.gradient(loss, trainable_variables)

        # Update W and b following gradients.
        self.optimizer.apply_gradients(zip(gradients, trainable_variables))
        return loss

    # @tf.function
    def fit(self, X_train, y_train, X_test, y_test, save=True):
        '''
        Main fit function 

        Args:
          X_train (numpy array): Processed training data
          y_train (numpy array): Labels training data
          X_test (numpy array): Processed test data
          y_test (numpy array): Labels test data
          save (bool): If true, we save the weights at the end of the training
        Returns:
          -
        '''
        # Create train and test datasets
        # Use tf.data API to shuffle and batch data.
        train_data = tf.data.Dataset.from_tensor_slices((X_train, y_train))
        train_data = train_data.repeat().shuffle(
            5000).batch(self.batch_size).prefetch(1)

        test_data = tf.data.Dataset.from_tensor_slices((X_test, y_test))
        test_data = test_data.shuffle(buffer_size=1024).batch(self.batch_size)

        loss_batch = []
        val_loss_batch = []
        mae_train_all = []
        mae_val_all = []
        # losses = [] # Initialize a list to store the result of training

        stop = False
        epoch = 0
        # Run training for the given number of steps (and while not early stopping).
        while epoch < self.training_iters and stop == False:
            for step, (batch_x_train, batch_y_train) in enumerate(train_data.take(self.training_iters), 1):
                # Apply backpropagation algorithm
                loss = self.run_optimization(batch_x_train, batch_y_train)
                loss_batch.append(loss.numpy())
                #MEA for training
                mae_train = mean_absolute_error(batch_x_train, batch_y_train)
                # mae_train_all.append(mae_train.numpy())


            # MKP: This block of 7 lines was indented once too many times, which made the calculation
            # of the validation loss wrong and therefore lead to early stopping
            for (test_x, test_y) in test_data:
                # Compute validation loss
                val_loss = self.loss_val(test_x, test_y)
                val_loss_batch.append(val_loss.numpy())
                
                #MEA for validation
                mae_val = mean_absolute_error(test_x, test_y)
                # mae_val_all.append(mae_val.numpy())

            stop = self.early_stop(epoch, val_loss, stop)
            epoch += 1

            # Display the result
            if epoch % self.display_step == 0:
                if not self.supress_logging:
                    # epoch_data = (epoch, val_loss.numpy(), loss.numpy())
                    epoch_data = (epoch, val_loss.numpy(), loss.numpy(), mae_train, mae_val )

                    self.losses.append(epoch_data)
                    # print('Epoch: ', epoch, "Validation loss: ",
                    #       val_loss.numpy(), "Loss: ", loss.numpy(), "mae_train", mae_train, "mae_val", mae_val)

        # Save the weights
        if save:
            save_path = self.manager.save()
            if not self.supress_logging:
                print("Saved checkpoint for step {}".format(save_path))
    
     
        return self.losses

