import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from '../Header/Header';
import { connect } from 'react-redux'
import NotFound from "../App/NotFound";
import Home from "../Home/Home";
import UsersComponent from "../Users/UsersComponent";
import CabinetsComponent from "../Cabinets/CabinetsComponent";
import UnitsComponent from "../Units/UnitsComponent";
import ReportsComponent from "../Reports/ReportsComponent";
import RecordComponent from "../Record/RecordComponent";
import AlertsComponent from "../Alerts/AlertsComponent";
import ForgotPasswordComponent from "../ForgotPassword/ForgotPasswordComponent";
import {createBrowserHistory} from 'history';

// eslint-disable-next-line react/prop-types
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var history = createBrowserHistory();
    return (
      <>
      <Router history={history}>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          {/* <Route exact path="/" component={UsersComponent} /> */}
          <Route path="/users" component={UsersComponent} />
          <Route path="/cabinets" component={CabinetsComponent} />
          <Route path="/units" component={UnitsComponent} />
          <Route path="/reports" component={ReportsComponent} />
          <Route path="/alerts" component={AlertsComponent} />
          <Route path="/record" component={RecordComponent} />
          <Route path="/fp" component={ForgotPasswordComponent} />
          <Route component={NotFound} />
        </Switch>
      </Router>
      </>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  role: state.auth.role
})

export default connect(mapStateToProps, null)(App);
