(function (app) {
    'use strict';

    var serviceName = 'LoginService';
    var serviceDependencies = ['$http', 'Config', 'DataService', loginService];

    app.service(serviceName, serviceDependencies);

    ////////////////////////////////////////////////////////

    function loginService($http, Config, DataService) {
        // private variables
        var data;

        // service API
        var api = {
            doLogin: doLogin
        };

        return api;

        ///////////////////////////////////////////////////

        function doLogin(userName, password) {
            return DataService.getData(Config.userDataUrl);
        }
    }
})(app);