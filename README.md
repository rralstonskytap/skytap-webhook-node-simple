# node-webook-simple
Simple node.js Skytap webhook endpoint example. This is a node.js express app that will listen on a port for Skytap `POST` and log the body of the message to the console.

There is also a health-check method that you can call on /health-check that will return a status 200 'OK' on a `GET` request.

## Requirements
* git
* npm
* nodejs


## Install
    $ git clone https://github.com/rralstonskytap/skytap-webhook-node-simple.git
    $ cd skytap-webhook-node-simple
    npm install
## Run
    $ node index.js

## Notes
By default the app listens on port 8080, if you with to use a different port change this line in index.js:

`const PORT=8080;`
