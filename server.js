var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var passport = require('passport');

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;
app.set('port', port);

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



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({ secret: "thesecret" }));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

var mongoose = require('mongoose');
var connectionString = 'mongodb://127.0.0.1:27017/easychat';

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

mongoose.connect(connectionString);

var easychat = require("./easychat/app.js")(app);


var server = http.createServer(app).listen(app.get('port'), ipaddress, function(){
    console.log('Http server listening on port ' + app.get('port') + ', ip: ' + ipaddress);
});
chat.installHandlers(server, {prefix:'/views/chat/chat.view.client'});
//
// app.get("/api/openshiftip", function(req, res) {
//     res.json({result: ipaddress});
// });
//
// // app.listen(port, ipaddress);
// app.listen(port, ipaddress, function () {
//     console.log( "Express server listening on " + ipaddress + ", port " + port )
// });