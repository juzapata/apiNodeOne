const mongoose = require('mongoose');

// vai se conectar com o banco de dados Mongo.
mongoose.connect("mongodb://localhost/noderest", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
mongoose.Promise = global.Promise;


module.exports = mongoose;
