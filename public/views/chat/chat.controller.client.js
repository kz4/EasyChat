var sock = null;
if (window.location.hostname === 'localhost') {
    sock = new SockJS('http://127.0.0.1:3000/views/chat/chat.view.client');
} else {
    sock = new SockJS('http://easychat-kz4.rhcloud.com:8000/views/chat/chat.view.client');
}

(function () {
    angular
        .module("EasyChat")
        .controller("ChatController", ChatController);

    function ChatController($scope) {
        var vm = this;
        vm.messages = [];
        console.log("At client messages initialization");

        vm.sendMessage = function() {
            sock.send(vm.messageText);
            vm.messageText = "";
        };

        sock.onmessage = function(e) {
            vm.messages.push(e.data);
            $scope.$apply();
        };
    }
})();