(function (app) {
    'use strict';

    var serviceName = 'DataService';
    var serviceDependencies = ['$http', '$q', 'UtilsService', dataService];

    app.service(serviceName, serviceDependencies);

    ////////////////////////////////////////////////////////

    function dataService($http, $q, UtilsService) {
        // private variables
        var data;

        // service API
        var api = {
            getData: getData
        };

        return api;

        ///////////////////////////////////////////////////

        /**
         * Getting data asynchronously from url, and handling result.
         * 
         * @param {string} url 
         * @param {function} successHandler 
         * @param {function} errorHandler 
         * @return {promise} 
         */
        function getData(url, successHandler, errorHandler) {
            var deferred = $q.defer();

            // sending get request to given url parameter
            $http.get(url).then(

                // on success
                function (response) {
                    var processedData = response.data;

                    if (UtilsService.isDefined(successHandler) && 
                        UtilsService.is(successHandler, 'function')) {
                        processedData = successHandler(response.data);
                    }

                    deferred.resolve(processedData);
                },

                // on failure
                function (error) {
                    var errorResult = error;

                    if (UtilsService.isDefined(errorHandler) && 
                        UtilsService.is(errorHandler, 'function')) {
                        error = errorHandler(error);
                    }

                    deferred.reject(error);
                }
            );

            return deferred.promise;
        }
    }
})(app);