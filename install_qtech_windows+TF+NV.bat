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


python -m pip install -r requirements.txt

cd .\html


echo Run local server and deactivate venv after stop server with ctrl+C 
call python -m http.server --cgi 8080 && (call ..\"%venv_name%"\Scripts\deactivate )

cd ..


REM Pause to keep the command prompt window open
pause
