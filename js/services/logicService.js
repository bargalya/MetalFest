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
            var result = [];

            for (var i = 0; i < bandsFestivalsData.length; i++) {
                var bandData = bandsFestivalsData[i];

                for (var j = 0; j < bandData.festivalsData.length; j++) {
                    var festivalName = bandData.festivalsData[j].series.displayName;

                    if (UtilsService.isDefined(festivalCount[festivalName])) {
                        festivalCount[festivalName].push(bandData.bandName);
                    } else {
                        festivalCount[festivalName] = [bandData.bandName];
                    }
                }
            }

            for (var key in festivalCount) {
                result.push({
                    festivalName: key,
                    bandsArray: festivalCount[key],
                    bandsCount: festivalCount[key].length
                });
            }

            return _.sortBy(result, ['bandsCount']).reverse();
        }
    }
})(app);