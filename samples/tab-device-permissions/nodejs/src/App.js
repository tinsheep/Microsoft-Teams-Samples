// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HashRouter as Router, Navigate, Redirect, Route} from "react-router-dom";

import Tab from './components/Tab'
import TabConfig from './components/TabConfig'

function App() {
  return (
    <div className="App">
      <Router>
          <Route exact path="/">
            <Navigate to="/tab" />
          </Route>
          {loading ? (
            <Loader style={{ margin: 100 }} />
          ) : (
            <>
              <Route exact path="/tab" component={Tab} />
              <Route exact path="/config" component={TabConfig} />
            </>
          )}
      </Router>
      <Tab></Tab>
    </div>
  );
}

export default App;