var express = require('express')
var app = express()

// Update to change the port the listener accepts connections on
const PORT=8080;

// timestamp
function ts() {
  return new Date().toUTCString();
}

function logit(stuff) {
  console.log(ts() + ':' + stuff);
}

// respond with 200 (OK)
app.get('/health-check', function (req, res) {
  logit('GET /health-check');
  res.status(200).send('OK')
})

// POST method route - log to the console
app.post('/', function (req, res) {
  logit('POST /');
  logit('--------');

  req.on('data', (chunk) => {
    logit(`BODY: ${chunk}`);
  });
  req.on('end', () => {
    logit('No more data in response.');
    res.status(200).send('OK')
  });
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
