import React from "react";
import { FaBars } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { connect } from 'react-redux'

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPagePath: ''
    }
  }

  componentDidMount() {
    let path = window.location.pathname;
    let pathTmp = path.split("/");

    this.setState({
      currentPagePath: pathTmp[1]
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('decodedToken');
    localStorage.removeItem('role');
    window.location.href = '/'
  }

  headerLinkClick() {
    let path = window.location.pathname;
    let pathTmp = path.split("/");

    this.setState({
      currentPagePath: pathTmp[1]
    });
  }

  render() {
    var token = localStorage.getItem('token');
    var role = localStorage.getItem('role');
    
    var currentPagePath = this.state.currentPagePath;

    var isLoggedIn;
    if(token != null) {
      isLoggedIn = true
    }else{
      isLoggedIn = false
    }

    return (
      <nav className="azco-header navbar navbar-expand-md navbar-light bg-light">
        <a className="navbar-brand font-weight-bold" href="#"><h2><FaBars /> AZCO Industries</h2></a>
        <button className="navbar-toggler float-right ml-auto" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {
            isLoggedIn ? role == 'Admin' || role == 'SuperAdmin' ?  <ul className="navbar-nav">
              {
                role == 'SuperAdmin' ? <li className={currentPagePath == 'users' ? "nav-item active-header-link" : "nav-item"} onClick={() => this.headerLinkClick()}>
                <Link className="nav-link" to="/users">Users</Link>
              </li> : null
              }
              <li className="nav-item" className={currentPagePath == 'cabinets' ? "nav-item active-header-link" : "nav-item"} onClick={() => this.headerLinkClick()}>
                <Link className="nav-link" to="/cabinets">Cabinets</Link>
              </li>
              <li className="nav-item" className={currentPagePath == 'units' ? "nav-item active-header-link" : "nav-item"} onClick={() => this.headerLinkClick()}>
                <Link className="nav-link" to="/units">Units</Link>
              </li>
              <li className="nav-item" className={currentPagePath == 'reports' ? "nav-item active-header-link" : "nav-item"} onClick={() => this.headerLinkClick()}>
                <Link className="nav-link" to="/reports">Reports</Link>
              </li>
              <li className="nav-item" className={currentPagePath == 'alerts' ? "nav-item active-header-link" : "nav-item"} onClick={() => this.headerLinkClick()}>
                <Link className="nav-link" to="/alerts">Alert</Link>
              </li>
            </ul> : null : null 
          }
        </div>
        {
          isLoggedIn ? <a className="nav-link logout" onClick={() => this.logout()}>Logout</a> : null
        }
        <header>
          <nav>
    
          </nav>
        </header>
      </nav>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  role: state.auth.role
})

export default connect(mapStateToProps, null)(Header);
