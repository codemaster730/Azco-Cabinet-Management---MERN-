import React from 'react';
import ReactToPrint from 'react-to-print';
import "whatwg-fetch";
import Modal from 'react-modal';
import { FaCalendarPlus, FaEdit, FaTrashAlt, FaUserAlt, FaShopify} from 'react-icons/fa';
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

class UnitsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      units: [],
      cabinets: [],
      newModalIsOpen: false,
      editModalIsOpen: false,

      noneUnitName: false,
      noneUnitCabinet: false,
    
      isPrint: false,

      editIndex: ''
    };

    this.unitNameInput = React.createRef();
    this.unitCabinetInput = React.createRef();

    this.newUnit = this.newUnit.bind(this);
    this.updateUnit = this.updateUnit.bind(this);
    this.deleteUnit = this.deleteUnit.bind(this);

    this._modifyUnit = this._modifyUnit.bind(this);

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
    fetch("/api/units")
    .then(res => res.json())
    .then(json => {
        this.setState({
            units: json
        });
    });

    fetch("/api/cabinets")
    .then(res => res.json())
    .then(json => {
        this.setState({
            cabinets: json
        });
    });

    Modal.setAppElement('body');
  }

  newUnit() {
    let unitName = this.unitNameInput.current.value;
    let unitCabinet = this.unitCabinetInput.current.value;

    let data = {};

    if(unitName !== '' && unitCabinet !== '') {
      this.setState({
        noneUnitName: false,
        noneUnitCabinet: false
      });

      data = {
        'unit_name': unitName,
        'cabinet_id': unitCabinet,
        'unit_stock': 0
      }

      this.setState({
        newModalIsOpen: false
      });

      fetch("/api/units", { 
        method: "POST",
        headers: {
        'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data) })
        .then(res => res.json())
        .then(json => {
          let data = this.state.units;
          data.push(json);
          this.setState({
            units: data
          });
        });
    }else{
      if(unitName == '') {
        this.setState({
          noneUnitName: true,
        })
      }else{
        this.setState({
            noneUnitName: false,
        })
      }

      if(unitCabinet == '') {
        this.setState({
            noneUnitCabinet: true,
        })
      }else{
        this.setState({
            noneUnitCabinet: false,
        })
      }
    }    
  }

  updateUnit() {

    let unitName = this.unitNameInput.current.value;
    let unitCabinet = this.unitCabinetInput.current.value;
    let cabinet_id = '';

    let index = this.state.editIndex;
    let id = this.state.units[index]._id;

    if(unitName !== '' && unitCabinet !== '') {
        let data = {      
            'unit_name': unitName,
            'cabinet_id': unitCabinet
        }
      this.setState({
        editModalIsOpen: false
      });

      fetch(`/api/units/${id}`, { 
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(json => {
        this._modifyUnit(index, json);
      });
    }else{
        if(unitName == '') {
            this.setState({
              noneUnitName: true,
            })
          }else{
            this.setState({
                noneUnitName: false,
            })
          }
    
          if(unitCabinet == '') {
            this.setState({
                noneUnitCabinet: true,
            })
          }else{
            this.setState({
                noneUnitCabinet: false,
            })
          }
    }
  }

  deleteUnit(index) {
    const id = this.state.units[index]._id;

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>You want to delete this unit?</p>
            <button className="btn btn-danger" style={{marginRight: "10px"}} onClick={onClose}>No</button>
            <button className="btn btn-success"
              onClick={() => {
                // eslint-disable-next-line no-unused-vars
                fetch(`/api/units/${id}`, { method: "DELETE" }).then(_ => {
                  this._modifyUnit(index, null);
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

  _modifyUnit(index, data) {
    let prevData = this.state.units;

    if (data) {
      prevData[index] = data;
    } else {
      prevData.splice(index, 1);
    }

    this.setState({
      units: prevData
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
    const unit = this.state.units[index];
    this.setState({
      editModalIsOpen: true,
      editIndex: index,
      editUnitName: unit.unit_name,
      editUnitCabinet: unit.cabinet_id
    });
  }
 
  closeEditModal(){
    this.setState({
      editModalIsOpen: false
    });
  }

  render() {
    const units = this.state.units;
    const cabinets = this.state.cabinets;

    const unitlist = units.map((unit, index) => {
        let unitCabinetName = '';
        cabinets.map(cabinet => {
            if(cabinet._id === unit.cabinet_id) {
                unitCabinetName = cabinet.cabinet_name;
            }
        });
      return (
        <tr key={unit._id}>
          <td>{index + 1}</td>
          <td className="unitName">{unit.unit_name}</td>
          <td className="unitCabinet">{unitCabinetName}</td>
          <td className="unitStock">{unit.unit_stock}</td>
          <td className={!this.state.isPrint ? 'action' : 'actionRemove'}>
            <button className="btn btn-info" style={{marginRight: '10px'}} onClick={() => this.openEditModal(index)}><FaEdit /> Edit</button>
            <button className="btn btn-danger" onClick={() => this.deleteUnit(index)}><FaTrashAlt /> Delete</button>
          </td>
        </tr>
      );
    });

    const cabinetList = cabinets.map(cabinet => {
        return (
            <option key={cabinet._id} value={cabinet._id}>{cabinet.cabinet_name}</option>
        );
    });

    return (
      <>
        <div className="container-fluid">
          <button className="btn btn-success create-new-user" onClick={this.openNewModal}><FaCalendarPlus />  Create new unit</button>

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
                  <h5 className="modal-title">You can create unit here</h5>
                </div>
                <div className="modal-body">
                <form>
                  <div className="input-group">
                    <span className="input-group-addon"><FaShopify /></span>
                    <input id="unitName" type="text" className={!this.state.noneUnitName ? 'form-control' : 'form-control required' } name="unitName" placeholder="Unit Name" ref={this.unitNameInput} />
                  </div>
                  <div className="mb-20"></div>
                  <div className="input-group">
                    <span className="input-group-addon"><FaShopify /></span>
                    <select id="unitCabinet" type="text" className='form-control' name="unitCabinet" placeholder="Cabinets" ref={this.unitCabinetInput} >
                        {cabinetList}
                    </select>
                  </div>
                </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-success" onClick={this.newUnit}>Save</button>
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
                    <span className="input-group-addon"><FaShopify /></span>
                    <input id="unitName" type="text" className={!this.state.noneUnitName ? 'form-control' : 'form-control required' } name="unitName" defaultValue={this.state.editUnitName} placeholder="Unit Name" ref={this.unitNameInput} />
                  </div>
                  <div className="mb-20"></div>
                  <div className="input-group">
                    <span className="input-group-addon"><FaShopify /></span>
                    <select id="unitCabinet" type="text" className='form-control' defaultValue={this.state.editUnitCabinet} name="unitCabinet" placeholder="Cabinets" ref={this.unitCabinetInput} >
                        {cabinetList}
                    </select>
                  </div>
                </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-success" onClick={this.updateUnit}>Save</button>
                  <button type="button" className="btn btn-default" onClick={this.closeEditModal}>Close</button>
                </div>
              </div>
            </div>
          </Modal>

          <table className="table table-bordered user-table" ref={el => (this.componentRef = el)}>
            <thead>
              <tr>
                <th>#</th>
                <th>Unit Name</th>
                <th>Cabinet for unit</th>
                <th>Unit Stock</th>
                <th className={!this.state.isPrint ? '' : 'actionRemove'}>Action</th>
              </tr>
            </thead>
            <tbody>
              {unitlist.length !== 0 ? unitlist : <tr><td>No units</td></tr>}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default UnitsComponent;