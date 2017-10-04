(function (app) {
    'use strict';

    app.constant('Config', {
        facebookAppId: '1129987543802195',
        songKickAPIKey: 'x1K8MznSJ64qniOf',
        songKickAPIGetFestivalsByArtistName: 'http://api.songkick.com/api/3.0/events.json?apikey=[YOUR_API_KEY]&artist_name=Radiohead&type=festival',
        userDataUrl: 'data/userData.json',
        bandsDataUrl: 'data/likedBandsData.json',
        festivalsUrl: 'data/festivalsData.json',
        meshuggahFestivalsDataUrl: 'data/meshuggahFestivalsData.json',
        swallowTheSunFestivalsDataUrl: 'data/swallowTheSunFestivalsData.json',
        enslavedFestivalsDataUrl: 'data/enslavedFestivalData.json',
        events: {
            LOGIN: 'handleLoginData',
            LOGOUT: 'handleLogutData',
        },
        patterns: {
            noHeb: /^[^א-ת]*$/
        },
        excludedWordsList: [
            'official', '(band)', 'radio', 'festival', 'production', 'deathfest', 'records', 'magazine',
            'wacken', 'open air', 'ov metal'
        ]
    });
})(app);