module.exports = function () {

    var mongoose = require('mongoose');
    var UserSchema = require("./user.schema.server")();
    var User = mongoose.model("ChatUser", UserSchema);

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser,
        populateWebsite: populateWebsite,
        spliceWebsite: spliceWebsite,
        findUserByFacebookId: findUserByFacebookId
    };
    return api;

    function findUserByFacebookId(id) {
        return User.findOne({"facebook.id": id});
    }

    function spliceWebsite(userId, websiteId) {
        return User.findOne({_id: userId},
            function(err, doc) {
                doc.websites.pull(websiteId);
                doc.save();
            });
    }

    function populateWebsite(userId, website) {
        return User.findOne({_id: userId},
            function(err, doc) {
                doc.websites.push(website);
                doc.save();
            });
    }

    function deleteUser(userId) {
        return User.remove({_id: userId});
    }

    function updateUser(userId, user) {
        return User.update({_id: userId}, {

            // delete user._id;     // add this line, for older version of mongodb that set the _id,
            // if you just want to do $set: user
            //    $set: user    // you can use this, but username can also be used

            // do it this way, so you can customize the field you want to update
            $set: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    }

    function createUser(user) {
        return User.create(user);
    }

    function findUserByUsername(username) {
        return User.findOne({username: username});
    }

    function findUserById(userId) {
        return User.findById(userId);
    }

    function findUserByCredentials(username, password) {
        return User.findOne({username: username, password: password});
    }
};