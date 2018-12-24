var express = require("express");
var nodemailer = require("nodemailer");
var bodyParser = require("body-parser");
var app = express();
app.listen(4000);

var emailAccount = nodemailer.createTransport({
  service:"GMail",
  port: 465,
  secure: true, // use SSL
  auth:{
    user: "email",
    pass:"password for email"
   }

});
var mailOptions = {
    from: '"World at Glance" <test@gmail.com>', // sender address (who sends)
    to: 'test2@yahoo.com, sekhoniqbal@yahoo.com', // list of receivers (who receives)
    subject: 'sign in request', // Subject line
  //  text: 'Hello world ', // plaintext body uncomment this line.
    html: '<b>Hi</b><br> YOur sign in code is 123456' // html body
};
emailAccount.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }

    console.log('Message sent: ' + info.response);
});
/*
const sendmail = require('sendmail')();
sendmail({
    from: 'no-reply@yourdomain.com',
    to: 'sekhoniqbal@yahoo.com, sekhoniqbal22@gmail.com',
    subject: 'test sendmail',
    html: 'Mail of test sendmail',
  }, function(err, reply) {
    console.log(err && err.stack);
    console.dir(reply);
});
*/
app.use(bodyParser({}))
app.post("/sendcode", sendcode);

function generateCode(){
return  Math.floor(Math.random()*1000000);
}
function sendcode(req, res){
  console.log("got post request");
  if(req.body.email){}
  res.writeHeader(200, {"Access-Control-Allow-Origin": "*"})
  res.end();

}
