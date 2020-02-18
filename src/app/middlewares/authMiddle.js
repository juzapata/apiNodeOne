const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json')

module.exports = (req, res, next) => {
    console.log('ESTA NO MIDDLEWARE');
    const authHeader = req.headers.authorization;
    // aqui nós que vamos mandar esse header authorization pelo Isnomina ou browser. Então lá, vamos setar ele, e enviar, e esse header vai vir na requisição para pegarmos.
    console.log('Token no Header', authHeader);

    // VERIFICAÇOES BASICAS DO TOKEN
    if (!authHeader) {
        return res.status(401).send({ error: 'Não foi recebido nenhum token' });
    }
    // vamos fazer o split baseado no padrão que usados esse token no Header, que é Bearer 'numero do token'
    const parts = authHeader.split(' ');
    console.log("token splitted", parts);
    console.log("length", parts.length);
    if (parts.length !== 2) {
        return res.status(401).send({ error: 'erro de Token' });
    }
    const [scheme, token] = parts;
    // scheme = Bearer
    // token = "askjdhasjdhaskjdhksajh" - "numero do token"
    console.log('TESTE DO REGEX', /^Bearer$/i.test(scheme));
    if (!/^Bearer$/i.test(scheme)) {
        // aqui estamos usando o regex para pegar a palavra Bearer, e usando o test(), pra testar se ele existe, se não existir, vai devolver um erro.
        return res.status(401).send({ error: 'Token mal formatado' });
    }
    //Essas validações SAO RAPIDAS DE SEREM PROCESSADAS. Não consomem processamento. Melhor fazer o máximo de verifições, antes de vc chamar o método de validação do jwt, esse sim que consome mais processamento.

    // VERIFICAÇAO FINAL - com jwt e a nossa hash unica da aplicação
    // aqui vamos usar o token que vem do header, que pegamos com o split, e a nossa hash unica da aplicação

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        // o err é pra caso ele nao retorne nada 
        // o decoded é o objeto que contém Id do usuário, sá que quando criamos o token, com generateToken, passamos o parametro Id. 
        if (err) {
            return res.status(401).send({ error: 'Invalid token' });
        }
        // incluir a informação do User Id nas próximas requisições pro Controller
        req.userId = decoded.id;
        return next();
    });
    // só vamos chamar o next, se o próximo passo é o projectController, ou seja se ele estiver logado
    next();
}