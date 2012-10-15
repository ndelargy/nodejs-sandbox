//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , port = (process.env.PORT || 8081);

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/ducklings');

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));
    server.use(connect.static(__dirname + '/static'));
    server.use(server.router);
});

//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: { 
                  title : '404 - Not Found'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX' 
                },status: 404 });
    } else {
        res.render('500.jade', { locals: { 
                  title : 'The Server Encountered an Error'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX'
                 ,error: err 
                },status: 500 });
    }
});
server.listen( port);

//Setup Socket.IO
var io = io.listen(server);
io.sockets.on('connection', function(socket){
  console.log('Client Connected');
  socket.on('message', function(data){
    socket.broadcast.emit('server_message',data);
    socket.emit('server_message',data);
  });
  socket.on('disconnect', function(){
    console.log('Client Disconnected.');
  });
});
var Content =  require('./models/content');

console.log(db);

Content.find({key:"mission"},function(arr,data){
  console.log(data);
});

///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

server.get('/', function(req,res){
  res.render('index.jade', {

    locals : { 
              title : 'Node Test'
             ,description: ''
             ,author: 'Neil Delargy <neildelargy@gmail.com>'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

server.get('/content/:key/edit', function(req, res){
  //  var content = content.find
  res.render('content/edit.jade'), {
    locals : {
      title: "Edit Content"
      ,analyticssiteid: 'XXXXXXX' 
    }
  }
});

server.get('/insert/:key/edit', function(req, res){
  var aaron = new Content({"title" : "MISSION", "body" : "Centre ext though", "key" : "mission"});
  aaron.save( function(err){
    if(err){
      console.log(err);
    }
  });
  //  var content = content.find
  res.render("inserted");
});


//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://0.0.0.0:' + port );
