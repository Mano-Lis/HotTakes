const mongoose = require('mongoose');
const MongooseErrors = require('mongoose-errors');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true,
        validate: {
            validator: validator.isEmail
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
userSchema.plugin(MongooseErrors);

module.exports = mongoose.model('User', userSchema);