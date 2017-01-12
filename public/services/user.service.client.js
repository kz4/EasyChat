(function() {
    angular
        .module("EasyChat")
        .factory("UserService", UserService);
    function UserService($http) {

        var api = {
            createUser   : createUser,
            findUserById : findUserById,
            findUserByUsername : findUserByUsername,
            findUserByCredentials : findUserByCredentials,
            updateUser : updateUser,
            deleteUser : deleteUser,
            login: login,
            logout: logout,
            loggedIn: loggedIn,
            register: register
        };
        return api;

        function register(username, password, verifyPassword) {
            var url = "/api/register";
            if (username) {
                if (password === verifyPassword) {
                    var user = {
                        username: username,
                        password: password
                    };
                    return $http.post(url, user);
                }
            }
            return $http.post(url, null);
        }

        function loggedIn() {
            return $http.get("/api/loggedIn");
        }

        function logout() {
            return $http.post("/api/logout");
        }

        function login(username, password) {
            var user = {
                username: username,
                password: password
            };
            var url = "/api/login";
            return $http.post(url, user);
        }

        function createUser(username, password, verifyPassword) {
            if (username) {
                if (password === verifyPassword) {
                    var user = {
                        username : username,
                        password : password
                    };
                    return $http.post("/api/user", user);
                }
            }
            return $http.post("/api/user", null);
        }

        function findUserById(id) {
            var url = "/api/user/" + id;
            return $http.get(url);
        }

        function findUserByUsername(username) {
            var url = "/api/user?username=" + username;
            return $http.get(url);
        }

        function findUserByCredentials(username, password) {
            var url = "/api/user?username="+username+"&password="+password;
            return $http.get(url);
        }

        function updateUser(userId, user) {
            var url = "/api/user/" + userId;
            return $http.put(url, user);
        }

        function deleteUser(userId) {
            var url = "/api/user/" + userId;
            return $http.delete(url, userId);
        }
    }
})();


