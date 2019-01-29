# node-webook-simple
Simple node.js Skytap webhook endpoint example. This is a node.js express app that will listen on a port for Skytap `POST` and log the body of the message in the log file. It will also attempt to capture the audit log messages into a comma separated value file.

There is also a health-check method that you can call on /health-check that will return a status 200 'OK' on a `GET` request.

## Requirements
* git
* npm
* nodejs


## Install
    $ git clone https://github.com/rralstonskytap/skytap-webhook-node-simple.git
    $ cd skytap-webhook-node-simple
    $ npm install
## Configuration
Configuration is done through environment variables as defined in `.env`

* `AUDIT_FILE=audit_log.csv`
This defines where the parsed audit log events will be stored.
* `LOG_FILE=webhook.log`
Logging output will be saved here. You can use `./node_modules/.bin/bunyan webhook.log` to pretty print the logs
* `HEADER= "\"message_id\", \"timestamp\", \"category\", \"version\", \"id\", \"type\", \"type_code\", \"date\", \"region\", \"payload\", \"user\", \"department\", \"project\", \"operated_on\""`
The header line at the top of the AUDIT_FILE
* `PORT=9876`
The port to listen on
* `USE_HTTPS=true`
Listen for https connections

## Run
    $ npm start

## Notes
You will need to create a `server.cert` and `server.key` file that reflects your SSL certificates for https connections.

### An example command to generate a self-signed certificate:
    $ openssl req -nodes -new -x509 -keyout server.key -out server.cert
