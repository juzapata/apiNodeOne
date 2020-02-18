const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// referenciando o authController e passando o objeto app. Não podemos criar um novo, pois ele só pode ter um por aplicação, então essa é uma forma de repassar, para podermos usar lá no authController também
console.log('VAI FAZER O REQUIRE DO AUTH CONTROLLER');

require('./app/controllers/index')(app);

// require('./app/controllers/authController')(app);
// require('./app/controllers/projectController')(app);

app.listen(3000);


