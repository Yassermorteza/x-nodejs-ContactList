const nodemailer = require('nodemailer');
const config = require('./config');

let transporter = nodemailer.createTransport({
	service: 'Gmail',
	port: 25,
	auth: {
		user: config.user,
		pass: config.pass
	}
});

module.exports = {
  sendEmail : function(emailTo, subject, content, res){

		let mailOptions = {
			from: config.user,
			to: emailTo,
			subject: subject,
			text: content
		}
        console.log(emailTo, config.user, content, subject);
		transporter.sendMail(mailOptions, (err, info)=>{
			if(err){
				return console.log(err);
			}
			console.log('Email sent: ', info.response);
			res.writeHead(200, {"Content-Type": "text/html"});
            res.end(JSON.stringify({"feedback": '<span>Email was sent successfully</span>'}));

		});

  	}
}