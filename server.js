var http = require('http');
 var min = require('./js/min');

http.createServer(min.onHandle).listen(8080);
console.log('server is running on port 8080...');


