// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import { app } from "@microsoft/teams-js";

/**
 * The 'PersonalTab' component renders the main tab content
 * of your app.
 */
class Tab extends React.Component<any, any> {
  constructor(props: any){
    super(props)
    this.state = {
      context: {}
    }
  }

  //React lifecycle method that gets called once a component has finished mounting
  //Learn more: https://reactjs.org/docs/react-component.html#componentdidmount
  componentDidMount(){
    // Get the user context from Teams and set it in the state
    app.getContext().then((context: app.Context) => {
      this.setState({
        context: context
      });
    });
    // Next steps: Error handling using the error object
  }

  render() {

    let userName = Object.keys(this.state.context).length > 0 ? this.state.context.user.userPrincipalName : "";

      return (
      <div>
        <h3>Hello World!</h3>
        <h1>Congratulations {userName}!</h1> <h3>This is the tab you made :-)</h3>
      </div>
      );
  }
}
export default Tab;