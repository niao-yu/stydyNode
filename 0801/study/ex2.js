var express = require('express');
var bodyParser = require('./bodyp.js');
var server = express();



server.listen(1273);
server.use(bodyParser.urlencoded());
//console.log(bodyParser);

server.use(function(req,res,next){
	console.log(req.body)
	//console.log('有人来了和～');
	//console.log('我是use1');
	//req.leo = 10;
	//next();
});
/*
server.use('',function(req,res){
	console.log(req.leo);

});
*/
/*
server.get('/myClevaly/addMp3',function(req,res){
	console.log('有人get了');
});

server.post('',function(req,res){
	console.log('有人post了')
});
*/
