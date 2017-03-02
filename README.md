# COMS4156
This is the final project of COMS 4156, co-authored by four members from the class - JY, YW, RJ, and YQ.

### March 2 2017 - Jinyang
I uploaded a template to start with. This template includes node.js configuration and routing, mongoDB connection, handlebar.js view engine (same as mastache.js), and user signup and login system. This template is modified from https://github.com/pymander/userAuth.git

Right now the user login stays as is in the above work (+google/twitter/etc login, -writer/reader selection), will change it to fit our system soon.

Note this template needs to install first. First install node.js and mongodb before install this package.
Then do,
```
npm install
```
in the package directory. 
In order to open it, do
```
mangod
```
in a SECOND terminal, then do
```
node index.js
```
in the FIRST terminal.

## First step goal
- simple input text in a box and save in db and render on browser.
- modify user login to fit our goal.
