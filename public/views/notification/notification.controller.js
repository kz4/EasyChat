(function () {
    angular
        .module("EasyChat")
        .controller("NotificationController", NotificationController);

    function NotificationController() {
        var vm = this;

        console.log('NotificationController');
    }

})();