(function () {
    angular
        .module("EasyChat")
        .controller("LoginController", LoginController);

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;
        vm.submitted = false;

        function login(username, password) {
            vm.submitted = true;
            UserService
                .login(username, password)  // promise
                .then(function (res) {
                        var user = res.data;
                        if (user && user._id) {
                            var id = user._id;
                            $location.url("/user/" + id);
                            vm.submitted = false;
                        } else {
                            vm.error = "User not found";
                        }
                    },
                    function (error) {
                        vm.error = "User not found";
                    });
        }

    }
})();