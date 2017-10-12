(function (app) {
    'use strict';

    var serviceName = 'UtilsService';
    var serviceDependencies = [utilsService];

    app.service(serviceName, serviceDependencies);

    ////////////////////////////////////////////////////////

    function utilsService() {
        // service API
        var api = {
            isDefined: isDefined,
            is: is,
            isStringNullOrEmpty: isStringNullOrEmpty,
            isNumber: isNumber,
            isArray: isArray
        };

        return api;

        ///////////////////////////////////////////////////

        function isDefined(arg) {
            return ((typeof arg !== 'undefined') && (arg !== null) && (arg !== ''));          
        }

        function is(arg, type) {
            if (typeof type === 'string') {
                return (typeof arg === type);
            }

            return false;
        }

        function isStringNullOrEmpty(arg) {
            return (isDefined(arg) && is(arg, 'string'));
        }

        function isNumber(arg) {
            return (isDefined(arg) && is(arg, 'number'));
        }

        function isArray(arg) {
            return (isDefined(arg) && isNumber(arg.length));
        }
    }
})(app);