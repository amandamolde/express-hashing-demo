const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username: {type: String,
                minlength: 5},
    password: String
})
const User = mongoose.model('User', UserSchema);

UserSchema.pre('save', async function(next){
    const existingUser = await User.findOne({username: this.username})
    if(!existingUser){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

module.exports = User
