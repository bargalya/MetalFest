(function (app) {
    'use strict';

    var controllerName = 'MainController';
    var controllerDependencies = ['$scope', 'Config',
        'UserDataService', 'LogicService', 'FacebookService', 'FestivalsDataService', mainController
    ];

    app.controller(controllerName, controllerDependencies);

    ////////////////////////////////////////////////////////

    function mainController($scope, Config, UserDataService, LogicService, FacebookService, FestivalsDataService) {
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

            $scope.$on(Config.Events.handleLoginData, function (event, data) {
                if (!vm.isLoggedIn) {
                    $scope.$apply(function () {
                        vm.userInfo = data;
                        vm.isLoggedIn = true;
                        console.log(data);
                        getFestivalData(vm.userInfo.id);
                    });
                }
            });

            $scope.$on(Config.Events.handleLogout, function (event, data) {
                $scope.$apply(function () {
                    vm.bands = data.bands;
                    vm.userInfo = data.userInfo;
                    vm.currentPage = 0;
                    vm.isLoggedIn = false;
                    vm.dataLoaded = false; 
                    console.log(vm.bands);
                });

            });
        }

        function addBand() {
            vm.bands.push({
                name: vm.addedBands
            });

            vm.addedBands = undefined;
        }

        function removeBand(index) {
            index = index + (vm.currentPage * vm.pageSize);
            console.log("index to remove:"+ index);
            vm.bands.splice(index, 1);
        }

        function getFestivalData(userId) {
            FacebookService.getLikedBands(userId).then(
                function (data) {
                    vm.bands = data;
                    vm.dataLoaded = true;
                    console.log(vm.bands);
                }
            )

            FestivalsDataService.getFestivalsData().then(
                function (data) {
                    vm.festivals = data;
                    vm.festivalsCount = LogicService.bestFestivalLogic(data);
                    console.log(vm.festivalsCount);

                },
                function (error) {
                    console.error(error);
                });
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