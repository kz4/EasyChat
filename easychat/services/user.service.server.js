// The passport local strategy allows implementing simple username and password based authentication.
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require("bcrypt-nodejs");

module.exports = function (app, models) {

    var userModel = models.userModel;

    app.post("/api/user", createUser);
    // app.get("/api/user", getUsers);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);
    app.post('/api/login', passport.authenticate('assignmentLogin'), login);
    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/#/chat',
            failureRedirect: '/assignment//#/login'
        }));

    app.post("/api/logout", logout);
    app.get("/api/loggedIn", loggedIn);
    app.post('/api/register', register);

    passport.use('assignmentLogin', new LocalStrategy(localStrategy));    // 'local' is optional because it's well-known, for others it has to match the passport authenticate
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    var facebookConfig = {
        clientID     : process.env.FACEBOOK_CLIENT_ID,
        clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL  : process.env.FACEBOOK_CALLBACK_URL
    };

    passport.use('facebook', new FacebookStrategy(facebookConfig, facebookLogin));

    function register(req, res) {
        var username = req.body.username;
        var password = req.body.password;

        if (username && password) {
            userModel
                .findUserByUsername(username)
                .then(
                    function (user) {
                        if (user) {
                            // res.status(400).json("Username already in use");
                            res.json("Username already exists");
                            return;
                        } else {
                            req.body.password = bcrypt.hashSync(req.body.password);
                            return userModel
                                .createUser(req.body)
                        }
                    },
                    function (err) {
                        res.status(400).send(err);
                    }
                )
                .then(
                    function (user) {
                        if (user) {
                            req.login(user, function (err) {
                                if (err) {
                                    res.send(err);
                                } else {
                                    res.json(user);
                                }
                            });
                        }
                    },
                    function (err) {
                        res.send(err);
                    }
                )
        } else {
            res.json("Username empty or password not matches");
        }
    }

    function loggedIn(req, res) {
        if (req.isAuthenticated()) {
            res.json(req.user);
        } else {
            res.send('0');
        }
    }

    function logout(req, res) {
        req.logout();
        res.send(200);
    }

    function localStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if(user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function facebookLogin(token, refreshToken, profile, done) {
        userModel
            .findUserByFacebookId(profile.id)
            .then(
                function (facebookUser) {
                    if (facebookUser) {
                        return done(null, facebookUser);
                    } else {
                        facebookUser = {
                            username: profile.displayName.replace(/ /g, ''),
                            facebook: {
                                token: token,
                                id: profile.id,
                                displayname: profile.displayName
                            }
                        };
                        userModel
                            .createUser(facebookUser)
                            .then(
                                function (user) {
                                    done(null, user);
                                },
                                function (error) {

                                }
                            )
                    }
                }
            )
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function deleteUser(req, res) {
        var id = req.params.userId;
        userModel
            .deleteUser(id)
            .then(
                function () {
                    res.send(200);
                }, function () {
                    res.status(400).send("Error deleting a user");
                }
            )
    }

    function updateUser(req, res) {
        var id = req.params.userId;
        var newUser = req.body;
        userModel
            .updateUser(id, newUser)
            .then(
                function () {
                    res.sendStatus(200);
                },
                function (error) {
                    // res.statusCode(404).send(error);
                    res.send(error);
                }
            );
    }

    function createUser(req, res) {
        var user = req.body;
        if (user.username) {
            userModel
            // check if username exists
                .findUserByUsername(user.username)
                .then(function (userExists) {
                    // if user cannot be found
                    if (!userExists) {
                        return userModel
                            .createUser(user)
                            .then(
                                function (user) {
                                    res.json(user);
                                },
                                function (error) {
                                    // res.statusCode(404).send(error);
                                    res.send(error);
                                }
                            )
                    } else {
                        // Username already exists
                        // res.status(400).send("Username already exists");
                        res.send("Username already exists");
                    }
                });
        }
    }

    function getUsers(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];

        if (username && password) {
            findUserByCredentials(username, password, req, res);
        } else if (username) {
            findUserByUsername(username, res);
        } else {
            res.send(users);
        }
    }

    function findUserById(req, res) {
        var id = req.params.userId;
        userModel
            .findUserById(id)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    // res.statusCode(404).send(error);
                    res.send(error);
                }
            );
    }

    function findUserByUsername(username, res) {
        userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    res.json(user);
                },
                function (error) {
                    // res.statusCode(404).send(error);
                    res.send(error);
                }
            );
    }
};