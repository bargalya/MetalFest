(function (app) {
    'use strict';

    var serviceName = 'LogicService';
    var serviceDependencies = ['UtilsService', logicService];

    app.service(serviceName, serviceDependencies);

    ////////////////////////////////////////////////////////

    function logicService(UtilsService) {
        // private variables
        var data;

        // service API
        var api = {
            bestFestivalLogic: bestFestivalLogic
        };

        return api;

        ///////////////////////////////////////////////////

        function bestFestivalLogic(bandsFestivalsData) {

            var festivalCount = {};

            for (var i in bandsFestivalsData) {
                var bandData = bandsFestivalsData[i];

                for (var key in bandData.festivalsData) {
                    var festivalName = bandData.festivalsData[key].series.displayName;

                    if (UtilsService.isNumber(festivalCount[festivalName])) {
                        festivalCount[festivalName] += 1
                    } else {
                        festivalCount[festivalName] = 1
                    }
                }
            }

            return festivalCount;
        }

    }
})(app);