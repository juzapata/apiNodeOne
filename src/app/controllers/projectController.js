const express = require('express');
const authMiddleware = require('../middlewares/authMiddle');

const router = express.Router();

console.log('ESTA NO PROJECTCONTROLLER');

/* O usuário só pode fazer essa requisição caso esteja logado. Esse projectController vai servir pra isso. 
O middleware vai servir pra isso. Ele vai fazer a intermediação entre o usuário, e a resposta da aplicação. Em outras palavras, ele vai interceptar o req e o res, antes dele chegar nessa rota get '/project/'. 
*/

router.use(authMiddleware);

router.get('/', (req, res) => {
    // como usamos o setamos o req, no middleware, e colocamos como uma de suas propriedades o userId, podemos pegar ele aqui.
    res.send({
        ok: true,
        user: req.userId
    });
    // assim com essa Id do usuário que vem na requisição, eu não vou precisar pegar do Header ou criar variável pra isso. E caso eu precise pegar alguma outra informação, é só colocar la a função generateToken, junto com o Id, e pegar da mesma forma. 
})

module.exports = app => app.use('/projects', router);

