const fs = require('fs');
const path = require('path');
// criamos esse arquivo pra centralizar todos os controles que vao receber o app do express pra poder usar
module.exports = app => {
    fs.readdirSync(__dirname)
        .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js")))
        .forEach(file => require(path.resolve(__dirname, file))(app));
    // o forEach pra fazermos um require de cada controller e passar o (app)
}

