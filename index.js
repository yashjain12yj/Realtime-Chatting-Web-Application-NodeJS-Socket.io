var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = [];
var connections = [];
var AllUsers = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	//console.log('new user connected');
	
	socket.on('new user',function(username){
		//console.log('new user : ' + username);
		users.push(username);
		AllUsers.push(socket);
		console.log('Current users = '+ users.length);
		//console.log(AllUsers);
		console.log(users);
		updateUserNames();
	});

	socket.on('chat message', function(msg){
    	io.emit('chat message', msg);
  	});

	socket.on('disconnect', function(){
		var index = AllUsers.indexOf(socket)
		users.splice(index, 1);
    	AllUsers.splice(index, 1);
    	//console.log('user disconnected');
    	console.log('Current users = '+ users.length);
    	console.log(users);
    	updateUserNames();
  	});
	
});

function updateUserNames(){
	io.sockets.emit('online users', users);
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});