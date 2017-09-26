(function (app) {
    'use strict';

    var controllerName = 'MainController';
    var controllerDependencies = ['$scope', 'UserDataService', 'LogicService', 'FestivalsDataService', mainController];

    app.controller(controllerName, controllerDependencies);

    ////////////////////////////////////////////////////////

    function mainController($scope, UserDataService, LogicService, FestivalsDataService) {
        // private variables
        var vm = this;

        // public variables
        vm.fullName;
        vm.bands;
        vm.festivals;
        vm.fetivalCount;

        // public methods
        vm.getFullName = getFullName;
        vm.addBand = addBand;
        vm.removeBand = removeBand;

        // startup actions
        init();

        return;

        ///////////////////////////////////////////////////

        function init() {
            UserDataService.getUserData().then(
                function (data) {
                    vm.fullName = data.name;
                },
                function (error) {
                    console.error(error);
                });

            UserDataService.getUserLikedBands().then(
                function (data) {
                    vm.bands = data;
                },
                function (error) {
                    console.error(error);
                });

            getFestivalData();
        }

        function getFullName() {
            return vm.fullName;
        }

        function addBand() {
            vm.bands.push({
                name: vm.addedBands
            });

            vm.addedBands = undefined;
        }

        function removeBand(index) {
            vm.bands.splice(index, 1);
        }

        function getFestivalData() {
            FestivalsDataService.getFestivalsData().then(
                function (data) {
                    console.log('Both promises have resolved', data);
                    vm.festivals = data;
                    vm.festivalsCount = LogicService.bestFestivalLogic(data);
                    console.log(vm.festivalsCount);

                },
                function (error) {
                    console.error(error);
                });
        }
    }
})(app);