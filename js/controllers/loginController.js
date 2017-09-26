(function (app) {
    'use strict';

    var controllerName = 'LoginController';
    var controllerDependencies = ['$scope', 'LoginService', logicController];

    app.controller(controllerName, controllerDependencies);

    ////////////////////////////////////////////////////////

    function logicController($scope, LoginService) {
        // private variables
        var vm = this;

        // public variables
        vm.fullName;

        //public methods
        vm.login = login;

        return;

        ///////////////////////////////////////////////////

        function login() {
            LoginService.doLogin(vm.userName, vm.password).then(
                function (data) {
                    vm.fullName = data.name;
                },
                function (error) {
                    console.error(error);
                });
            

            vm.userName = undefined;
            vm.password = undefined;
        }
    }
})(app);