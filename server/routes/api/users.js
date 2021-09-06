const User = require("../../models/User");
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');

module.exports = app => {
  app.get("/api/users", (req, res, next) => {
    User.find()
      .sort({'username': 1})
      .exec()
      .then(user => res.json(user))
      .catch(err => next(err));
  });

  app.put("/api/resetPassword", (req, res, next) => {
    User.findOne({'role' : 'SuperAdmin'})
      .exec()
      .then(user => {
        user.password = req.body.new_password;

        user
          .save()
          .then(() => res.json({"success": true}))
          .catch(err => next(err));
      })
      .catch(err => next(err));
  });

  app.post("/api/login", function (req, res, next) {
    var token;
    var decodedToken;
    User.findOne({username: req.body.username, password: req.body.password})
      .exec()
      .then(user => {
        if(user != null) {
          token = jwt.sign({ username: user.username }, 'azco');
          decodedToken = jwtDecode(token);
          res.status(201);
          res.json({
              'token': token,
              'decodedToken': decodedToken,
              'role' : user.role,
              'user_id' : user._id
          });
        }else{
          res.json(null)
        }
      })
      .catch(err => next(err));
  });

  app.post("/api/users", function (req, res, next) {
    let data = {
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
        email: req.body.email
        // role: "SuperAdmin" 
    }
    const user = new User(data);
    user
      .save()
      .then(() => res.json(user))
      .catch(err => next(err));
  });

  app.delete("/api/users/:id", function (req, res, next) {
    User.findOneAndDelete({ _id: req.params.id })
      .exec()
      .then(() => res.json())
      .catch(err => next(err));
  });

  app.put("/api/users/:id", (req, res, next) => {
    User.findById(req.params.id)
      .exec()
      .then(user => {
        user.username = req.body.username;
        user.password = req.body.password;
        user.role = req.body.role;
        user.email = req.body.email;

        user
          .save()
          .then(() => res.json(user))
          .catch(err => next(err));
      })
      .catch(err => next(err));
  });
};
