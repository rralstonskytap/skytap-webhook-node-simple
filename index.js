var express = require('express')
var app = express()
const fs = require('fs');

var bunyan = require('bunyan');

var log = bunyan.createLogger({
    name: 'webhook',
    streams: [{
        path: 'webhook.log'
        // `type: 'file'` is implied
    }]
});

// Update to change the port the listener accepts connections on
const PORT=9876;

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
  l = l + JSON.stringify(JSONObject.payload[0].payload) + '", "';
  l = l + JSONObject.payload[0].user.name + '", "';
  l = l + JSONObject.payload[0].department.name + '", "';
  l = l + JSONObject.payload[0].project.name + '", "';
  l = l + JSON.stringify(JSONObject.payload[0].operated_on) +'"';

  if (JSONObject.payload.length > 1) {
    log.warn('payload array > 1 (' + JSONObject.payload.length + ') - information not saved in additional payload objects NOT saved');
  }

  //console.log(l);
  fs.appendFile('audit_log.csv', l, (err) => {
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

app.listen(PORT, () => log.info(`Example app listening on port ${PORT}!`))
