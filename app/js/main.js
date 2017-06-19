'use strict';

(function(global, doc) {

    const initBtn = doc.querySelector('.appBar button.init');
    const createLiveBtn = doc.querySelector('.appBar button.live');
    const reloadBtn = doc.querySelector('.appBar button.reload');
    const inputInit = doc.querySelector('.appId');
    const fbLoginBtn = doc.querySelector('.fb-login-button');
    const inputStremUrl = doc.querySelector('.field.streamingUrl');
    const inputStreamName = doc.querySelector('.field.streamName');

    let fbConfig = {
        appId: inputInit.value,
        xfbml: true,
        version: 'v2.9'
    };

    let pathVideoLiveUrl = '/live_videos';

    function _statusChangeCallback(response) {
        console.log('_statusChangeCallback');

        if (response.status === 'connected') {
            fbLoginBtn.style.display = 'none';
            pathVideoLiveUrl = response.authResponse.userID + pathVideoLiveUrl;
            console.log('connected');
        } else {
            console.log('user ', response.status);
        }
    }

    function startLiveVideo(pathUserId) {
        return new Promise(function (resolve, reject) {
            return FB.api(pathUserId, 'POST', function (response) {
                console.log('response from FB.api');

                if (response.error) {
                    return reject(response.error);
                } else {
                    console.log('stream_url: ', response.secure_stream_url);
                    return resolve(response.secure_stream_url);
                }
            });
        });
    }

    function _loginAsync () {
        return new Promise(function (resolve) {
            return FB.login(function (response) {
                console.log('response: ', response);
                return resolve(response);
            }, {
                scope: 'publish_actions',
                return_scopes: true
            });
        });
    }

    function initFbSdk(config) {
        global.fbAsyncInit = function () {
            FB.init(config);

            // FB.login(function (response) {
            //     _loginScope(response);
            // }, {
            //     scope: 'publish_actions',
            //     return_scopes: true
            // });

            _loginAsync()
                .then(function (resp) {
                    _statusChangeCallback(resp);
                });
        };

        // Load the SDK Async
        (function (d, s, id) {
            var js, fjs = doc.getElementsByTagName(s)[0];
            if (doc.getElementById(id)) {return;}
            js = doc.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(doc, 'script', 'facebook-jssdk'));
    }

    createLiveBtn.addEventListener('click', function (event) {
        console.log('trigger new appId: ', fbConfig.appId);
        console.log('videoLiveUrl: ', pathVideoLiveUrl);

        startLiveVideo(pathVideoLiveUrl)
            .then(function (resp) {
                console.log(resp);
                inputStremUrl.value = resp;
                inputStreamName.value = resp.split('/').pop();
                createLiveBtn.setAttribute('disabled', 'true');
            })
            .catch(function (err) {
                throw new Error(err);
            });
    }, true);

    reloadBtn.addEventListener('click', function (event) {
        location.reload();
    }, true);

    function changeAppId() {
        fbConfig.appId = inputInit.value;

        if (!inputInit.value.length) {
            throw new Error('error missing appId');
        }

        console.log('appId: ', fbConfig.appId);

        inputInit.setAttribute('disabled', 'true');
        initBtn.setAttribute('disabled', 'true');
        createLiveBtn.removeAttribute('disabled');

        // init api
        initFbSdk(fbConfig);
    }

    initBtn.addEventListener('click', function (event) {
        changeAppId();
    }, true);

    createLiveBtn.setAttribute('disabled', 'true');

}(window, document));

