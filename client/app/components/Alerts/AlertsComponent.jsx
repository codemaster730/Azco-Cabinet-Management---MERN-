import React from 'react';
import ReactToPrint from 'react-to-print';
import { FaCalendarPlus} from 'react-icons/fa';
 
class AlertsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cabinets: [],
      danger_cabinets: [],

      isPrint: false
    };

    this.getCabinets = this.getCabinets.bind(this);
  }

  componentDidMount() {
    var token = localStorage.getItem('token');
    if(token == null) {
      this.props.history.push('/');
    }

    this.getCabinets();
  }

  getCabinets() {
    fetch("/api/cabinets")
    .then(res => res.json())
    .then(json => {
      let tmp = [];
      // let tmp1 = [];
      json.map(cabinet => {
        let leftDays = cabinet.cabinet_stock / cabinet.sales_flow;
        if(leftDays <= (cabinet.lead_time + 5) && cabinet.is_permitted) {
          tmp.push(cabinet);
        } 
        // if(leftDays < (cabinet.lead_time)) {
        //   tmp1.push(cabinet);
        // }
      });
      this.setState({
        cabinets: tmp,
        // danger_cabinets: tmp1
      });
    });
  }

  refresh() {
    this.getCabinets();
  }

  render() {
    const cabinets = this.state.cabinets;

    const cabinetList = cabinets.map((cab, index) => {
      let leftDays = Math.floor(cab.cabinet_stock /cab.sales_flow);
      return (
        <tr key={cab._id}>
          <td>{index + 1}</td>
          <td className="cabinetName">{cab.cabinet_name}</td>
          <td className="cabinetDesc">{cab.cabinet_desc}</td>
          <td className="cabinetSupplier">{cab.cabinet_supplier}</td>
          <td className="cabinetLeadTime">{cab.lead_time} (days)</td>
          <td className="cabinetStock">{cab.cabinet_stock}</td>
          <td className="cabinetSalesFlow">{cab.sales_flow}</td>
          <td className="cabinetSalesLeftDays">{leftDays} (days)</td>
        </tr>
      );
    });

    return (
      <>
      <div className="container-fluid">
        <button className="btn btn-success create-new-user" onClick={() => this.refresh()}><FaCalendarPlus /> Refresh </button>

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

        <h1 className="alert-message">Below cabinets are ones that need to be reordered.</h1>

        <table className="table table-bordered user-table" ref={el => (this.componentRef = el)}>
            <thead>
              <tr>
                <th>#</th>
                <th>Cabinet Name</th>
                <th>Cabinet Description</th>
                <th>Cabinet Supplier</th>
                <th>Lead Time</th>
                <th>Cabinet Current Total Stock</th>
                <th>Cabinet Sales Flow</th>
                <th>Left Days To Empty</th>
              </tr>
            </thead>
            <tbody>
              {cabinetList.length !== 0 ? cabinetList : <tr><td>No cabinets that need to be reordered.</td></tr>}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default AlertsComponent;