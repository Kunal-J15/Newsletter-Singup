const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.get("/", function(req,res){
  res.sendFile(__dirname+"/signUp.html")
});

app.post("/",function(req,res){
 const fname = req.body.first_name;
 const lname = req.body.last_name;
 const email = req.body.email;
 const data = {
   members:[
     {
       email_address: email,
       status: "subscribed",
       merge_fields:{
         FNAME:fname,
         LNAME:lname
       }
     }
   ]
 };

const jsonData = JSON.stringify(data);
const url = "https://us7.api.mailchimp.com/3.0/lists/70c92ee7b2";
const option = {
  method: "POST",
  auth:"Eagle:2efbf35a03f9f3e532f774f76fa249df-us7"
}
var req_post = https.request(url, option,function(response){
  if(response.statusCode===200){
    res.sendfile(__dirname+"/success.html");
  }
 else{
   res.sendfile(__dirname+"/fail.html")
 }
response.on("data",function(data){
  console.log(JSON.parse(data));
})
})

app.post("/fail",function(res,req){
  req.redirect("/");
})
req_post.write(jsonData);
req_post.end();
});

app.listen(process.env.PORT || 3000, function(){
  console.log("running...")
})
