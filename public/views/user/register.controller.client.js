(function () {
    angular
        .module("EasyChat")
        .controller("RegisterController", RegisterController);
    function RegisterController($location, $rootScope, UserService) {
        var vm = this;
        vm.register = register;
        vm.submitted = false;
        vm.badPassword = false;

        function register(username, password, verifyPassword) {
            vm.submitted = true;
            if (password === verifyPassword) {
                UserService
                    .register(username, password, verifyPassword)
                    .then(function (res) {
                        var user = res.data;
                        if (user._id) {
                            var id = user._id;
                            $rootScope.currentUser = user;
                            $location.url("/user/" + id);
                            vm.submitted = false;
                            vm.badPassword = false;
                        } else {
                            vm.error = user;
                        }
                    });
            } else {
                vm.error = "Password do not match";
                vm.badPassword = true;
            }
        }
    }
})();