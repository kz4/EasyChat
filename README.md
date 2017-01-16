# A Simple Chat Application using MEAN stack

## Prerequisite
1. Install Node.js [here](https://nodejs.org/en/)

## Setup
1. ```npm install```
2. If bower is not installed, install bower with ```sudo npm install -g bower```
3. ```bower install``` to install the bower components, if you get an error:
```Error: EACCES: permission denied, open '/Users/YOURUSER/.config/configstore/bower-github.json'
   You don't have access to this file.
```
Fix it with:
```
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```
4. ```cd``` to the directory where ```server.js``` is located, run by ```node server.js```