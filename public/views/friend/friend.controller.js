(function () {
    angular
        .module("EasyChat")
        .controller("FriendController", FriendController);

    function FriendController() {
        var vm = this;

        console.log('FriendController');

    }

})();