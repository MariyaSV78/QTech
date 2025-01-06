#!/bin/bash

VENV_NAME="QTech_CUDA_venv"
SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
VENV_PREFIX=$SCRIPTPATH/$VENV_NAME


# Check if python venv is available
if python3 -m venv --help &>/dev/null; then
  echo "Python venv is already installed."
else
  echo "Attempting to install Python venv..."
  sudo apt -y update && sudo apt -y install python3-venv
  echo "Python venv has been installed."
fi


# Check if the virtual environment directory exists

if [ -d "$VENV_NAME" ]; then
    echo "Virtual environment '$VENV_NAME' exists for the project."
else
    echo "Creating a virtual environment"
    python3 -m venv "$VENV_NAME"
fi


echo "Activate the virtual environment"
source "$VENV_NAME"/bin/activate


pip3 install -r requirements.txt

python3 -m ipykernel install --user --name=$VENV_NAME

cd ./html

echo Run local server and deactivate venv. For stop server - ctrl+C 
python3 -m http.server --cgi 8080

cd ..

echo "To deactivat venv"
deactivate

Pause to keep the terminal open
read -p "Press Enter to exit"
