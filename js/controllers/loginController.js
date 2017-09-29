(function (app) {
    'use strict';

    var controllerName = 'LoginController';
    var controllerDependencies = ['$scope', 'FbLoginService', logicController];

    app.controller(controllerName, controllerDependencies);

    ////////////////////////////////////////////////////////

    function logicController($scope, FbLoginService) {
        // private variables
        var vm = this;

        // public variables
        vm.fullName;

        //public methods
        vm.login = login;

        return;

        ///////////////////////////////////////////////////

        function login() {
            FbLoginService.watchLoginChange().then(
                function (data) {
                    console.log(data);
                },
                function (error) {
                    console.error(error);
                });
            

            vm.userName = undefined;
            vm.password = undefined;
        }
    }
})(app);