//Make Connection
//for heroku 
var socket = io.connect(window.location.hostname);
//offline
//var socket = io.connect('http://localhost:4000');


console.log('Connected Successfully');

//Query DOM
var naam = document.getElementById('naam');
var getname = document.getElementById('getname');
var feedback = document.getElementById('feedback');
var user;
var message;
var feedback2;
var sendmsg;
var output;
var chatwindow;

//Cursor on field
naam.focus();

//Emit Events
getname.onsubmit = function(e){
	//Prevent form submission which refreshes page
	e.preventDefault();

	socket.emit('setUser', naam.value);
	console.log('getname '+ naam.value);
};

//Listen for Events
socket.on('userExists', function(data) {
        console.log('user already exists');
        feedback.innerHTML ='<p><em>User named ' + data + ' already exists!!, try something else</em></p>';
    });
socket.on('userSet', function(data) {
    console.log('user created');
    user = data;
    document.getElementById('heading').innerHTML = 'ChatBot: ' + user + ' is now online!!';
    document.getElementById('go-chat').innerHTML ='<div id="chat-window"><div id="output"></div><div id="feedback2"></div></div>\
	<form  id="sendmsg"><input type="text" id="message" placeholder="Your Message">\
	<button type="submit">Send</button></form>';
	console.log('Html edited');
	console.log('sendmsg created');
    console.log('message created');
	
	//Update Query DOM
	output = document.getElementById('output');
	sendmsg = document.getElementById('sendmsg');
	message = document.getElementById('message');
	feedback2 = document.getElementById('feedback2');
	chatwindow = document.getElementById('chat-window');
	
	message.focus();

	//New Events
    sendmsg.onsubmit = function(e){
		// Prevent form submission to refresh the page
		e.preventDefault();

		if(message.value != "")
		{
			socket.emit('chat', {
				name:user,
				message:message.value
			});
			console.log('message sent');
		}
		else
		{
			feedback2.innerHTML = '<p><em>your message says nothing!!</em></p>';
			//to always stay on latest content
			chatwindow.scrollTop = chatwindow.scrollHeight;
		}
		message.value = "";
	};

	//using event 'input' for best precision
	message.addEventListener('input', function(){
		socket.emit('typing', user);
	});

	//to delete user from array
	window.addEventListener('beforeunload', function(){
		socket.emit('userOut',user);
	});
	
});
socket.on('chat', function(data){
	feedback2.innerHTML = "";
	output.innerHTML += '<p><strong>' + data.name + ': </strong>' + data.message + '</p>';
	chatwindow.scrollTop = chatwindow.scrollHeight; 
});
socket.on('typing', function(data){
	feedback2.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
	chatwindow.scrollTop = chatwindow.scrollHeight;
});