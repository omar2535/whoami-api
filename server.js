var express = require('express');
var bodyParser = require('body-parser');
var useragent = require('useragent');
var request = require('request');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));

var port = (process.env.PORT || 3000);

app.listen(port, function(){
    console.log("we are live on port: "+port);
});

app.get('/api', function(req, res){
    console.log("API accessed! Information being parsed!!!");
    var agent = useragent.parse(req.headers['user-agent']);
    console.log("os: " + agent.os.toString());
    console.log("ip: "+ req.ip);
    var response = {
        ip: req.connection.localAddress,
        language: req.headers["accept-language"],
        software: agent.os.toString(),
        browser: agent.family,
        device: agent.device.toString(),
    };
    res.send(response);
});

app.get('/', function(req, res){
    res.send('Please add /api in your browser to use the api');
});

var requestLoop = setInterval(function(){
    request({
        url: "https://whoami-api-omar.herokuapp.com/api",
        method: "GET",
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10
    },function(error, response, body){
        if(!error && response.statusCode == 200){
            console.log(JSON.stringify(response.body, undefined, 2));
        }else{
            console.log('error' + response.statusCode);
        }
    });
  }, 60000);