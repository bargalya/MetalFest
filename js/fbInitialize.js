(function (app) {
    'use strict';

    var fbDependencies = ['$rootScope', '$window', 'Config', 'FacebookService', fbInit];

    app.run(fbDependencies);

    ///////////////////// Facebook /////////////////////

    function fbInit($rootScope, $window, Config, FacebookService) {
        $window.fbAsyncInit = function () {
            // Executed when the SDK is loaded
            FB.init({

                /*
                 The app id of the web app;
                */
                appId: Config.facebookAppId,

                /*
                 Adding a Channel File improves the performance
                 of the javascript SDK, by addressing issues
                 with cross-domain communication in certain browsers.
                */
                channelUrl: '../channel.html',

                /*
                 Set if you want to check the authentication status
                 at the start up of the app
                */
                status: true,

                /*
                 Enable cookies to allow the server to access
                 the session
                */
                cookie: true,

                /* Parse XFBML */
                xfbml: true
            });

            FB.Event.subscribe('auth.authResponseChange', function (res) {
                if (res.status === 'connected') {
                    FacebookService.handleAppLogin();
                }
                else{
                    FacebookService.handleAppLogut();
                }
            });
        };

        (function (d) {
            // load the Facebook javascript SDK
            var js,
                id = 'facebook-jssdk',
                ref = d.getElementsByTagName('script')[0];

            if (d.getElementById(id)) {
                return;
            }

            js = d.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";

            ref.parentNode.insertBefore(js, ref);
        }(document));
    }
})(app);