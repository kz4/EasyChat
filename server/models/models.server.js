module.exports = function () {

    var models = {
        userModel: require("./user/user.model.server")(),
    };
    return models;
};