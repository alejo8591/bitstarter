#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs'),
    program = require('commander'),
    cheerio = require('cheerio'),
    sys = require('util'),
    restler = require('./restler'),
    HTMLFILE_DEFAULT = "index.html",
    CHECKSFILE_DEFAULT = "checks.json";



var assertFileExists = function(infile){
	var instr = infile.toString();
	if(!fs.existsSync(instr)){
		console.log("%s does not exist. Exiting.", instr);
		process.exit(1);
	}
	return instr;
};

var cheerioHtmlFile = function(htmlfile){
	return cheerio.load(htmlfile);
};

var loadChecks = function(checksfile){
	return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile){
	$ = cheerioHtmlFile(htmlfile);
	var checks = loadChecks(checksfile).sort();
	var out = {};
	for(var i in checks){
		var present = $(checks[i]).length > 0;
		out[checks[i]] = present;
	}
	return outJson(out);
};

var clone = function(fn){
	 // Workaround for commander.js issue.
    	 // http://stackoverflow.com/a/6772648
	return fn.bind({});
};

if(require.main == module){
	program.option('-c, --checks <check_file>', 'Path to check.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-u, --url <html_url>', 'Path to index.html')
	.parse(process.argv);
  if(program.url){
    restler.get(program.url).on('complete', function(result) {
      if (result instanceof Error) {
        sys.puts('Error: ' + result.message);
        this.retry(5000); // try again after 5 sec
      } else {
        var checkJson = checkHtmlFile(result, program.checks);
      } 
    });
  }
	var outJson = function(checkJson){
    console.log(JSON.stringify(checkJson, null, 4));
  }
} else {
	exports.checkHtmlFile = checkHtmlFile;
}

