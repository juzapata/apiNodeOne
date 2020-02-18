// node modules
const express = require('express');
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

// local documents
const secretHash = require('../../config/auth.json')


const router = express.Router();

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

// rota que a pesaso vai quando esqueci minha senha
router.post('/forgot_password', async (req, res)=>{
    const {email} = req.body;
    try{
        // aqui assim como nas outras 3 rotas acima usando o findOne para procurar se existe esse email
        const user = await User.findOne({ email });
        // se ele não encontrar, vamos retornar a mesma coisa que retornarmos na autenticação
        if (!user){
            return res.status(400).send({ error: 'Usuário não existe'});
        }
        // agora vamos gerar um token para mandar pro e-mail da pessoa, que quer resetar a senha. E vamos usar o crypto que ja vem com modules do Node.
        const token = crypto.randomBytes(20).toString('hex');
        // geraremos um token entao de 20 caracteres em string hexadecimal

        // agora vamos gerar a data de expiração pra esse token
        const now = new Date();
        now.setHours(now.getHours() + 1);
        // data de uma hora de expiração
        // agora precisamos salvar esse token, e o lugar mais recomendado é junto com o Model do usuário, ou seja o JSON dele, onde contem todas as informações dele. Então precisamo fazer isso la no Schema, colocar novas propriedades
        // depois ter feito isso vamos alterar o usuário o nosso usuário que a gente acabou de gerar o token, usando outro método que vem do constructor do User
        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        })

        console.log('TOKEN E DATA DE EXPIRACAO DO RESET DA SENHA', token, now);
        console.log('EMAIL', email);
        
        mailer.sendMail({
           // pra quem eu vou enviar o email? pro email que recebemos lá em cima, na requisição, no req.body
           to: email,
           from: 'juliamzapata@gmail.com',
           template: 'auth/forgot_password',
           context: { token } 
        }, (err) =>{
            console.log(err);
            if (err){
                return res.status(400).send({error: 'Não pode ser alterada a senha'});
            }
            return res.send('Enviado');
        }
        )



    }catch(err){
        console.log(err);
        res.status(400).send({err: 'Erro no forgot passaword tente de novo'})
    }
})

// precisamos referenciar o authController no index principal
// depois que repassamos
module.exports = app => app.use('/auth', router);
// agora podemos usar o app aqui, então precisamos definir uma rota, pra quando ela for chamada lá, ela chamar a nossa rota 'register', então essa rota é a '/auth'
