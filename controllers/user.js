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
            res.status(400).json({error});
        }
    } catch (error) {
        res.status(500).json({error});
    }
};

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (user === null) res.status(401).json({message: 'Paire id/mot de passe icorrecte'});
        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) res.status(401).json({message: 'Paire id/mot de passe icorrecte'});
        res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                {userId: user._id},
                'RANDOM_GENERATED_TOKEN',
                {expiresIn: '24h'}
            )
        });
    } catch (error) {
        res.status(500).json({error});
    }
};