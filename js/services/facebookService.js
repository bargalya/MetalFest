(function (app) {
    'use strict';

    var serviceName = 'FacebookService';
    var serviceDependencies = ['$rootScope', '$q', 'Config', 'UtilsService', facebookService];

    app.service(serviceName, serviceDependencies);

    ////////////////////////////////////////////////////////

    function facebookService($rootScope, $q, Config, UtilsService) {
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
                $rootScope.$broadcast(Config.events.LOGIN, userInfo);
            });
        }

        function handleAppLogut() {
            userInfo = undefined;
            data = [];
            deferred = undefined;

            $rootScope.$broadcast(Config.events.LOGOUT);
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
            } 
            else {
                FB.api(response.paging.next, getNextPageData);
            }
        }
    }
})(app);