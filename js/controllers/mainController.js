(function (app) {
    'use strict';

    var controllerName = 'MainController';
    var controllerDependencies = ['$scope', 'Config',
        'LogicService', 'FacebookService', 'FestivalsService', mainController
    ];

    app.controller(controllerName, controllerDependencies);

    ////////////////////////////////////////////////////////

    function mainController($scope, Config, LogicService, FacebookService, FestivalsService) {
        // private variables
        var vm = this;

        // public variables
        vm.isLoggedIn = false;
        vm.dataLoaded = false;
        vm.userInfo
        vm.bands = [];
        vm.festivals;
        vm.fetivalCount;
        vm.currentPage = 0;
        vm.pageSize = 10;

        // public methods
        vm.addBand = addBand;
        vm.removeBand = removeBand;
        vm.arrayToString = arrayToString;
        vm.numberOfPages = numberOfPages;
        vm.disableNextButton = disableNextButton;
        vm.disablePrevButton = disablePrevButton;
        vm.onNextClick = onNextClick;
        vm.onPrevClick = onPrevClick;

        // startup actions
        init();

        return;

        ///////////////////////////////////////////////////

        function init() {
            $scope.$on(Config.events.LOGIN, function (event, data) {
                if (!vm.isLoggedIn) {
                    $scope.$apply(function () {
                        vm.userInfo = data;
                        vm.isLoggedIn = true;

                        getLlikedBandsData(vm.userInfo.id);
                    });
                }
            });

            $scope.$on(Config.events.LOGOUT, function (event) {
                $scope.$apply(function () {
                    vm.bands = [];
                    vm.userInfo = undefined;
                    vm.currentPage = 0;
                    vm.isLoggedIn = false;
                    vm.dataLoaded = false;
                });
            });
        }

        function getLlikedBandsData(userId) {
            FacebookService.getLikedBands(userId).then(
                function (data) {
                    vm.bands = LogicService.getFilteredBandsData(data);
                    vm.dataLoaded = true;

                    getFestivalsData();
                }
            )
        }

        function getFestivalsData() {
            FestivalsService.getFestivalsDataAllBands(vm.bands).then(
                function (data) {
                    vm.festivals = FestivalsService.filterNonActiveBands(data);
                    vm.festivalsCount = LogicService.bestFestivalLogic(vm.festivals);
                },
                function (error) {
                    console.error(error);
                });
        }

        function addBand() {
            vm.bands.push(vm.addedBands);

            FestivalsService.getFestivalDataSingleBand(vm.addedBands).then(
                function (data) {
                    if(FestivalsService.isBandActive(data)) {
                        vm.festivals.push(data);
                        vm.festivalsCount = LogicService.bestFestivalLogic(vm.festivals);
                    }
                },
                function (error) {
                    console.error(error);
                });

            vm.addedBands = undefined;
        }

        function removeBand(index) {
            index += (vm.currentPage * vm.pageSize);
            vm.festivals = FestivalsService.removeFestivalByBandName(vm.festivals, vm.bands[index]);
            vm.festivalsCount = LogicService.bestFestivalLogic(vm.festivals);
            vm.bands.splice(index, 1);
        }   

        function arrayToString(arr) {
            return arr.join(", ");
        }

        ///// Pagintation for bands list
        function numberOfPages() {
            return Math.ceil(vm.bands.length / vm.pageSize);
        }

        function disableNextButton() {
            return vm.currentPage >= vm.bands.length / vm.pageSize - 1;
        }

        function disablePrevButton() {
            return vm.currentPage == 0;
        }

        function onNextClick() {
            vm.currentPage = vm.currentPage + 1;
        }

        function onPrevClick() {
            vm.currentPage = vm.currentPage - 1;
        }
    }
})(app);