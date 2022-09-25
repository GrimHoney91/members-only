var userArgs = process.argv.slice(2);

var async = require('async');
var User = require('./models/user');
var Message = require('./models/message');


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = [];
var messages = [];

function userCreate(username, password, status, cb) {
    const user = new User({
        username,
        password,
        status
    });

    user.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New User: ' + user);
        users.push(user);
        cb(null, user);
    });
}

function messageCreate(user, title, timeStamp, text, cb) {
    const message = new Message({
        user,
        title,
        timeStamp,
        text
    });

    message.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Message: ' + message);
        messages.push(message);
        cb(null, message);
    });
}



function createUsers(cb) {
    async.series([
        function(callback) {
            userCreate('Leonardo2112', 'MasterSplinter2112', 'admin', callback);
        },
        function(callback) {
            userCreate('Donatello2112', 'MasterUguay2112', 'member', callback);
        },
        function(callback) {
            userCreate('Rafael2112', 'Stacy2112', 'regular', callback);
        }
        ],
        cb);
}

function createMessages(cb) {
    async.parallel([
        function(callback) {
            messageCreate(users[0], 'I am an admin!', Date.now(), 'I love being and amin for this forum.', callback);
        },
        function(callback) {
            messageCreate(users[1], 'I am a member!', Date.now(), 'I love being a member for this forum.', callback);
        },
        function(callback) {
            messageCreate(users[2], 'I am a regular!', Date.now(), 'I love being a regular for this forum.', callback);
        }
    ], cb);
}


async.series([
    createUsers,
    createMessages
],
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('MESSAGES: '+messages);
        
    }
    mongoose.connection.close();
});


