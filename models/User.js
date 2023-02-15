const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true,
        validate: {
            validator: (email) => validator.isEmail(email)
        },
        message: props => `${props.value} is not a valid email!`
    },
    password: { 
        type: String, 
        required: true,
        minLength: 4
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);