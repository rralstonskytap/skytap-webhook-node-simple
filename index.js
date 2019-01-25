var express = require('express')
var app = express()
const os = require('os')
const fs = require('fs')
const AUDIT_FILE = 'audit_log.csv';
const LOG_FILE = 'webhook.log';
const HEADER = '"message_id", "timestamp", "category", "version", "id", "type", "type_code", "date", "region", "payload", "user", "department", "project", "operated_on"';

// Update to change the port the listener accepts connections on
const PORT=9876;


var bunyan = require('bunyan')

var log = bunyan.createLogger({
    name: 'webhook',
    streams: [{
        path: LOG_FILE
        // `type: 'file'` is implied
    }]
});


// takes a JSON string, converts it to an object and saves it into a CSV file
function logCSV(JSONString) {
  var JSONObject = JSON.parse(JSONString);
  var l = ""; // line used to collect the pieces

  //log.info(JSONObject);
  log.info('JSONString:'+JSONString);

  l = l + '"' + JSONObject.message_id + '", "';
  l = l + JSONObject.timestamp + '", "';
  l = l + JSONObject.category + '", "';
  l = l + JSONObject.version + '", "';
  l = l + JSONObject.payload[0].id + '", "';
  l = l + JSONObject.payload[0].type + '", "';
  l = l + JSONObject.payload[0].type_code + '", "';
  l = l + JSONObject.payload[0].date + '", "';
  l = l + JSONObject.payload[0].region + '", "';
  l = l + JSON.stringify(JSONObject.payload[0].payload).replace(/\"/g, "").replace(/\,/g, " ") + '", "';
  l = l + JSONObject.payload[0].user.name + '", "';
  l = l + JSONObject.payload[0].department.name + '", "';
  l = l + JSONObject.payload[0].project.name + '", "';
  l = l + JSON.stringify(JSONObject.payload[0].operated_on).replace(/\"/g, "").replace(/\,/g, " ") + '"' + os.EOL;

  if (JSONObject.payload.length > 1) {
    log.warn('payload array > 1 (' + JSONObject.payload.length + ') - information not saved in additional payload objects NOT saved');
  }

  //console.log(l);
  fs.appendFile(AUDIT_FILE, l, (err) => {
    if (err) {
      log.warn("Error writing to file",err);
      throw err;
    }
  });

}

// respond with 200 (OK)
app.get('/health-check', function (req, res) {
  log.info('GET /health-check');
  res.status(200).send('OK')
})

// POST method route - log to the console
app.post('/', function (req, res) {
  log.info('POST /');

  req.on('data', (chunk) => {
    log.debug(`BODY: ${chunk}`);
    logCSV(chunk);
  });
  req.on('end', () => {
    log.debug('No more data in response.');
    res.status(200).send('OK')
  });
})

// check to see if the audit_log.csv file exists and if not create and add a header line.
fs.access(AUDIT_FILE, fs.constants.F_OK | fs.constants.W_OK, (err) => {
  if (err) { // doesn't exist
    fs.appendFile(AUDIT_FILE, HEADER + os.EOL, (err) => {
      if (err) {
        log.warn("Error writing to file",err);
        throw err;
      }
    });
  }
});
app.listen(PORT, () => log.info(`Example app listening on port ${PORT}!`))
