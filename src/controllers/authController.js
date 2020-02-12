const express = require('express');
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretHash = require('../config/auth.json')


const router = express.Router();
// definição de rotas só para usuário


// função para gerar token
function generateToken(params = {}){
    // esse segundo parâmetro do método sign tem que ser uma hash única da aplicação, não pode ter igual em nenhuma outra, então vamos criar uma pasta config, com auth.json, e lá a hash única
    // o params no caso vai ser o objeto do id
    return jwt.sign(params, secretHash.secret, {
        // passar outra configuração de quanto tempo o token vai durar, no caso, um dia.
        expiresIn: 86400
    });
}// assim ele vai gerar um token, baseado na Hash da aplicação e na Id do usuário



console.log('TA NO AUTH CONTROLLER JS');
// vai criar um novo usuário quando ele chamar essa rota
router.post('/register', async (req, res)=>{
    try{
        const {email} = req.body; // aqui está acessando a propriedade email dentro do req.body

        if (await User.findOne({email})){
            return res.status(400).send({error: 'Usuário já existe'}); 
        }
        // pegando todos os parametros que o usuário está usando, e repassar para esse create(), método do objeto User do mongoose.
        const user = await User.create(req.body)// todos os parametros vao estar no req.body
        user.password = undefined; // aqui estamos fazendo manualmente com que o usuário não veja a sua senha de volta, mesmo que encriptada 
        
        
        return res.send({ 
            user,
            token: generateToken({id: user.id})
         }); // aqui, também colocamos o token de autenticação para quando novo usuário se cadastrar, ele também receber o token 
    } catch (error){
        return res.status(400).send({error});
    }
});

// autenticação do usuário
router.post('/authenticate', async (req, res)=>{
    // não da pra aceessar assim, porque assim retorna o valor específico e não o objeto, e função do findOne precisa pegar um objeto
    // const email = req.body.email;
    // const password = req.body.password;

    const {email, password} = req.body;
    const user = await User.findOne({email}).select('+password');
    //checando se existe usuário
    if (!user){
        return res.status(400).send({ error: 'Usuário não existe'});
    }
    // checar se a senha que ele colocou é a senha que ele cadastrou
    if (!await bcrypt.compare(password, user.password)){
        // tem await nessa função bcrypt porque ela é assincrona
        return res.status(400).send({error: "Senha inválida"});
    }

    user.password = undefined;

    // assim vamos retornar esse token pro usuário    
    
    res.send({ 
        user, 
        token: generateToken({ id: user.id }) 
    }); 
});


// precisamos referenciar o authController no index principal
// depois que repassamos
module.exports = app => app.use('/auth', router);
// agora podemos usar o app aqui, então precisamos definir uma rota, pra quando ela for chamada lá, ela chamar a nossa rota 'register', então essa rota é a '/auth'
