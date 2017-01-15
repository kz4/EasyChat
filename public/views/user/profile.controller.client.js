(function () {
    angular
        .module("EasyChat")
        .controller("ProfileController", ProfileController);
    function ProfileController($location, $rootScope, $routeParams, UserService) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;

        var id = $rootScope.currentUser._id;

        function init() {
            UserService
                .findUserById(id)   // promise
                .then(function (res) {
                    vm.user = res.data;
                });
        }
        init();

        function logout() {
            $rootScope.currentUser = null;
            UserService
                .logout()
                .then(
                    function (res) {
                        $location.url("/login");
                    },
                    function () {
                        $location.url("/login");
                    }
                );
        }

        function updateUser(user) {
            UserService
                .updateUser(id, user)
                .then(
                    function (inf) {
                        vm.inf = "Profile updated";
                    },
                    function (error) {
                        vm.error = "Profile failed to be updated";
                    }
                );
        }

        function deleteUser(userId) {
            UserService
                .deleteUser(userId)
                .then(
                    function (res) {
                        $location.url("/");
                    },
                    function (res) {
                        var err = res.data;
                        vm.error = err;
                    }
                )
        }
    }
})();