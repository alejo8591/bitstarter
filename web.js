var express = require('express'),
    fs = require('fs');
// Instance App
var app = express.createServer();

app.use(express.logger());

app.get('/', function(request, response) {
  	fs.readFile('index.html', 'utf8', function(err, html){
		response.send(html);
	});
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
