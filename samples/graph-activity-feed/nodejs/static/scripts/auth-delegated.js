(function () {
    'use strict';

    // Get auth token
    // Ask Teams to get us a token from AAD
    function getClientSideToken() {
        microsoftTeams.initialize();
        return new Promise((resolve, reject) => {
            microsoftTeams.authentication.getAuthToken({
                successCallback: (result) => {
                    resolve(result);
                },
                failureCallback: function (error) {
                    reject("Error getting token: " + error);
                }
            });
        });
    }

    // Exchange that token for a token with the required permissions
    // using the web service (see /auth/token handler in app.js)
    function getServerSideToken(clientSideToken) {
        return new Promise((resolve, reject) => {
            microsoftTeams.getContext((context) => {
                fetch('/auth/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        tid: context.tid,
                        token: clientSideToken
                    }),
                })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        reject(response.error);
                    }
                })
                .then((responseJson) => {
                    if (responseJson.error) {
                        reject(responseJson.error);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }

    // Show the consent pop-up
    function requestConsent() {
        return new Promise((resolve, reject) => {
            microsoftTeams.authentication.authenticate({
                url: window.location.origin + "/auth-start",
                width: 600,
                height: 535,
                successCallback: (result) => {
                    let data = localStorage.getItem(result);
                    localStorage.removeItem(result);
                    resolve(data);
                },
                failureCallback: (reason) => {
                    reject(JSON.stringify(reason));
                }
            });
        });
    }

    // method invoked on sso authentication.
    getClientSideToken()
        .then((clientSideToken) => {
            return getServerSideToken(clientSideToken);
        })
        .catch((error) => {
            if (error === "invalid_grant") {
                console.log(`Error: ${error} - user or admin consent required`);
                // Display in-line button so user can consent
                requestConsent()
                    .then((result) => {
                        // Consent succeeded - use the token we got back
                        let accessToken = JSON.parse(result).accessToken;
                        console.log(`Received access token ${accessToken}`);
                    })
                    .catch((error) => {
                        console.log(`ERROR ${error}`);
                    });

            } else {
                // Something else went wrong
                console.log(`Error from web service: ${error}`);
            }
        });
})();