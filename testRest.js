#!/usr/bin/env node
var sys = require('util'),
    rest = require('./restler');

rest.get('http://google.com').on('complete', function(result) {
  if (result instanceof Error) {
    sys.puts('Error: ' + result.message);
    this.retry(5000); // try again after 5 sec
  } else {
    sys.puts(result);
  }
});
