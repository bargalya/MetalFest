(function (app) {
    'use strict';

    var serviceName = 'FestivalsService';
    var serviceDependencies = ['$http', '$q', 'Config', 'UtilsService', festivalsService];

    app.service(serviceName, serviceDependencies);

    ////////////////////////////////////////////////////////

    function festivalsService($http, $q, Config, UtilsService) {
        // private variables
        var data;

        // service API
        var api = {
            getFestivalsData: getFestivalsData,
            filterNonActiveBands: filterNonActiveBands
        };

        return api;

        ///////////////////////////////////////////////////

        function getFestivalsData(bandsToGet) {
            var promiseArray = [];

            for (var i in bandsToGet) {
                var band = formatBandNameToAPI(bandsToGet[i]);
                promiseArray.push(getBandFestivalData(band, $q.defer()));
            }

            //wait for all the promises to finish, and returns an array of all the datas
            return $q.all(promiseArray);
        }

        function formatBandNameToAPI(name) {
            return name.replace(/\s/g, '+');
        }

        function formatBandNameToView(name) {
            return name.replace(/\+/g, ' ');
        }

        function filterNonActiveBands(bandsData) {
            return _.remove(bandsData, function (bandData) {
                return UtilsService.isDefined(bandData.festivalsData);
            });
        }

        function getBandFestivalData(bandName, deferredObject) {
            var url = getSongKickFestivalUrl(bandName);

            getData(url, onSuccess).then(
                // on success
                function (data) {
                    var festivalsData = {
                        bandName: formatBandNameToView(bandName),
                        festivalsData: data
                    };

                    deferredObject.resolve(festivalsData);
                });

            return deferredObject.promise;
        }

        function getSongKickFestivalUrl(bandName) {
            var url = Config.songKickAPIGetFestivals + Config.songKickAPIKey +
                '&artist_name=' + bandName + '&type=festival';
            return url;
        }

        function onSuccess(data) {
            return data.resultsPage.results.event;
        }

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