var express = require('express');
var socket = require('socket.io');

//App Setup
var port = process.env.PORT || 4000;
var app = express();
var server = app.listen(port,function(){
	console.log('Listening to requests on port 4000');
});

//Static Files
app.use(express.static('public'));	
//User Array
var users = [];

//Socket Setup
var io = socket(server);

io.on('connection', function(socket){
	console.log('Connection has been made', socket.id);

	//Handle Events
	socket.on('setUser', function(data) {
    	console.log(data);
    	if(users.indexOf(data) > -1) {
        	socket.emit('userExists', data);
        } 
        else {
        	users.push(data);
        	socket.emit('userSet', data);
        }
	});
	
	socket.on('chat', function(data){
		io.sockets.emit('chat', data);
	});

	socket.on('typing', function(data){
		socket.broadcast.emit('typing', data);
	});

	socket.on('userOut', function(data){
		var i = users.indexOf(data);
		users.splice(i,1);
	});

});

