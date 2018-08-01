var express = require('express');
var bodyParser = require('body-parser');
var static = require('express-static');
var server = express();



server.listen(1273);
server.use(bodyParser.urlencoded({}));
//console.log(bodyParser);

server.use('/leo',function(req,res,next){

	console.log(req.body);
	if(req.body.user == 'leo' && req.body.pass =='123456'){
		res.send('ok')
	}
	else{
		res.send('no ok!');
	}
	//res.send({a:10});
	//res.write();
	//res.end();
	//console.log(req.body)
	//console.log('有人来了和～');
	//console.log('我是use1');
	//req.leo = 10;
	//next();
});

server.use(static('./www'));


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
