@echo off

set "VENV_NAME=QTech_venv"
set "vers=3"

REM Get the script's directory path
for %%I in ("%~dp0.") do set "SCRIPTPATH=%%~fI"

set "VENV_PREFIX=%SCRIPTPATH%\%VENV_NAME%"


REM Check if python is available and if it matches the desired version

python --version | find "%vers%" >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    echo Python version %vers% is installed.
) ELSE (
    echo Python version %vers% is not installed. Please install Python %vers% using your preferred method of installation.
    exit /b
)


REM Check if python venv is available

python -c "help('venv')" >nul 2>&1
IF %errorlevel% equ 0 (
  echo Python venv is already installed.
) ELSE (
  echo Attempting to install Python venv...
  install -y python-venv
  
)


REM Check if the virtual environment directory exists

IF EXIST "%VENV_NAME%" (
    echo Virtual environment '%VENV_NAME%' exists for the project.
) ELSE (
    echo Creating a virtual environment...
    python -m venv "%VENV_NAME%" 
)


echo Activate the virtual environment
call "%VENV_NAME%"\Scripts\activate && (call python.exe -m pip install --upgrade pip )


where nvcc >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo CUDA is not installed. Proceeding with installation...
    set /p INSTALL_CUDA="Install CUDA (y/[n])? "
    
    if /i "%INSTALL_CUDA%"=="y" (
        echo Installing CUDA...
        REM Download CUDA manually from NVIDIA website and run the installer
        REM Example:
    	curl -O https://developer.download.nvidia.com/compute/cuda/12.3.1/local_installers/cuda_12.3.1_546.12_windows.exe
   	start "cuda_12.3.1_546.12_windows.exe"

        python -m pip install -r requirements_qtech_CUDA.txt
    ) else (
        echo Skipping CUDA...
    )
) else (
    echo CUDA is already installed.
)


python -m pip install -r requirements_qtech.txt

REM Install IPython kernel
REM python -m ipykernel install --user --name=%VENV_NAME%


REM Get the path to cuDNN library (if applicable)
for /f "usebackq tokens=*" %%A in (`python -c "import nvidia.cudnn, os; print(os.path.dirname(nvidia.cudnn.__file__))"`) do set "CUDNN_PATH=%%A"

REM Extend the PATH variable to include the required libraries
if defined CUDNN_PATH set "LD_LIBRARY_PATH=%LD_LIBRARY_PATH%;%VENV_PREFIX%\lib\;%CUDNN_PATH%\lib"

REM Check for GPU devices using TensorFlow
python -c "import tensorflow as tf; print(tf.config.list_physical_devices('GPU'))"


cd .\html


echo Run local server and deactivate venv after stop server with ctrl+C 
call python -m http.server --cgi 8080 && (call ..\"%venv_name%"\Scripts\deactivate )

cd ..


REM Pause to keep the command prompt window open
pause
