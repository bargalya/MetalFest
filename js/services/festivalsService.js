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
            getFestivalsDataAllBands: getFestivalsDataAllBands,
            getFestivalDataSingleBand: getFestivalDataSingleBand,
            filterNonActiveBands: filterNonActiveBands,
            isBandActive: isBandActive,
            removeFestivalByBandName: removeFestivalByBandName
        };

        return api;

        ///////////////////////////////////////////////////

        ///Public Methods ///
        function getFestivalsDataAllBands(bandsToGet) {
            var promiseArray = [];

            for (var i in bandsToGet) {
                promiseArray.push(getFestivalDataSingleBand(bandsToGet[i]));
            }

            //wait for all the promises to finish, and returns an array of all the data
            return $q.all(promiseArray);
        }

        function getFestivalDataSingleBand(band) {
            band = formatBandNameToAPI(band);
            return getBandFestivalDataByAPI(band, $q.defer());
        }

        function filterNonActiveBands(bandsData) {
            return _.remove(bandsData, isBandActive);
        }

        function isBandActive(bandData) {
            return UtilsService.isDefined(bandData.festivalsData);
        }

        function removeFestivalByBandName(festivalsArr, bandName) {
            return _.remove(festivalsArr, function(bandData) {
                return bandData.bandName !== bandName;
            });
        }

        ///Private Methods ///
        function formatBandNameToAPI(name) {
            return name.replace(/\s/g, '+');
        }

        function formatBandNameToView(name) {
            return name.replace(/\+/g, ' ');
        }

        function getBandFestivalDataByAPI(bandName, deferredObject) {
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