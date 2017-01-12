(function () {
    angular
        .module("EasyChat")
        .config(Config);
    
    function Config($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/chat", {
                templateUrl: "views/chat/chat.view.client.html",
                controller: "ChatController",
                controllerAs: "model",
                resolve: {
                    loggedIn: checkLoggedIn
                }
            })
    }

    function checkLoggedIn(UserService, $location, $q, $rootScope) {

        // First create a deferred object that defers the promise
        var deferred = $q.defer();

        UserService
            .loggedIn()
            .then(
                function (res) {
                    var user = res.data;
                    if (user == '0') {
                        $rootScope.currentUser = null;
                        deferred.reject();
                        $location.url("/login");
                    } else {
                        $rootScope.currentUser = user;
                        deferred.resolve();
                    }
                },
                function (err) {
                    $location.url("/login");
                });

        return deferred.promise;
    }
    
})();