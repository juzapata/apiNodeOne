const mongoose = require('../../database');
const bcrypt = require('bcryptjs');
// definindo o modelo, ou esquema que os usuários vão estar dentro do meu banco de dados

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true 
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
// essa propriedade do schema, select, é pra gente setar caso a gente queira que não seja enviado para a requisição, se for false. 

// esse método pre é uma função do mongoose, que serve pra gente dizer pra ele fazer alguma coisa antes de, no caso é salvar.  
UserSchema.pre('save', async function(next){
    // o this nesse caso, se refere ao this do contexto do UserSchema, no caso do objeto que está sendo salvado, então você pode manipular.
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
})

console.log('ENTROU NO USER.JS');
const User = mongoose.model('User', UserSchema);

module.exports = User;