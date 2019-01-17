import React, { Component } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import Areas from './containers/Areas';
import Sensors from './containers/Sensors';
import logo from './assets/images/keoa.png';

const client = new ApolloClient({
  uri: `http://localhost:4000/graphql`,
});
export default class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <HashRouter>
          <div className="main__wrapper">
            <div className="wrapper">
              <div className="main__wrapper__header">
                <img src={logo} alt="Logo KEOA" />
                <h2>IoT Dashboard</h2>
              </div>
              <Switch>
                <Route exact path='/' component={Areas} />
                <Route path='/area/:id' component={Sensors} />
              </Switch>
            </div>
          </div>
        </HashRouter >
      </ApolloProvider>
    );
  }
}

