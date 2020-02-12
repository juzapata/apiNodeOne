const express = require('express');
const User = require('../model/User');

const router = express.Router();
// definição de rotas só para usuário

console.log('TA NO AUTH CONTROLLER JS');
// vai criar um novo usuário quando ele chamar essa rota
router.post('/register', async (req, res)=>{
    try{
        const {email} = req.body; // aqui está acessando a propriedade email dentro do req.body

        if (await User.findOne({email}))
            return res.status(400).send({error: 'Usuário já existe'}); 
        // pegando todos os parametros que o usuário está usando, e repassar para esse create(), método do objeto User do mongoose.
        const user = await User.create(req.body)// todos os parametros vao estar no req.body
        user.password = undefined; // aqui estamos fazendo manualmente com que o usuário não veja a sua senha de volta, mesmo que encriptada 
        return res.send({ user });
    } catch (error){
        return res.status(400).send({error});
    }
});

// precisamos referenciar o authController no index principal
// depois que repassamos
module.exports = app => app.use('/auth', router);
// agora podemos usar o app aqui, então precisamos definir uma rota, pra quando ela for chamada lá, ela chamar a nossa rota 'register', então essa rota é a '/auth'
