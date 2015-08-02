var fs = require('fs');
var path = require('path');
var http2 = require('http2');
var buffet = require('buffet')('./assets');

// The callback to handle requests
function onRequest(req, res) {
  buffet(req, res, function () {
    buffet.notFound(req, res);
  })
}

// Creating a bunyan logger (optional)
var log = require('./src/util').createLogger('server');

// Creating the server in plain or TLS mode (TLS mode is the default)
var server;
if (process.env.HTTP2_PLAIN) {
  server = http2.raw.createServer({
    log: log
  }, onRequest);
} else {
  server = http2.createServer({
    log: log,
    key: fs.readFileSync(path.join(__dirname, '/localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, '/localhost.crt'))
  }, onRequest);
}
server.listen(process.env.HTTP2_PORT || 8080, function() {
  console.log(`Started server on port ${process.env.HTTP2_PORT || 8080}`);
});
