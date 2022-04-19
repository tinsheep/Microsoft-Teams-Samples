import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Providers } from '@microsoft/mgt-element';
import { TeamsMsal2Provider } from '@microsoft/mgt-teams-msal2-provider';
import * as MicrosoftTeams from "@microsoft/teams-js";
import { Route, BrowserRouter } from 'react-router-dom';
import { Provider, teamsTheme } from '@fluentui/react-northstar'
import TabAuth from './components/TabAuth';

TeamsMsal2Provider.microsoftTeamsLib = MicrosoftTeams;

Providers.globalProvider = new TeamsMsal2Provider({
  clientId: 'c3fcbeb1-ae6b-4d2d-9fee-1b0af1a32228',
  authPopupUrl: window.location.origin + '/tabauth',
  scopes: ['calendars.read', 'user.read', 'openid', 'profile', 'people.read', 'user.readbasic.all', 'files.read', 'files.read.all', 'sites.read.all', 'files.readwrite.all', 'sites.readwrite.all' ],
});

ReactDOM.render(
  <React.StrictMode>
    <Provider theme={teamsTheme}>
       <BrowserRouter >
          <div>
          <Route exact path="/tab" component={App} />
          <Route path="/tabauth" component={TabAuth} />
          </div>     
       </BrowserRouter >
    </Provider >
  </React.StrictMode>,
  document.getElementById('root')
);