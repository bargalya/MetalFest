(function (app) {
    'use strict';

    var serviceName = 'FbLoginService';
    var serviceDependencies = ['$http', '$rootScope', '$q', 'Config', 'UtilsService', fbLoginService];

    app.service(serviceName, serviceDependencies);

    ////////////////////////////////////////////////////////

    function fbLoginService($http, $rootScope, $q, Config, UtilsService) {
        // private variables
        var data = [];
        var userInfo;
        var deferred;
        
        // service API
        var api = {
            handleAppLogin: handleAppLogin,
            getDataFromFacebook: getDataFromFacebook
        };

        return api;

        ///////////////////////////////////////////////////

        function handleAppLogin() {
            FB.api('/me', function (response) {
                userInfo = response;

                getDataFromFacebook('/' + userInfo.id + '/music').then(handleDataFromLogin);
            });
        }

        function handleDataFromLogin(response) {
            $rootScope.$broadcast('handleLoginData', response);
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

        function logout() {
            FB.logout(function (response) {
                userData = undefined;
                data = [];
                deferred = undefined;
            });
        }
    }
})(app);