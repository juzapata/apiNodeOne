const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const {host, port, user, pass} = require('../config/mail.json');

// configuração do Nodemailer, onde estmos pegando de um JSON que criamos, as informações da nossa conta que veio no mailTrap, pra fins de teste
const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
  });

  // template de e-mail, configuração da forma como vamos fazer os templates que vamos enviar

  const handlebarOptions = {
    viewEngine: {
      extName: '.html',
      partialsDir: path.resolve('./src/resources/mail/'),
      layoutsDir: path.resolve('./src/resources/mail/'),
      defaultLayout: '',
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
  }
  transport.use('compile', hbs(handlebarOptions))




//   transport.use('compile', hbs({
//     viewEngine: {
//         extName: '.html',
//         partialsDir: path.resolve('./src/resources/mail'),
//     },
//     viewPath: path.resolve('./src/resources/mail'),
//     extName: '.html'
// })); 


module.exports = transport;

