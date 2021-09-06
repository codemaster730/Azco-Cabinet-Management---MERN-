const Cabinet = require("../../models/Cabinet");

module.exports = app => {
  app.get("/api/cabinets", (req, res, next) => {
    Cabinet.find()
      .exec()
      .then(cabinet => res.json(cabinet))
      .catch(err => next(err));
  });

  app.post("/api/cabinets", function (req, res, next) {
    let data = {
        cabinet_name: req.body.cabinet_name,
        cabinet_desc: req.body.cabinet_desc,
        cabinet_supplier: req.body.cabinet_supplier,
        lead_time: req.body.lead_time,
        cabinet_stock: req.body.cabinet_stock
    }
    const cabinet = new Cabinet(data);
    cabinet
      .save()
      .then(() => res.json(cabinet))
      .catch(err => next(err));
  });

  app.delete("/api/cabinets/:id", function (req, res, next) {
    Cabinet.findOneAndDelete({ _id: req.params.id })
      .exec()
      .then(() => res.json())
      .catch(err => next(err));
  });

  app.put("/api/cabinets/:id", (req, res, next) => {
    Cabinet.findById(req.params.id)
      .exec()
      .then(cabinet => {
        cabinet.cabinet_name = req.body.cabinet_name;
        cabinet.cabinet_desc = req.body.cabinet_desc;
        cabinet.cabinet_supplier = req.body.cabinet_supplier;
        cabinet.lead_time = req.body.lead_time;

        cabinet
          .save()
          .then(() => res.json(cabinet))
          .catch(err => next(err));
      })
      .catch(err => next(err));
  });

  app.put("/api/cabinets/permit/:id", (req, res, next) => {
    Cabinet.findById(req.params.id)
      .exec()
      .then(cabinet => {
        cabinet.is_permitted = true;
        cabinet.sales_flow = Math.floor(cabinet.cabinet_stock / 365);

        cabinet
          .save()
          .then(() => res.json(cabinet))
          .catch(err => next(err));
      })
      .catch(err => next(err));
  });
};
