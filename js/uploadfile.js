var formidable = require('formidable');

module.exports = {
	
   fileUpload:function(req, res){
          var form = new formidable.IncomingForm();
          form.uploadDir = __dirname + '/../upload/';
          form.parse(req, (err, fields, files)=>{
               if(err){ throw err};
               if(files.upload.name !== ''){
                  res.writeHead(200, {'content-type': 'text/plain'});
                  res.end('received upload:\n\n');
               }else{
                  res.writeHead(404, {'content-type': 'text/plain'});
                  res.end('No file chosen');
               }
               
          });  
   }
}