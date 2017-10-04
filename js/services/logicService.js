(function (app) {
    'use strict';

    var serviceName = 'LogicService';
    var serviceDependencies = ['Config', 'UtilsService', logicService];

    app.service(serviceName, serviceDependencies);

    ////////////////////////////////////////////////////////

    function logicService(Config, UtilsService) {
        // private variables
        var data;

        // service API
        var api = {
            bestFestivalLogic: bestFestivalLogic,
            getFilteredBandsData: getFilteredBandsData
        };

        return api;

        ///////////////////////////////////////////////////

        function getFilteredBandsData(bands) {
            var results = [];
            
            for (var i = 0; i < bands.length; i++) {
                var currentBand = bands[i].name.toLowerCase();

                if (Config.patterns.noHeb.test(currentBand) && isValidBandName(currentBand)) {
                    results.push(currentBand);
                }
            }

            return _.uniq(results);
        }

        function isValidBandName(name) {

            for (var i = 0; i < Config.excludedWordsList.length; i++) {
                if (name.indexOf(Config.excludedWordsList[i]) !== -1) {
                    return false;
                }
            }

            return true;
        }

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