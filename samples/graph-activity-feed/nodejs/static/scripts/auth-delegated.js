(function () {
    'use strict';

    // 1. Get auth token
    // Ask Teams to get us a token from AAD
    function getClientSideToken() {

        microsoftTeams.initialize();
        return new Promise((resolve, reject) => {
            microsoftTeams.authentication.getAuthToken({
                successCallback: (result) => {
                    console.log(result);
                    resolve(result);
                },
                failureCallback: function (error) {
                    reject("Error getting token: " + error);
                }
            });

        });

    }

    // 2. Exchange that token for a token with the required permissions
    //    using the web service (see /auth/token handler in app.js)
    function getServerSideToken(clientSideToken) {
        return new Promise((resolve, reject) => {
            microsoftTeams.initialize();
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
                    } else {
                        const serverSideToken = responseJson;
                        console.log(serverSideToken);
                        resolve(serverSideToken);
                    }
                });
            });
        });
    }

    // 3. Get the server side token and use it to call the Graph API
    function useServerSideToken(data) {

        return fetch("https://graph.microsoft.com/v1.0/me/",
            {
                method: 'GET',
                headers: {
                    "accept": "application/json",
                    "authorization": "bearer " + data
                },
                mode: 'cors',
                cache: 'default'
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw (`Error ${response.status}: ${response.statusText}`);
                }
            })
            .then((profile) => {
                console.log(JSON.stringify(profile, undefined, 4), 'pre');
            });

    }

    // Show the consent pop-up
    function requestConsent() {
        return new Promise((resolve, reject) => {
            microsoftTeams.authentication.authenticate({
                url: window.location.origin + "/auth/auth-start",
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

    // In-line code
    getClientSideToken()
        .then((clientSideToken) => {
            return getServerSideToken(clientSideToken);
        })
        .then((serverSideToken) => {
            // Display in-line button so user can consent
           
                requestConsent()
                    .then((result) => {
                        // Consent succeeded - use the token we got back
                        let accessToken = JSON.parse(result).accessToken;
                        console.log(`Received access token ${accessToken}`);
                        useServerSideToken(accessToken);
                    })
                    .catch((error) => {
                        console.log(`ERROR ${error}`);
                        // Consent failed - offer to refresh the page
                        button.disabled = true;
                        let refreshButton = display("Refresh page", "button");
                        refreshButton.onclick = (() => { window.location.reload(); });
                    });
           
            return useServerSideToken(serverSideToken);

        })
        .catch((error) => {
            if (error === "invalid_grant") {
                console.log(`Error: ${error} - user or admin consent required`);
                // Display in-line button so user can consent
                let button = display("Consent", "button");
                button.onclick = (() => {
                    requestConsent()
                        .then((result) => {
                            // Consent succeeded - use the token we got back
                            let accessToken = JSON.parse(result).accessToken;
                            console.log(`Received access token ${accessToken}`);
                            useServerSideToken(accessToken);
                        })
                        .catch((error) => {
                            console.log(`ERROR ${error}`);
                            // Consent failed - offer to refresh the page
                            button.disabled = true;
                            let refreshButton = display("Refresh page", "button");
                            refreshButton.onclick = (() => { window.location.reload(); });
                        });
                });
            } else {
                // Something else went wrong
                console.log(`Error from web service: ${error}`);
            }
        });

})();