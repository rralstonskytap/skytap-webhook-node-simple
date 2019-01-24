var express = require('express')
var app = express()

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



// respond with 200 (OK)
app.get('/health-check', function (req, res) {
  log.info('GET /health-check');
  res.status(200).send('OK')
})

// POST method route - log to the console
app.post('/', function (req, res) {
  log.info('POST /');
  log.info('--------');

  req.on('data', (chunk) => {
    log.info(`BODY: ${chunk}`);
  });
  req.on('end', () => {
    log.info('No more data in response.');
    res.status(200).send('OK')
  });
})

app.listen(PORT, () => log.info(`Example app listening on port ${PORT}!`))
