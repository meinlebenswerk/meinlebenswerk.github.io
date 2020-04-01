# Welcome to Pandaemic!
![Imgae Caption](logo.svg)
Pandaemic is an experiment, created due to the ongoing covid-19/SARS II pandemic, that aims to build a more intuitive understanding of infectious disease spread.
At it's core this a rule based boid-engine with a fancy frontend ;)
Also the whole thing i.e. dynamic HTML Generation via JS etc... has been done without any libraries... I know, this is generally considered bad practice, but I wanted to see how hard it would be to implement some commonly used practices on my own :)
## Instructions
In order to run the code on your own machine, simply download the repo and then run

> npm start

This will start a Web-server on localhost:8080 and the typescript compiler (Hot reloading, etc.. included)

## Known Issues:
The Simulation gets fairly slow when you crank up the # of entities (Since the current boid-rule engine has roughly nRules * O(n^2) complexity -> I created an acceleration structure to bring this down, but it broke due to some code changes, I hope to bring this back eventually)
I don't particularly like the current icon, I will have to redo that at some point :/

## Thanks to:
[@Daiz](https://github.com/Daiz) whose [typescript-webapp-template](https://github.com/Daiz/typescript-webapp-template) helped me a lot in development :)
