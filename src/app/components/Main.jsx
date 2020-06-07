import "../css/bootstrap.min.css";
import "../css/index.css";
import React, { Component } from "react";
import { Provider } from "react-redux";
import { store } from "./../store/index";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { history } from "./../store/history";
import { Navigation } from "./Navigation";

import ReservationForm from "./ReservationForm";
import Dashboard from "./Dashboard";
import UnAuthorized from "./UnAuthorized";
import Login from "./Login";

const RouteGuard = (Component) => ({ match }) => {
  if (!store.getState().session.authenticated) {
    return <Redirect to="/unauthorized" />;
  }
  return <Component match={match} />;
};

class Main extends Component {
  render() {
    return (
      <React.Fragment>
        <Router history={history}>
          <Provider store={store}>
            <div>
              <Navigation />
              <Switch>
                <Route path="/login" component={Login} />
                <Route path="/dashboard" render={RouteGuard(Dashboard)} />
                <Route path="/reserve" render={RouteGuard(ReservationForm)} />
                <Route path="/unauthorized" render={UnAuthorized} />
              </Switch>
            </div>
          </Provider>
        </Router>
      </React.Fragment>
    );
  }
}

export default Main;
