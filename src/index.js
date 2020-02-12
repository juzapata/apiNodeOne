const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// referenciando o authController e passando o objeto app. Não podemos criar um novo, pois ele só pode ter um por aplicação, então essa é uma forma de repassar, para podermos usar lá no authController também
app.get('/', (req, res)=>{
    console.log(req.body);
    res.send('OK')
})
console.log('VAI FAZER O REQUIRE DO AUTH CONTROLLER');
require('./controllers/authController')(app);

app.listen(3000);


 