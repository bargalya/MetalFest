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
        vm.musicData;

        //public methods

        init();

        return;

        ///////////////////////////////////////////////////

        function init() {
            $scope.$on('handleLoginData', function (event, data) {
                vm.musicData = data;
                console.log(vm.musicData);
            });
        }
    }
})(app);