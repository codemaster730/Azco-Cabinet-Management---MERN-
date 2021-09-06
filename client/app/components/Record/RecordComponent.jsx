import React from 'react';
 
class RecordComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      inout: '',
      type: '',
      selectCabinet: '',
      selectCabinetName: '',
      selectUnit: '',
      selectUnitName: '',
      cabinets: [],
      units: [],
      currentStock: 0,
      stockOut: false,
      isPermitted: false
    }

    this.cntInput = React.createRef();

    this.unitSelect = this.unitSelect.bind(this);
    this.cabinetSelect = this.cabinetSelect.bind(this);
  }

  componentDidMount() {
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
  }

  incoming() {
    this.setState({
      step: 2,
      inout: 'in'
    });
  }

  outgoing() {
    this.setState({
      step: 2,
      inout: 'out'
    });
  }

  cabinet() {
    this.setState({
      step: 3,
      type: 'Cabinets'
    });
  }

  unit() {
    this.setState({
      step: 3,
      type: 'Units'
    });
  }

  unitSelect(id) {  
    let units = this.state.units;
    let unit = units[id];
    this.setState({
      step: 4,
      selectUnit: unit._id,
      selectUnitName: unit.unit_name,
      currentStock: unit.unit_stock
    });
  }

  cabinetSelect(id) {  
    let cabinets = this.state.cabinets;
    let cabinet = cabinets[id];
    this.setState({
      step: 4,
      selectCabinet: cabinet._id,
      selectCabinetName: cabinet.cabinet_name,
      currentStock: cabinet.cabinet_stock,
      isPermitted: cabinet.is_permitted
    });
  }

  inout() {
    this.setState({
      step: 1,
      inout: '',
      type: '',
      selectCabinet: '',
      selectCabinetName: '',
      selectUnit: '',
      selectUnitName: '',
      currentStock: 0,
      isPermitted: false
    });
  }

  type() {
    const step = this.state.step;
    if(step > 1) {
      this.setState({
        step: 2,
        type: '',
        selectCabinet: '',
        selectCabinetName: '',
        selectUnit: '',
        selectUnitName: '',
        currentStock: 0,
        isPermitted: false
      });
    }
  }

  product() {
    const step = this.state.step;
    if(step > 2) {
      this.setState({
        step: 3,
        selectCabinet: '',
        selectCabinetName: '',
        selectUnit: '',
        selectUnitName: '',
        currentStock: 0,
        isPermitted: false
      });
    }
  }

  cntSave() {
    let cnt = this.cntInput.current.value;
    let inout = this.state.inout;
    let type = this.state.type;
    let selectUnit = this.state.selectUnit;
    let selectCabinet = this.state.selectCabinet;
    let user_id = localStorage.getItem('user_id');

    let data = {};

    if(type == "Cabinets") {
      data = {
        'type': type,
        'inout': inout == 'in' ? "Incoming" : "Outgoing",
        'move_stock': cnt,
        'user_id': user_id,
        'move_name': selectCabinet
      }
    }

    if(type == "Units") {
      data = {
        'type': type,
        'inout': inout == 'in' ? "Incoming" : "Outgoing",
        'move_stock': cnt,
        'user_id': user_id,
        'move_name': selectUnit
      }
    }

    if(cnt > this.state.currentStock && inout == "out") {
      if(inout == "out") {
        this.setState({
          stockOut: true
        });
      }
    }else{
      this.setState({
        stockOut: false
      });
      fetch("/api/reports", { 
        method: "POST",
        headers: {
        'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data) })
      .then(res => res.json())
      .then(json => {
        this.setState({
          step: 1,
          inout: '',
          type: '',
          selectCabinet: '',
          selectCabinetName: '',
          selectUnit: '',
          selectUnitName: ''
        })
        window.location.href = '/record';
      });
    }
  }

  plus() {
    let inout = this.state.inout;
    if(this.cntInput.current.value < this.state.currentStock){
        this.cntInput.current.value++ ;
    }else{
      if(inout == "out") {
        this.setState({
          stockOut: true
        });
      }else{
        this.cntInput.current.value++ ;
      }
    }
  }

  minus() {
    if(this.cntInput.current.value > 1){
      this.cntInput.current.value--;  
    }    
  }

  render() {
    const step = this.state.step;
    const inout = this.state.inout;
    const type = this.state.type;
    const selectCabinet = this.state.selectCabinet;
    const selectCabinetName = this.state.selectCabinetName;
    const selectUnit = this.state.selectUnit;
    const selectUnitName = this.state.selectUnitName;
    const units = this.state.units;
    const cabinets = this.state.cabinets;

    const unitList = units.map((unit, index) => {      
        return (
          <div className="products" key={unit._id} onClick={() => this.unitSelect(index)}>
            {unit.unit_name}
          </div>
        );
    });

    const cabinetList = cabinets.map((cabinet, index) => {
      return (
        <div className="products" key={cabinet._id} onClick={() => this.cabinetSelect(index)}>
          {cabinet.cabinet_name}
        </div>
      );
    });
    
    return (
      <div className="container-fluid">
        <div className="well">
          <div className="progress">
            <div className="step cursor-active" onClick={() => this.inout()}>IN/OUT</div>
            <div className={step > 1 ? "step cursor-active" : "step cursor-passive"} onClick={() => this.type()}>TYPE</div>
            <div className={step > 2 ? "step cursor-active" : "step cursor-passive"} onClick={() => this.product()}>{type == "" ? "CABINET/UNIT" : type.toUpperCase()}</div>
            <div className={step > 3 ? "step cursor-active" : "step cursor-passive"} >QUANTITY</div>
          </div>
          <div className="mb-20"></div>
          <div className="filters">
            {
              inout == 'in' ? <button className="btn btn-success" disabled>Incoming</button> : null
            }
            {
              inout == 'out' ? <button className="btn btn-danger" disabled>Outgoing</button> : null
            }
            {
              type == 'Cabinets' ? <button className="btn btn-info" disabled>Cabinets</button> : null
            }
            {
              type == 'Units' ? <button className="btn btn-warning" disabled>Units</button> : null
            }
            {
              selectUnit != '' ? <button className="btn btn-danger" disabled>{selectUnitName}</button> : null
            }
            {
              selectCabinet != '' ? <button className="btn btn-danger" disabled>{selectCabinetName}</button> : null
            }
          </div>
          <div className="mb-20"></div>
          {
            step == 1 ? <div className="inout">
            <button className="btn btn-success incoming" onClick={() => this.incoming()}>Incoming</button>
            <button className="btn btn-danger outgoing" onClick={() => this.outgoing()}>Outgoing</button>
          </div> : null
          }
          <div className="mb-20"></div>
          {
            step == 2 ? <div className="productType">
            <button className="btn btn-info type" onClick={() => this.cabinet()}>Cabinets</button>
            <button className="btn btn-warning type" onClick={() => this.unit()}>Units</button>
          </div> : null
          }
          <div className="mb-20"></div>
          {
            step == 3 && type == 'Cabinets' ? <div className="productList">
              {cabinetList}
            </div> : null
          }
          {
            step == 3 && type == 'Units' ? <div className="productList">
              {unitList}
            </div> : null
          }
          <div className="mb-20"></div>
          {
            step == 4 ? <div className="productCount">
              <div className="currentStock">
                Current Stock:  {this.state.currentStock}
              </div>
              <div className="permit-message">
                {
                  !this.state.isPermitted && inout == "out"  && type == "Cabinets" ? <h5 className="alert-message">This cabinet is not permitted to sale yet.</h5> : null
                }
              </div>
              <div className="cnt">
                <button className="btn btn-primary" onClick={() => this.minus()}>-</button>
                <input className={this.state.stockOut ? "p_cnt required" : "p_cnt" } type="number" defaultValue={1}  min="1" max="10000" ref={this.cntInput} />
                <button className="btn btn-primary" onClick={() => this.plus()}>+</button>
              </div>
              <div className="mb-60"></div>
              <div style={{'width': '100%', 'textAlign':'center'}}>
                <button className="btn btn-success cnt_save" onClick={() => this.cntSave()} disabled={!this.state.isPermitted && inout == "out" && type == "Cabinets"}>Save</button>
              </div>
            </div> : null
          }
        </div>
      </div>
    );
  }
}

export default RecordComponent;