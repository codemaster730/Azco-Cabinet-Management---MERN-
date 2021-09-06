const Report = require("../../models/Report");
const Cabinet = require("../../models/Cabinet");
const Unit = require("../../models/Unit");
const User = require("../../models/User");

module.exports = app => {
  app.get("/api/reports", (req, res, next) => {
    let usersTmp = [];
    let cabinetsTmp = [];
    let unitsTmp = [];

    Cabinet.find()
      .exec()
      .then(cabinets => {
        cabinetsTmp = cabinets;
        // next();
      })
      .catch(err => next(err));

    Unit.find()
      .exec()
      .then(units => {
        unitsTmp = units;
        // next();
      })
      .catch(err => next(err));

    User.find()
      .exec()
      .then(users => {
        usersTmp = users;
        // next();
      })
      .catch(err => next(err));

    Report.find()
      .sort({'date': 1})
      .exec()
      .then(report => {
        let data = {
          users: usersTmp,
          cabinets: cabinetsTmp,
          units: unitsTmp,
          reports: report
        }
        res.json(data)
      })
      .catch(err => next(err));
  });

  app.post("/api/reports", function (req, res, next) {
    let data = {
      'type': req.body.type,
      'inout': req.body.inout,
      'move_stock': req.body.move_stock,
      'user_id': req.body.user_id,
      'move_name': req.body.move_name
    }

    if(req.body.type == "Cabinets"){
      Cabinet.findOne({_id: req.body.move_name})
        .exec()
        .then(cabinet => {
          if(req.body.inout == "Incoming") {
            cabinet.cabinet_stock += Number(req.body.move_stock);
          }
          if(req.body.inout == "Outgoing") {
            cabinet.cabinet_stock -= Number(req.body.move_stock);
            cabinet.out_stock += Number(req.body.move_stock);
          }

          if(cabinet.cabinet_stock == 0) {
            cabinet.sales_flow = 0;
            cabinet.is_permitted = false;
          }
  
          cabinet
            .save()
            .then(() => console.log("cabinet stock changed."))
            .catch(err => next(err));
        })
        .catch(err => next(err));
    }

    if(req.body.type == "Units"){
      Unit.findOne({_id: req.body.move_name})
      .exec()
      .then(unit => {
        if(req.body.inout == "Incoming") {
          unit.unit_stock += Number(req.body.move_stock);
          Cabinet.findOne({_id:unit.cabinet_id})
          .exec()
          .then(cabinet => {
            cabinet.out_stock -= req.body.move_stock;
            cabinet
            .save()
            .then(() => console.log("cabinet stock changed."))
            .catch(err => next(err));
          })
          .catch(err => next(err));
        }
        if(req.body.inout == "Outgoing") {
          unit.unit_stock -= Number(req.body.move_stock);
        }

        unit
          .save()
          .then(() => console.log("unit stock changed."))
          .catch(err => next(err));
      })
      .catch(err => next(err));
    }

    const report = new Report(data);
    report
      .save()
      .then(() => res.json(report))
      .catch(err => next(err));
  });

  app.put("/api/reports/:id", (req, res, next) => {
    if(req.body.type == "Cabinets") {
      Cabinet.findById(req.body.product_id)
      .exec()
      .then(cabinet => {
        let afterStock = req.body.move_stock;
        let beforeStock = req.body.editMove_stock;

        if((beforeStock - afterStock) < 0) {
          cabinet.cabinet_stock += beforeStock - afterStock;
        }

        cabinet.out_stock -= beforeStock - afterStock;

        if(cabinet.cabinet_stock == 0) {
          cabinet.sales_flow = 0;
          cabinet.is_permitted = false;
        }

        cabinet
          .save()
          .then(() => next())
          .catch(err => next(err));
      })
      .catch(err => next(err));
    }else{
      Unit.findById(req.body.product_id)
      .exec()
      .then(unit => {
        let afterStock = req.body.move_stock;
        let beforeStock = req.body.editMove_stock;

        unit.unit_stock -= beforeStock - afterStock;

        unit
          .save()
          .then(() => next())
          .catch(err => next(err));
      })
      .catch(err => next(err));
    }

    Report.findById(req.params.id)
      .exec()
      .then(report => {
        report.move_stock = req.body.move_stock;

        report
          .save()
          .then(() => res.json(report))
          .catch(err => next(err));
      })
      .catch(err => next(err));
  });
};
