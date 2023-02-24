const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User ({
            email: req.body.email,
            password: hash
        });
        try {
            await user.save();
            res.status(201).json({message: 'Utilisateur créé'});
        } catch (error) {
            res.status(error.statusCode).json({error});
        }
    } catch (error) {
        res.status(error.statusCode).json({error});
    }
};

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        // prevent timing attack (hash = 'maman')
        const valid = await bcrypt.compare(req.body.password, user === null ? '$2a$10$rRDnzn5B6gl6waDsSzsHGeuLMe6znAfc0Y4hhec0DN/GMlQqV1SRa' : user.password);
        if (user === null || !valid) {
            res.status(401).json({message: 'Paire id/mot de passe icorrecte'});
            return;
        }
        res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                {userId: user._id},
                process.env.TOKEN_STRING,
                {expiresIn: '24h'}
            )
        });
    } catch (error) {
        res.status(error.statusCode).json({error});
    }
};