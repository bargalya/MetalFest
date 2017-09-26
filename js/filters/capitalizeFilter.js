(function (app) {
    'use strict';

    var filterName = 'CapitalizeFilter';
    var filterDependencies = ['UtilsService', capitalizeFilter];

    app.filter(filterName, filterDependencies);

    ////////////////////////////////////////////////////////

    function capitalizeFilter(UtilsService) {
        return function (text) {
            var words = text.split(' ');
            var result = '';

            for (var i = 0; i < words.length; i++) {
                result += capitalizeWord(words[i]);

                if (i < words.length - 1) {
                    result += ' ';
                }
            }

            return result;
        }

        function capitalizeWord(word) {
            return (UtilsService.isStringNullOrEmpty(word) ?
                word.charAt(0).toUpperCase() + word.substr(1).toLowerCase() : '');
        }
    }
})(app);