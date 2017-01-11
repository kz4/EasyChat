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
                controllerAs: "model"
            })
    }
})();