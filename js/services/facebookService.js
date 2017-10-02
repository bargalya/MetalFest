(function (app) {
    'use strict';

    var serviceName = 'FacebookService';
    var serviceDependencies = ['$http', '$rootScope', '$q', 'Config', 'UtilsService', facebookService];

    app.service(serviceName, serviceDependencies);

    ////////////////////////////////////////////////////////

    function facebookService($http, $rootScope, $q, Config, UtilsService) {
        // private variables
        var data = [];
        var userInfo;
        var deferred;

        // service API
        var api = {
            handleAppLogin: handleAppLogin,
            handleAppLogut: handleAppLogut,
            getLikedBands: getLikedBands
        };

        return api;

        ///////////////////////////////////////////////////

        function handleAppLogin() {
            FB.api('/me', function (response) {
                userInfo = response;
                handleDataFromLogin(userInfo);
            });
        }

        function handleAppLogut() {
            userInfo = undefined;
            data = [];
            deferred = undefined;

            handleDataFromLogout(data);
        }

        function getLikedBands(userId) {
            return getDataFromFacebook('/' + userId + '/music');
        }

        function getDataFromFacebook(request) {
            if (!UtilsService.isStringNullOrEmpty(request)) {
                console.debug("getPagedData: Request:" + request + "is not strings");
                return;
            }

            deferred = $q.defer();
            FB.api(request, getNextPageData);

            return deferred.promise;
        }

        function getNextPageData(response) {
            if (UtilsService.isDefined(response) && !response.error) {
                data.push.apply(data, response.data);
            }

            if (!UtilsService.isDefined(response.paging) || !UtilsService.isDefined(response.paging.next)) {
                deferred.resolve(data);
            } else {
                FB.api(response.paging.next, getNextPageData);
            }
        }


        /////Events////////
        function handleDataFromLogin(response) {
            $rootScope.$broadcast(Config.Events.handleLoginData, response);
        }

        function handleDataFromLogout(response) {
            var logoutedData = {
                userInfo : userInfo,
                bands : data
            }
            $rootScope.$broadcast(Config.Events.handleLogout, logoutedData);
        }


    }
})(app);