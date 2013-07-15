var express = require('express'),
    fs = require('fs');

var app = express.createServer();

app.use(express.logger());
app.set("view options", {layout:false});
app.use(express.static(__dirname);

app.get('/', function(request, response) {
  	response.reder('index.html');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
