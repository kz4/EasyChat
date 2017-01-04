var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var passport = require('passport');

app.set('port', 9999);
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

var http = require('http');
var sockjs = require('sockjs');

var connections = [];

var chat = sockjs.createServer();
chat.on('connection', function(conn) {
    connections.push(conn);
    var number = connections.length;
    conn.write("Welcome, User " + number);
    conn.on('data', function(message) {

        // TODO: database insert/update/select

        for (var ii=0; ii < connections.length; ii++) {
            connections[ii].write("User " + number + " says: " + message);
        }
    });
    conn.on('close', function() {
        for (var ii=0; ii < connections.length; ii++) {
            connections[ii].write("User " + number + " has disconnected");
        }
    });
});

// var server = http.createServer();
// chat.installHandlers(server, {prefix:'/chat'});
// server.listen(9999, ipaddress);
var server = http.createServer(app).listen(app.get('port'), ipaddress, function(){
    console.log('Http server listening on port ' + app.get('port') + ', ip: ' + ipaddress);
});
chat.installHandlers(server, {prefix:'/chat'});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({ secret: "thesecret" }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.get("/api/openshiftip", function(req, res) {
    res.json({result: ipaddress});
});

// app.listen(port, ipaddress);
app.listen(port, ipaddress, function () {
    console.log( "Express server listening on " + ipaddress + ", port " + port )
});