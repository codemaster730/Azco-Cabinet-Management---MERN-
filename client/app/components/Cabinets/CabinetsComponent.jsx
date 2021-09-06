import React from 'react';
import ReactToPrint from 'react-to-print';
import "whatwg-fetch";
import Modal from 'react-modal';
import { FaCalendarPlus, FaEdit, FaTrashAlt, FaUserAlt, FaShopify, FaSleigh, FaCalendarCheck} from 'react-icons/fa';
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
    backgroundColor       : 'rgba(128, 128, 128, 0.4)',
    width                 : '30%'
  }
};

class CabinetsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cabinets: [],
      reports: [],
      newModalIsOpen: false,
      editModalIsOpen: false,

      noneCabinetName: false,
      noneCabinetSupplier: false,
      noneCabinetLeadTime: false,

      isPrint: false,

      editIndex: '',
      editCabinetName: "",
      editCabinetDesc: "",
      editCabinetSupplier: "",
      editCabinetLeadTime: ""
    };

    this.cabinetNameInput = React.createRef();
    this.cabinetDescInput = React.createRef();
    this.cabinetSupplierInput = React.createRef();
    this.cabinetLeadTimeInput = React.createRef();

    this.newCabinet = this.newCabinet.bind(this);
    this.updateCabinet = this.updateCabinet.bind(this);
    this.deleteCabinet = this.deleteCabinet.bind(this);

    this._modifyCabinet = this._modifyCabinet.bind(this);

    this.openNewModal = this.openNewModal.bind(this);
    this.closeNewModal = this.closeNewModal.bind(this);

    this.openEditModal = this.openEditModal.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
  }

  componentDidMount() {
    var token = localStorage.getItem('token');
    if(token == null) {
      this.props.history.push('/');
    }
    fetch("/api/cabinets")
      .then(res => res.json())
      .then(json => {
        this.setState({
          cabinets: json
        });
      });

      Modal.setAppElement('body');
  }

  newCabinet() {
    let cabinetName = this.cabinetNameInput.current.value;
    let cabinetDesc = this.cabinetDescInput.current.value;
    let cabinetSupplier = this.cabinetSupplierInput.current.value;
    let cabinetLeadTime = this.cabinetLeadTimeInput.current.value;

    if(cabinetName !== '' && cabinetSupplier !== '' && cabinetLeadTime !== '') {
      let data = {
        cabinet_name: cabinetName,
        cabinet_desc: cabinetDesc,
        cabinet_supplier: cabinetSupplier,
        lead_time: cabinetLeadTime,
        cabinet_stock: 0
      };

      this.setState({
        noneCabinetName: false,
        noneCabinetSupplier: false,
        noneCabinetLeadTime: false
      });

      this.setState({
        newModalIsOpen: false
      });

      fetch("/api/cabinets", { 
        method: "POST",
        headers: {
        'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data) })
        .then(res => res.json())
        .then(json => {
          let data = this.state.cabinets;
          data.push(json);
          this.setState({
            cabinets: data
          });
        });
    }else{
      if(cabinetName == '') {
        this.setState({
          noneCabinetName: true,
        });
      }else{
        this.setState({
          noneCabinetName: false
        });
      }

      if(cabinetSupplier == '') {
        this.setState({
          noneCabinetSupplier: true,
        });
      }else{
        this.setState({
          noneCabinetSupplier: false,
        });
      }

      if(cabinetLeadTime == '') {
        this.setState({
          noneCabinetLeadTime: true,
        });
      }else{
        this.setState({
          noneCabinetLeadTime: false,
        });
      }
    }    
  }

  updateCabinet() {
    let cabinetName = this.cabinetNameInput.current.value;
    let cabinetDesc = this.cabinetDescInput.current.value;
    let cabinetSupplier = this.cabinetSupplierInput.current.value;
    let cabinetLeadTime = this.cabinetLeadTimeInput.current.value;

    let index = this.state.editIndex;
    let id = this.state.cabinets[index]._id;
    

    if(cabinetName !== '' && cabinetSupplier !== '' && cabinetLeadTime !== '') {
      let data = {
        cabinet_name: cabinetName,
        cabinet_desc: cabinetDesc,
        cabinet_supplier: cabinetSupplier,
        lead_time: cabinetLeadTime
      };

      this.setState({
        editModalIsOpen: false
      });

      fetch(`/api/cabinets/${id}`, { 
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(json => {
        this._modifyCabinet(index, json);
      });
    }else{
      if(cabinetName == '') {
        this.setState({
          noneCabinetName: true,
        });
      }

      if(cabinetSupplier == '') {
        this.setState({
          noneCabinetSupplier: true,
        });
      }

      if(cabinetLeadTime == '') {
        this.setState({
          noneCabinetLeadTime: true,
        });
      }
    }
  }

  deleteCabinet(index) {
    const id = this.state.cabinets[index]._id;

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>You want to delete this cabinet?</p>
            <button className="btn btn-danger" style={{marginRight: "10px"}} onClick={onClose}>No</button>
            <button className="btn btn-success"
              onClick={() => {
                // eslint-disable-next-line no-unused-vars
                fetch(`/api/cabinets/${id}`, { method: "DELETE" }).then(_ => {
                  this._modifyCabinet(index, null);
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

  _modifyCabinet(index, data) {
    let prevData = this.state.cabinets;

    if (data) {
      prevData[index] = data;
    } else {
      prevData.splice(index, 1);
    }

    this.setState({
      cabinets: prevData
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
    const cabinet = this.state.cabinets[index];
    this.setState({
      editModalIsOpen: true,
      editIndex: index,
      editCabinetName: cabinet.cabinet_name,
      editCabinetDesc: cabinet.cabinet_desc,
      editCabinetSupplier: cabinet.cabinet_supplier,
      editCabinetLeadTime: cabinet.lead_time
    });
  }
 
  closeEditModal(){
    this.setState({
      editModalIsOpen: false
    });
  }

  permitCabinet(index) {
    const id = this.state.cabinets[index]._id;

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>You want to permit this cabinet?</p>
            <button className="btn btn-danger" style={{marginRight: "10px"}} onClick={onClose}>No</button>
            <button className="btn btn-success"
              onClick={() => {
                // eslint-disable-next-line no-unused-vars
                fetch(`/api/cabinets/permit/${id}`, { 
                  method: "PUT",
                })
                .then(res => res.json())
                .then(json => {
                  this._modifyCabinet(index, json);
                });
                onClose();
              }}
            >
              Yes, Permit to start to outgo!
            </button>
          </div>
        );
      }
    });
  }

  render() {
    const cabinets = this.state.cabinets;    

    const cabinetlist = cabinets.map((cabinet, index) => {
      return (
        <tr key={cabinet._id}>
          <td>{index + 1}</td>
          <td className="cabinetName">{cabinet.cabinet_name}</td>
          <td className="cabinetDesc">{cabinet.cabinet_desc}</td>
          <td className="cabinetSupplier">{cabinet.cabinet_supplier}</td>
          <td className="cabinetLeadTime">{cabinet.lead_time} (days)</td>
          <td className="cabinetStock">{cabinet.cabinet_stock}</td>
          <td className="cabinetStock">{cabinet.out_stock}</td>
          <td className={!this.state.isPrint ? 'action' : 'actionRemove'}>
            <button className="btn btn-info" style={{marginRight: '10px'}} onClick={() => this.openEditModal(index)}><FaEdit /> Edit</button>
            <button className="btn btn-danger" style={{marginRight: '10px'}} onClick={() => this.deleteCabinet(index)}><FaTrashAlt /> Delete</button>
            {
              cabinet.is_permitted ? null : <button className="btn btn-default" onClick={() => this.permitCabinet(index)}><FaCalendarCheck /> Permit</button>
            }
          </td>
        </tr>
      );
    });

    return (
      <>
        <div className="container-fluid">
          <button className="btn btn-success create-new-user" onClick={this.openNewModal}><FaCalendarPlus />  Create new cabinet</button>

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
                  <h5 className="modal-title">You can create cabinet here</h5>
                </div>
                <div className="modal-body">
                <form>
                  <div className="input-group">
                    <span className="input-group-addon"><FaShopify /></span>
                    <input id="cabinetName" type="text" className={!this.state.noneCabinetName ? 'form-control' : 'form-control required' } name="cabinetName" placeholder="Cabinet Name" ref={this.cabinetNameInput} />
                  </div>
                  <div className="mb-20"></div>
                  <div className="input-group">
                    <span className="input-group-addon"><FaShopify /></span>
                    <input id="cabinetDesc" type="text" className='form-control' name="cabinetDesc" placeholder="Cabinet Description" ref={this.cabinetDescInput} />
                  </div>
                  <div className="mb-20"></div>
                  <div className="input-group">
                    <span className="input-group-addon"><FaShopify /></span>
                    <input id="cabinetSupplier" type="text" className={!this.state.noneCabinetSupplier ? 'form-control' : 'form-control required' } name="cabinetSupplier" placeholder="Cabinet Supplier Name" ref={this.cabinetSupplierInput} />
                  </div>
                  <div className="mb-20"></div>
                  <div className="input-group">
                    <span className="input-group-addon"><FaShopify /></span>
                    <input id="cabinetDesc" type="text" className={!this.state.noneCabinetLeadTime ? 'form-control' : 'form-control required' } name="cabinetDesc" placeholder="Cabinet Lead Time (days)" ref={this.cabinetLeadTimeInput} />
                  </div>
                </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-success" onClick={this.newCabinet}>Save</button>
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
                  <h5 className="modal-title">You can change cabinet information here</h5>
                </div>
                <div className="modal-body">
                <form>
                  <div className="input-group">
                    <span className="input-group-addon"><FaShopify /></span>
                    <input id="cabinetName" type="text" className={!this.state.noneCabinetName ? 'form-control' : 'form-control required' } name="cabinetName" defaultValue={this.state.editCabinetName} placeholder="Cabinet Name" ref={this.cabinetNameInput} />
                  </div>
                  <div className="mb-20"></div>
                  <div className="input-group">
                    <span className="input-group-addon"><FaShopify /></span>
                    <input id="cabinetDesc" type="text" className='form-control' defaultValue={this.state.editCabinetDesc} name="cabinetDesc" placeholder="Cabinet Description" ref={this.cabinetDescInput} />
                  </div>
                  <div className="mb-20"></div>
                  <div className="input-group">
                    <span className="input-group-addon"><FaShopify /></span>
                    <input id="cabinetSupplier" type="text" className={!this.state.noneCabinetSupplier ? 'form-control' : 'form-control required' } defaultValue={this.state.editCabinetSupplier} name="cabinetSupplier" placeholder="Cabinet Supplier Name" ref={this.cabinetSupplierInput} />
                  </div>
                  <div className="mb-20"></div>
                  <div className="input-group">
                    <span className="input-group-addon"><FaShopify /></span>
                    <input id="cabinetDesc" type="text" className={!this.state.noneCabinetLeadTime ? 'form-control' : 'form-control required' } name="cabinetDesc" defaultValue={this.state.editCabinetLeadTime} placeholder="Cabinet Lead Time (days)" ref={this.cabinetLeadTimeInput} />
                  </div>
                </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-success" onClick={this.updateCabinet}>Save</button>
                  <button type="button" className="btn btn-default" onClick={this.closeEditModal}>Close</button>
                </div>
              </div>
            </div>
          </Modal>

          <table className="table table-bordered user-table" ref={el => (this.componentRef = el)}>
            <thead>
              <tr>
                <th>#</th>
                <th>Cabinet Name</th>
                <th>Cabinet Description</th>
                <th>Cabinet supplier</th>
                <th>Lead time</th>
                <th>Stock in Langley</th>
                <th>Stock in Nakusp</th>
                <th className={!this.state.isPrint ? '' : 'actionRemove'}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cabinetlist.length !== 0 ? cabinetlist : <tr><td>No cabinets</td></tr>}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default CabinetsComponent;