
# Project Setup Guide

This project uses:

-   Python for the backend
-   Node.js and npm for the frontend

----------

## System Requirements

-   At least 2 GB RAM (4 GB recommended)
-   At least 2 GB free disk space
-   Windows 10 or newer
-   macOS 11 or newer
-   Linux (Ubuntu, Debian, Fedora, Arch, etc.)

----------

## Install Python

### Windows

Official Installer Go to [https://www.python.org](https://www.python.org) Download the latest Windows installer Run it and enable Add Python to PATH Click Install Now

Chocolatey

```
choco install python

```

Winget

```
winget install Python.Python.3

```

----------

### macOS

Official Installer Download the macOS installer from [https://www.python.org](https://www.python.org) Run the .pkg file

Homebrew

```
brew install python

```

----------

### Linux

Debian/Ubuntu

```
sudo apt update
sudo apt install python3 python3-pip

```

Arch

```
sudo pacman -S python python-pip

```

Fedora

```
sudo dnf install python3 python3-pip

```

----------

## Install Node.js and npm

npm comes with Node.js.

Windows

```
choco install nodejs-lts
winget install OpenJS.NodeJS

```

macOS

```
brew install node

```

Linux

```
sudo apt update
sudo apt install nodejs npm

```

NVM Install

```
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts

```

----------

## Install Project Dependencies

Backend

```
python -m pip install --upgrade pip
pip install -r backend/requirements.txt

```

Frontend

```
cd frontend
npm install

```

----------

## Run the Project

Backend

```
cd backend
uvicorn main:app --reload

```

Backend URL [http://127.0.0.1:8000](http://127.0.0.1:8000)

Frontend

```
cd frontend
npm run dev

```

Frontend URL [http://localhost:5173](http://localhost:5173)

----------

## Verify Installation

```
python --version
pip --version
node --version
npm --version

```

----------