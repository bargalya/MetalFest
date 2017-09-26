(function (app) {
    'use strict';

    var serviceName = 'FestivalsDataService';
    var serviceDependencies = ['$http', '$q', 'Config', 'DataService', festivalsDataService];

    app.service(serviceName, serviceDependencies);

    ////////////////////////////////////////////////////////

    function festivalsDataService($http, $q, Config, DataService) {
        // private variables
        var data;

        // service API
        var api = {
            getFestivalsData: getFestivalsData
        };

        return api;

        ///////////////////////////////////////////////////

        function getFestivalsData() {
            var bandsToGet = ['Swallow The Sun', 'Meshuggah', 'Enslaved'];
            var promiseArray = [];

            for (var i in bandsToGet) {
                promiseArray.push(getBandFestivalData(bandsToGet[i], $q.defer()));
            }

            //wait for all the promises to finish, and returns an array of all the datas
            return $q.all(promiseArray);
        }

        function onSuccess(data) {
            return data.resultsPage.results.event;
        }

        function getBandFestivalData(bandName, deferredObject) {
            var url;
            switch (bandName) {
                case 'Swallow The Sun':
                    url = Config.swallowTheSunFestivalsDataUrl;
                    break;

                case 'Meshuggah':
                    url = Config.meshuggahFestivalsDataUrl;
                    break;
                case 'Enslaved':
                    url = Config.enslavedFestivalsDataUrl;
                    break;
            }

            DataService.getData(url, onSuccess).then(
                // on success
                function (data) {
                    var festivalsData = {
                        bandName: bandName,
                        festivalsData: data
                    };
                    deferredObject.resolve(festivalsData);
                });

            return deferredObject.promise;
        }


    }
})(app);