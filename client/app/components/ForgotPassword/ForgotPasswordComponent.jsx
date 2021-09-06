import React from 'react';
import * as emailjs from 'emailjs-com'
import { Button, FormFeedback, Form, FormGroup, Label, Input } from 'reactstrap'
 
class AlertsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      to_name: ''
    };

    this.resetPassword = this.resetPassword.bind(this);

  }

  componentDidMount() {
    let self = this;
    fetch("/api/users")
      .then(res => res.json())
      .then(json => {
        json.map(user => {
          if(user.role == 'SuperAdmin') {
            self.resetPassword(user.email);   
          }
        });
      });
  }

  resetPassword(email) {
    var pass = ''; 
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +  
            'abcdefghijklmnopqrstuvwxyz0123456789@#$'; 
      
    for (var i = 1; i <= 8; i++) { 
        var char = Math.floor(Math.random() 
                    * str.length + 1); 
          
        pass += str.charAt(char) 
    } 

    let data = {
        'new_password': pass
    }

    fetch(`/api/resetPassword`, { 
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(json => {
        let templateParams = {
            from_name: "AZCO service",
            to_name: email,
            message: "<h1>Your new password is " + pass + ".</h1>",
           }
    
        emailjs.send(
            'service_1c967bb',
            'template_7vkj1wn',
             templateParams,
            'user_uTNycLwjerx7lK4RH1pFv'
           )
      });
  }

  render() {

    return (
      <>
        <div className="container-fluid">
            <div className="mb-40"></div>   
            <div className="inform-message">
                New password was sent to your email address. Please check.
                <div className="mb-20"></div>
                <br />
                <a href="/" className="btn btn-success">Back to Login</a>
            </div>
        </div>
      </>
    );
  }
}

export default AlertsComponent;