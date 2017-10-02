(function (app) {
    'use strict';

    var filterName = 'StartFromFilter';
    var filterDependencies = [startFromFilter];

    app.filter(filterName, filterDependencies);

    ////////////////////////////////////////////////////////

    function startFromFilter() {
        return function(input, start) {
            return input.slice(start);
        }
    }
})(app);