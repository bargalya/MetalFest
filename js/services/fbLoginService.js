(function (app) {
    'use strict';

    var serviceName = 'FbLoginService';
    var serviceDependencies = ['$http', 'Config', fbLoginService];

    app.service(serviceName, serviceDependencies);

    ////////////////////////////////////////////////////////

    function fbLoginService($http, Config) {
        // private variables
        var data;

        // service API
        var api = {
            watchLoginChange: watchLoginChange,
            getUserInfo: getUserInfo,
            logout: logout
        };

        return api;

        ///////////////////////////////////////////////////

        function watchLoginChange() {

            var _self = this;

            FB.Event.subscribe('auth.authResponseChange', function (res) {

                if (res.status === 'connected') {

                    /*
                     The user is already logged,
                     is possible retrieve his personal info
                    */
                    _self.getUserInfo();

                    /*
                     This is also the point where you should create a
                     session for the current user.
                     For this purpose you can use the data inside the
                     res.authResponse object.
                    */

                } else {

                    /*
                     The user is not logged to the app, or into Facebook:
                     destroy the session on the server.
                    */

                }

            });

        }

        function getUserInfo() {

            var _self = this;

            FB.api('/me', function (res) {
                $rootScope.$apply(function () {
                    $rootScope.user = _self.user = res;
                });
            });

        }

        function logout() {

            var _self = this;

            FB.logout(function (response) {
                $rootScope.$apply(function () {
                    $rootScope.user = _self.user = {};
                });
            });

        }
    }
})(app);