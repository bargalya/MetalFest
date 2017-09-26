(function (app) {
    'use strict';

    var serviceName = 'UserDataService';
    var serviceDependencies = ['$http', 'Config', 'DataService', userDataService];

    app.service(serviceName, serviceDependencies);

    ////////////////////////////////////////////////////////

    function userDataService($http, Config, DataService) {
        // private variables
        var data;

        // service API
        var api = {
            getUserData: getUserData,
            getUserLikedBands: getUserLikedBands
        };

        return api;

        ///////////////////////////////////////////////////

        function getUserData() {
            return DataService.getData(Config.userDataUrl);
        }

        function getUserLikedBands() {
            return DataService.getData(Config.bandsDataUrl);
        }
    }
})(app);