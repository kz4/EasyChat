(function () {
    angular
        .module("EasyChat")
        .config(Config);
    
    function Config($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/chat/chat.view.client.html",
                controller: "ChatController",
                controllerAs: "model"
            })
    }
})();