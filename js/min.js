var fs = require('fs');
var qs = require('querystring');
var urlPath = require('url');
var mail = require('./mail');
var upload = require('./uploadfile');

module.exports = {

  onHandle: function(req, res){
    
    var body = '';
    var path = urlPath.parse(req.url, true);
    if(req.url == "/"){
        route(res,'./index.html', "text/html");
	}else if(req.method === "POST" && req.url === '/contact'){

		req.on('data', data => (body += data,
            body.length>1e6? (body='', res.writeHead(413, {"Content-Type": "text/plain"}).end('Too much data.'),
        	req.connection.destroy()): '')
	    );
        var content=[];

		req.on('end', () => {

			fs.exists('./data/data.json', (exists) => {
				if (exists) {
				  	fs.readFile('./data/data.json', (err, data)=> { 
						content=JSON.parse(data); 
	                    req.post = qs.parse(body);
	                    req.post.id = uuid();
					    content.push(req.post);
						fs.writeFile('./data/data.json', JSON.stringify(content),"utf8", (err)=> { if(err)throw err;});
				    });
				    console.log('Data.json already exists');

				} else {
                    req.post = qs.parse(body);
                    req.post.id = uuid();
                    content.push(req.post);
				  	fs.writeFile('./data/data.json', JSON.stringify(content),"utf8", (err)=> { 
				  		if(err)throw err;
                        console.log('File created');
				  	});
				}
			});

		});
        
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(`<h3>Info saved</h3><a href="http://localhost:8080/contacts">Click here</a><span> to see</span>`);
    }else if(req.url === '/send-mail' && req.method === "POST"){

        req.on('data', data => (body+=data, 
        	body.length>1e6? (body='', res.writeHead(413, {"Content-Type": "text/plain"}).end('Too much data.'),
        	req.connection.destroy()): '')
        );

        req.on('end', ()=> {
        	req.post = qs.parse(body);
        	var mailObj = JSON.parse(Object.keys(req.post)[0]);
            var mailTo = mailObj.mailto,
            	subject = mailObj.subject,
            	content = mailObj.content;
            mail.sendEmail(mailTo, subject, content, res);
        });
    }else if(path.pathname === '/hobby'){ 
    	var id = path.query.id;
		    fs.readFile('./data/data.json', (err, data)=>{
		    	var userData = JSON.parse(data).filter(el=> el.id ===id);
		    	var userDataStr = JSON.stringify(userData);
		     res.writeHead(200, {"Content-Type": "application/json"});
		     res.end(userDataStr);
	     });
	}else if(req.url === '/contacts'){
            route(res, './html/contacts.html', "text/html");
    }else if(req.url === '/script'){
            route(res, './js/script.js', "application/javascript" );
    }else if(req.url === '/get_contacts'){
            route(res, './data/data.json', "application/json");
    }else if(req.url === '/index'){
            route(res, './css/index.css', "text/css");
    }else if(req.url === '/style'){
            route(res, './css/style.css', "text/css");
    }else if(req.url === '/upload'){
            route(res, './html/upload.html', "text/html");
    }else if(req.url === '/uploaded'&& req.method === 'POST'){  
            upload.fileUpload(req,res);
    }else { 
	        res.writeHead(404 , {"Content-Type": "text/plain"});
	        res.end('Page not found in ' + req.url);
    }	
  }
}

function route(res, filePath, type){
	res.writeHead(200, {"Content-Type": type});
	fs.createReadStream(filePath).pipe(res);
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}