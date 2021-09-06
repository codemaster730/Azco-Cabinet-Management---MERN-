import React from 'react';
import ReactToPrint from 'react-to-print';
import { FaShopify, FaEdit, FaTrashAlt} from 'react-icons/fa';
import Modal from 'react-modal';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import ReactLoading from 'react-loading';
import Pagination from "react-js-pagination";
// import "bootstrap/less/bootstrap.less";

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor       : 'rgba(128, 128, 128, 0.4)',
    width                 : '30%'
  }
};

class ReportsComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      users: [],
      units: [],
      cabinets: [],
      reports: [],
      isPrint: false,
      editModalIsOpen: false,      
      editModalProductName: '',
      editReportProductId: '',
      editMove_stock: '',
      stockType: '',
      editIndex: '',
      isLoading: true,

      activePage: 1,
      totalItemsCount: 10,

      searchKey: ''
    }
    
    this.moveStockInput = React.createRef();
    this.searchInput = React.createRef();

    this.getReports = this.getReports.bind(this);
  }

  componentDidMount() {
    var token = localStorage.getItem('token');
    if(token == null) {
      this.props.history.push('/');
    }

    this.getReports();

    Modal.setAppElement('body');
  }

  getReports() {
    fetch("/api/reports")
    .then(res => res.json())
    .then(json => {
      this.setState({
        users: json.users,
        cabinets: json.cabinets,
        units: json.units,
        reports: json.reports,
        isLoading: false,
        totalItemsCount: json.reports.length
      });
    });
  }

  openEditModal(index, product_id, product_name, editMove_stock, stockType) {
  
    this.setState({
      editModalIsOpen: true,
      editIndex: index,
      editModalProductName: product_name,
      editReportProductId: product_id,
      editMove_stock: editMove_stock,
      stockType: stockType
      // editReportCabinet: report.cabinet_id
    });
  }
 
  closeEditModal(){
    this.setState({
      editModalIsOpen: false
    });
  }

  _modifyReport (index, data) {
    let prevData = this.state.reports;

    if (data) {
      prevData[index] = data;
    } else {
      prevData.splice(index, 1);
    }

    this.setState({
      reports: prevData
    });
  }

  updateReport() {
    this.setState({
      editModalIsOpen: false
    });

    let index = this.state.editIndex;
    let moveStock = this.moveStockInput.current.value;
    let id = this.state.reports[index]._id;

    let data = {
      move_stock: moveStock,
      editMove_stock: this.state.editMove_stock,
      product_id: this.state.editReportProductId,
      type: this.state.stockType
    }

    if(moveStock != '') {
      fetch(`/api/reports/${id}`, { 
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(json => {
        this._modifyReport(index, json);
      });
    }else{

    }
  }

  handlePageChange(pageNumber) {
    this.setState({activePage: pageNumber});
  }

  searchInputChange() {
    let searchKey = this.searchInput.current.value;
    this.setState({
      searchKey: searchKey,
      activePage: 1
    });
  }
  
  render() {
    const reportsTmp = this.state.reports;
    const activePage = this.state.activePage;
    const to  = activePage * 10;
    const from  = (activePage - 1) * 10;
    const reports = reportsTmp.slice(from, to);

    const users = this.state.users;
    const cabinets = this.state.cabinets;
    const units = this.state.units;

    const searchKey = this.state.searchKey;

    const reportList = reports.map((report, index) => {
      let username = '' ;
      let product_name = '';
      let product_id = '';
      
      users.map(user => {
        if(user._id == report.user_id) {
          username = user.username;
        }
      });

      if(report.type == "Cabinets"){
        cabinets.map(cabinet => {
          if(cabinet._id == report.move_name) {
            product_name = cabinet.cabinet_name;
            product_id = cabinet._id;
          }
        });
      }else{
        units.map(unit => {
          if(unit._id == report.move_name) {
            product_name = unit.unit_name;
            product_id = unit._id;
          }
        });
      }

      let dateTmp1 = report.date.split('T');
      let dateTmp2 = dateTmp1[1].split('.');

      if(searchKey == '') {
        return (
          <tr key={report._id}>
            <td>{index + 1 + ((activePage -1) * 10)}</td>
            <td className="">{report.type}</td>
            <td className="">{product_name}</td>
            <td className="">{username}</td>
            <td className="">{report.move_stock}</td>
            <td className="">{report.inout}</td>
            <td className="">{dateTmp1[0]}, {dateTmp2[0]}</td>
            <td className={!this.state.isPrint ? 'action' : 'actionRemove'}>
              <button className="btn btn-info" style={{marginRight: '10px'}} onClick={() => this.openEditModal(index, product_id, product_name, report.move_stock, report.type)}><FaEdit />Moving Stock Edit</button>
            </td>
          </tr>
        );
      }else{
        if(searchKey == report.type || searchKey == report.inout || searchKey == username || searchKey == product_name ){
          return (
            <tr key={report._id}>
              <td>{index + 1 + ((activePage -1) * 10)}</td>
              <td className="">{report.type}</td>
              <td className="">{product_name}</td>
              <td className="">{username}</td>
              <td className="">{report.move_stock}</td>
              <td className="">{report.inout}</td>
              <td className="">{dateTmp1[0]}, {dateTmp2[0]}</td>
              <td className={!this.state.isPrint ? 'action' : 'actionRemove'}>
                <button className="btn btn-info" style={{marginRight: '10px'}} onClick={() => this.openEditModal(index, product_id, product_name, report.move_stock, report.type)}><FaEdit />Moving Stock Edit</button>
              </td>
            </tr>
          );
        }
      }

    });

    return (
      <>
        {
          this.state.isLoading ? 
            <div className="spinning"><ReactLoading type="spin" className="spinning" color={"#777"} /></div> 
          : null
        }
        <div className="container-fluid">

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

          <div className="search-container"> 
            <div className="search-input">
              <input type="text" ref={this.searchInput} />
            </div>
            <button className="btn btn-primary" onClick={() => this.searchInputChange()} >Search</button>
          </div>

          <Modal
            isOpen={this.state.editModalIsOpen}
            onRequestClose={() => this.closeEditModal()}
            style={customStyles}
          > 
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">You can change moving stock amount here.</h5>
                </div>
                <div className="modal-body">
                <form>
                  <div className="input-group"> 
                    <span className="input-group-addon"><FaShopify /></span>
                    <input id="reportName" type="text" className='form-control' name="reportName" defaultValue={this.state.editModalProductName} disabled={true} />
                  </div>
                  <div className="mb-20"></div>
                  <div className="input-group"> 
                    <span className="input-group-addon"><FaShopify /></span>
                    <input id="move_stock" type="text" className='form-control' name="move_stock" defaultValue={this.state.editMove_stock} placeholder="Report Name" ref={this.moveStockInput} />
                  </div>
                </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-success" onClick={() => this.updateReport()}>Save</button>
                  <button type="button" className="btn btn-default" onClick={this.closeEditModal}>Close</button>
                </div>
              </div>
            </div>
          </Modal>

          <table className="table table-bordered user-table" ref={el => (this.componentRef = el)}>
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Cabinet/Unit Name</th>
                <th>User</th>
                <th>Moving Stock</th>
                <th>Incoming / Outgoing</th>
                <th>Date</th>
                <th className={!this.state.isPrint ? '' : 'actionRemove'}>Action</th>
              </tr>
            </thead>
            <tbody>
              {reportList.length !== 0 ? reportList : <tr><td>No reports</td></tr>}
            </tbody>
          </table>
          
          <div className="pagination-container">
            <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={10}
              totalItemsCount={this.state.totalItemsCount}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange.bind(this)}
            />
          </div>
        </div>
      </>
    );
  }
}

export default ReportsComponent;