const Unit = require("../../models/Unit");

module.exports = app => {
  app.get("/api/units", (req, res, next) => {
    Unit.find()
      .exec()
      .then(units => res.json(units))
      .catch(err => next(err));
  });

  app.post("/api/units", function (req, res, next) {
    let data = {
        unit_name: req.body.unit_name,
        cabinet_id: req.body.cabinet_id,
        unit_stock: req.body.unit_stock
    }
    const unit = new Unit(data);
    unit
      .save()
      .then(() => res.json(unit))
      .catch(err => next(err));
  });

  app.delete("/api/units/:id", function (req, res, next) {
    Unit.findOneAndDelete({ _id: req.params.id })
      .exec()
      .then(() => res.json())
      .catch(err => next(err));
  });

  app.put("/api/units/:id", (req, res, next) => {
    Unit.findById(req.params.id)
      .exec()
      .then(unit => {
        unit.unit_name = req.body.unit_name;
        unit.cabinet_id = req.body.cabinet_id;
        
        unit
          .save()
          .then(() => res.json(unit))
          .catch(err => next(err));
      })
      .catch(err => next(err));
  });
};
