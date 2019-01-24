var express = require('express')
var app = express()
const fs = require('fs');

var bunyan = require('bunyan');
//var log = bunyan.createLogger({name: "skytap-webhook"});

var log = bunyan.createLogger({
    name: 'webhook',
    streams: [{
        path: 'webhook.log'
        // `type: 'file'` is implied
    }]
});

// Update to change the port the listener accepts connections on
const PORT=8080;

// takes a JSON string, converts it to an object and saves it into a CSV file
function logCSV(JSONString) {
  var JSONObject = JSON.parse(JSONString);

  //log.info(JSONObject);
  console.log(JSONObject);
  
  log.info('message_id: ' + JSONObject.message_id + ' timestamp: ' + JSONObject.timestamp + ' category: ' + JSONObject.category + ' version: ' + JSONObject.version);
  log.info('number of objects in payload: ' + JSONObject.payload.length);
  for (i = 0; i < JSONObject.payload.length; i++) {
    log.info('id: ' + JSONObject.payload[i].id + ' type: ' + JSONObject.payload[i].type + ' type_code: ' + JSONObject.payload[i].type_code +
            ' date: ' + JSONObject.payload[i].date + ' region: ' + JSONObject.payload[i].region);
    log.info(JSONObject.payload[i].payload);
  }
  //fs.appendFile('audit.csv', 'data to append', (err) => {
  //  if (err) throw err;
  //  log.error('The "data to append" was appended to file!');
  //});
}

// respond with 200 (OK)
app.get('/health-check', function (req, res) {
  log.info('GET /health-check');
  res.status(200).send('OK')
})

// POST method route - log to the console
app.post('/', function (req, res) {
  log.debug('POST /');

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
