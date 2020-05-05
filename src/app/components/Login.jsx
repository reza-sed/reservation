import React, { Component } from "react";
import querystring from "query-string";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { requestAuthenticateUser } from "./../store/actions/authenticationAction";
import * as types from "./../store/actions/actionTypes";

class Login extends Component {
  componentDidMount() {
    const values = querystring.parse(this.props.location.search);
    if (values && values.id) {
      this.props.authenticateUser(values.id);
    }
  }

  render() {
    return (
      <div>
        {this.props.authenticated === types.AUTHENTICATED ? (
          <h1 style={{ textAlign: "center" }}> ... درحال انتقال </h1>
        ) : (
          <h1 style={{ textAlign: "center" }}> ... اعتبار سنجی </h1>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.session.authenticated,
  };
};
const mapDispatchToProps = (dispatch) => ({
  authenticateUser: bindActionCreators(requestAuthenticateUser, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
