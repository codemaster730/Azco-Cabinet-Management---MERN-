/* eslint-disable no-undef */
import React, { Component } from "react";
import "whatwg-fetch";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { connect } from 'react-redux'
import { isLogin } from '../../actions'

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      noneUsername: false,
      nonePassword: false
    };

    this.usernameInput = React.createRef();
    this.passwordInput = React.createRef();

    this.login = this.login.bind(this);
    this.createNotification = this.createNotification.bind(this);
  }

  createNotification(type) {
    switch (type) {
      case 'info':
        return NotificationManager.info('Info message');
      case 'success':
        return NotificationManager.success("You're successfully logged in", "Thansk for using this site");
      case 'warning':
        return NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
      case 'error':
        return NotificationManager.error('Wrong Username or Password', 'Try Again', 5000, () => {
          alert('callback');
        });
    }
  };

  componentDidMount() {
    var token = localStorage.getItem('token');
    var role = localStorage.getItem('role')
    if(token != null && role == 'Admin') {
      this.props.history.push('/users')
    }
  }

  login(ev) {
    let self = this;
    ev.preventDefault();
    let username = this.usernameInput.current.value;
    let password = this.passwordInput.current.value;
    let data = {};
    if(username != '' && password != '') {
      this.setState({
        noneUsername: false,
        nonePassword: false
      });
      data = {
        'username': username,
        'password': password 
      }

      fetch("/api/login", { 
        method: "POST",
        headers: {
        'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data) }
      )
      .then(res => res.json())
      .then(json => {
        let data = json;
        if(data != null) {
          self.createNotification('success');
          let param = {
            isLoggedIn: true,
            role: data.role
          }
          this.props.isLogin(param);
          localStorage.setItem('user_id', data.user_id);
          localStorage.setItem('role', data.role);
          localStorage.setItem('token', data.token);
          localStorage.setItem('decodedToken', data.decodedToken);
          if(data.role == 'SuperAdmin'){
            // console.log("step1:", data.role)
            window.location.href = '/users';
          }
          if(data.role == 'Admin') {
            // console.log("step2:", data.role)
            window.location.href = '/cabinets';
          }
          if(data.role == "User"){
            // console.log("step3:", data.role)
            window.location.href = '/record';
          }
        }else{
          self.createNotification('error');  
        }
      });
    }else{
      if(username == '') {
        this.setState({
          noneUsername: true,
        });
      }else{
        this.setState({
          noneUsername: false,
        });
      }
      if(password == '') {
        this.setState({
          nonePassword: true,
        });
      }else{
        this.setState({
          nonePassword: false,
        });
      }
    }

  }

  render() {
    return (
      <>
        <div className="container">
        <NotificationContainer/>
          <div className="mb-60"></div>
          <form onSubmit={this.login}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input type="username" className={this.state.noneUsername ? 'form-control required' : 'form-control'} id="username" ref={this.usernameInput} />
            </div>
            <div className="form-group">
              <label htmlFor="pwd">Password:</label>
              <input type="password" className={this.state.nonePassword ? 'form-control required' : 'form-control'} id="pwd" ref={this.passwordInput} />
            </div>
            <button type="submit" className="btn btn-success">Login</button>
            <a href="/fp" className="forgotLink btn btn-default">Forgot Password?</a>
          </form>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  isLogin: param => {
      dispatch(isLogin(param));
  }
})

export default connect(null, mapDispatchToProps)(Home);
