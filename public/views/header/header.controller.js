(function () {
    angular
        .module("EasyChat")
        .controller("HeaderController", HeaderController);

    function HeaderController() {
        var vm = this;

        vm.logout = function () {
            console.log('logout');
        };
    }

})();