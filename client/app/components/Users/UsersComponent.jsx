/* eslint-disable no-undef */
import React, { Component } from "react";
import ReactToPrint from 'react-to-print';
import "whatwg-fetch";
import Modal from 'react-modal';
import { FaCalendarPlus, FaEdit, FaTrashAlt, FaUserAlt, FaLock, FaRegEye, FaRegEyeSlash} from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor       : 'rgba(128, 128, 128, 0.4)'
  }
};

class UsersComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      newModalIsOpen: false,
      editModalIsOpen: false,
      editIndex: '',
      editUsername: '',
      editPassword: '',
      editEmail: '',
      isShowPassword: false,
      isAdmin: false,
      isUser: true,
      noneUsername: false,
      nonePassword: false,
      isPrint: false,
      
      isSuperAdmin: false
    };

    this.usernameInput = React.createRef();
    this.passwordInput = React.createRef();
    this.emailInput = React.createRef();

    this.newUser = this.newUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);

    this._modifyUser = this._modifyUser.bind(this);

    this.openNewModal = this.openNewModal.bind(this);
    this.closeNewModal = this.closeNewModal.bind(this);

    this.openEditModal = this.openEditModal.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);

    this.isAdmin = this.isAdmin.bind(this);
    this.isUser = this.isUser.bind(this);
  }

  componentDidMount() {
    var token = localStorage.getItem('token');
    var role = localStorage.getItem('role');
    
    if(token == null || role != "SuperAdmin") {
      this.props.history.push('/cabinets');
    }
    fetch("/api/users")
      .then(res => res.json())
      .then(json => {
        let userTmp = [];
        json.map(user => {
          userTmp.push(user);
        });
        this.setState({
          users: userTmp
        });
      });

      Modal.setAppElement('body');
  }

  newUser() {
    let username = this.usernameInput.current.value;
    let password = this.passwordInput.current.value;
    let email = this.emailInput.current.value;
    let data = {};
    if(username !== '' && password !== '') {
      this.setState({
        noneUsername: false,
        nonePassword: false
      })
      data = {
        'username': username,
        'password': password,
        'email': email,
        'role': this.state.isAdmin ? 'Admin' : 'User'
      }
      this.setState({
        newModalIsOpen: false
      });
      fetch("/api/users", { 
        method: "POST",
        headers: {
        'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data) })
        .then(res => res.json())
        .then(json => {
          let data = this.state.users;
          data.push(json);
          this.setState({
            users: data
          });
        });
    }else{
      if(username == '') {
        this.setState({
          noneUsername: true,
        })
      }else{
        this.setState({
          noneUsername: false,
        })
      }
      if(password == '') {
        this.setState({
          nonePassword: true,
        })
      }else{
        this.setState({
          nonePassword: false,
        })
      }
    }    
  }

  updateUser() {
    this.setState({
      editModalIsOpen: false
    });
    let username = this.usernameInput.current.value;
    let password = this.passwordInput.current.value;
    let email = this.emailInput.current.value;
    let index = this.state.editIndex;
    let id = this.state.users[index]._id;

    let data = {      
      'username': username,
      'password': password,
      'email': email,
      'role': this.state.isSuperAdmin ? 'SuperAdmin' : this.state.isAdmin ? 'Admin' : 'User'
    }

    if(username !== '' && password !== '') {
      this.setState({
        noneUsername: false,
        nonePassword: false
      })
      
      fetch(`/api/users/${id}`, { 
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(json => {
        this._modifyUser(index, json);
      });
    }else{
      if(username == '') {
        this.setState({
          noneUsername: true,
        })
      }else{
        this.setState({
          noneUsername: false,
        })
      }
      if(password == '') {
        this.setState({
          nonePassword: true,
        })
      }else{
        this.setState({
          nonePassword: false,
        })
      }
    }
  }

  deleteUser(index) {
    const id = this.state.users[index]._id;

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>You want to delete this file?</p>
            <button className="btn btn-danger" style={{marginRight: "10px"}} onClick={onClose}>No</button>
            <button className="btn btn-success"
              onClick={() => {
                // eslint-disable-next-line no-unused-vars
                fetch(`/api/users/${id}`, { method: "DELETE" }).then(_ => {
                  this._modifyUser(index, null);
                });
                onClose();
              }}
            >
              Yes, Delete it!
            </button>
          </div>
        );
      }
    });
  }

  _modifyUser(index, data) {
    let prevData = this.state.users;

    if (data) {
      prevData[index] = data;
    } else {
      prevData.splice(index, 1);
    }

    this.setState({
      users: prevData
    });
  }

  openNewModal() {
    this.setState({
      newModalIsOpen: true
    });
  }
 
  closeNewModal(){
    this.setState({
      newModalIsOpen: false
    });
  }

  openEditModal(index) {
    const user = this.state.users[index];
    this.setState({
      editModalIsOpen: true,
      editIndex: index,
      editUsername: user.username,
      editPassword: user.password,
      editEmail: user.email,
      isSuperAdmin: user.role == 'SuperAdmin' ? true : false
    });
  }
 
  closeEditModal(){
    this.setState({
      editModalIsOpen: false
    });
  }

  showPassword() {

    this.setState({
      isShowPassword: true
    });
  }

  hidePassword() {
    this.setState({
      isShowPassword: false
    });
  }

  isAdmin(ev) {
    this.setState({
      isAdmin: ev.target.checked,
      isUser: !ev.target.checked
    });
  } 

  isUser(ev) {
    this.setState({
      isUser: ev.target.checked,
      isAdmin: !ev.target.checked,
    });
  }

  render() {
    const users = this.state.users;
    const isShowPassword = this.state.isShowPassword;
    const isSuperAdmin = this.state.isSuperAdmin;

    const userlist = users.map((user, index) => {
      return (
        <tr key={user._id}>
          <td>{index + 1}</td>
          <td className="username">{user.username}</td>
          <td className="password">{user.password}</td>
          <td className="role">{user.role}</td>
          <td className="email">{user.email}</td>
          <td className={!this.state.isPrint ? 'action' : 'actionRemove'}>
            <button className="btn btn-info" style={{marginRight: '10px'}} onClick={() => this.openEditModal(index)}><FaEdit /> Edit</button>
            <button className="btn btn-danger" onClick={() => this.deleteUser(index)}><FaTrashAlt /> Delete</button>
          </td>
        </tr>
      );
    });

    return (
      <>
        <div className="container-fluid">
           <button className="btn btn-success create-new-user" onClick={this.openNewModal}><FaCalendarPlus />  Create new user</button>

          <ReactToPrint
            trigger={() => {
              return <a style={{'color': 'white'}} className="btn btn-info printBtn">Print this out!</a>;
            }}
            content={() => {
              return this.componentRef;
            }}
            onBeforeGetContent={() => {
              this.setState({
                isPrint: true
              });
            }}
            onAfterPrint={() => {
              this.setState({
                isPrint: false
              });
            }}
          />


          <Modal
            isOpen={this.state.newModalIsOpen}
            onRequestClose={this.closeNewModal}
            style={customStyles}
          > 
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">You can create username and password here</h5>
                </div>
                <div className="modal-body">
                <form>
                  <div className="input-group">
                    <span className="input-group-addon"><FaUserAlt /></span>
                    <input id="username" type="text" className={!this.state.noneUsername ? 'form-control' : 'form-control required' } name="username" placeholder="Username" ref={this.usernameInput} />
                  </div>
                  <div className="mb-20"></div>
                  <div className="input-group">
                    <span className="input-group-addon"><FaLock /></span>
                    <input id="password" type={!isShowPassword ? 'password' : 'text'} className={!this.state.nonePassword ? 'form-control' : 'form-control pw-required' } name="password" placeholder="Password" ref={this.passwordInput}  />
                    <span className="input-group-addon-right">{!isShowPassword ? <FaRegEye onClick={() => this.showPassword()} /> : <FaRegEyeSlash onClick={() => this.hidePassword()} />}</span>
                  </div>
                  <div className="mb-20"></div>
                  <div className="input-group">
                    <span className="input-group-addon"><FaLock /></span>
                    <input id="email" type='text' className='form-control'  name="email" placeholder="Email" ref={this.emailInput}  />
                  </div>
                  <div className="mb-20"></div>
                  <div className="checkbox">
                    <label><input type="checkbox" value="" onChange={this.isAdmin} checked={this.state.isUser ? false : true} /> Admin</label>
                  </div>
                  <div className="checkbox">
                    <label><input type="checkbox" value=""  onChange={this.isUser} checked={this.state.isAdmin ? false : true}/> User</label>
                  </div>
                </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-success" onClick={this.newUser}>Save</button>
                  <button type="button" className="btn btn-default" onClick={this.closeNewModal}>Close</button>
                </div>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={this.state.editModalIsOpen}
            onRequestClose={this.closeEditModal}
            style={customStyles}
          > 
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">You can change username and password here</h5>
                </div>
                <div className="modal-body">
                <form>
                  <div className="input-group">
                    <span className="input-group-addon"><FaUserAlt /></span>
                    <input id="username" type="text" defaultValue={this.state.editUsername} className="form-control" name="username" placeholder="Username" ref={this.usernameInput} />
                  </div>
                  <div className="mb-20"></div>
                  <div className="input-group">
                    <span className="input-group-addon"><FaLock /></span>
                    <input id="password" type={!isShowPassword ? 'password' : 'text'} defaultValue={this.state.editPassword} className="form-control" name="password" placeholder="Password" ref={this.passwordInput} />
                    <span className="input-group-addon-right">{!isShowPassword ? <FaRegEye onClick={() => this.showPassword()} /> : <FaRegEyeSlash onClick={() => this.hidePassword()} />}</span>
                  </div>
                  <div className="mb-20"></div>
                  <div className="input-group">
                    <span className="input-group-addon"><FaLock /></span>
                    <input id="email" type='text' className='form-control'  name="email" placeholder="Email" defaultValue={this.state.editEmail}  ref={this.emailInput}  />
                  </div>
                  <div className="mb-20"></div>
                  <div className="checkbox">
                    <label><input type="checkbox" value="" onChange={this.isAdmin} checked={this.state.isUser || isSuperAdmin ? false : true} /> Admin</label>
                  </div>
                  <div className="checkbox">
                    <label><input type="checkbox" value=""  onChange={this.isUser} checked={this.state.isAdmin || isSuperAdmin ? false : true}/> User</label>
                  </div>
                </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-success" onClick={this.updateUser}>Save</button>
                  <button type="button" className="btn btn-default" onClick={this.closeEditModal}>Close</button>
                </div>
              </div>
            </div>
          </Modal>

          <table className="table table-bordered user-table" ref={el => (this.componentRef = el)}>
            <thead>
              <tr>
                <th>#</th>
                <th>Usernmae</th>
                <th>Password</th>
                <th>Role</th>
                <th>Email</th>
                <th className={!this.state.isPrint ? '' : 'actionRemove'}>Action</th>
              </tr>
            </thead>
            <tbody>
              {userlist.length !== 0 ? userlist : <tr><td>No user</td></tr>}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default UsersComponent;
