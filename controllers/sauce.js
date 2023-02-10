const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.getAllSauces = async (req, res) => {
    try {
        const sauces = await Sauce.find();
        res.status(200).json(sauces);
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.getOneSauce = async (req, res) => {
    try {
        const sauce = await Sauce.findOne({_id: req.params.id });
        res.status(200).json(sauce);
    } catch (error) {
        res.status(404).json(error);
    }
}

exports.createSauce = async (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    try {
        await sauce.save();
        res.status(201).json({ message: 'Sauce enregistrée !'});
    } catch(error) {
        res.status(400).json({ error });
    }
}

exports.deleteSauce = async (req, res) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id });
        if (sauce.userId !== req.auth.userId) res.status(401).json({ message: 'Not authorized' });
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, async () => {
            try {
                await Sauce.deleteOne({_id: req.params.id});
                res.status(200).json({ message: 'Sauce supprimée' });
            } catch (error) {
                res.status(401).json({error});
            }
        });
    } catch (error) {
        res.status(500).json({error});
    }
}

exports.modifySauce = async (req, res) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body}

    try {
        const sauce = await Sauce.findOne({ _id: req.params.id });
        if (sauce.userId !== req.auth.userId) res.status(401).json({ message: 'Not authorized' });
        try {
            await Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id});
            res.status(200).json({message: 'Objet modifié!'})
        } catch (error) {
            res.status(401).json({error});
        }
    } catch (error) {
        res.status(400).json({error});
    }
}

exports.likeSauce = async (req, res) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id });
        console.log
        if (req.body.like === 1 && !sauce.usersLiked.includes(req.body.userId)) {
            sauce.likes++;
            sauce.usersLiked.push(req.body.userId);
            sauce.save();
            res.status(200).json({message: 'Vote pris en compte'});
            return;
        }

        if (req.body.like === -1 && !sauce.usersDisliked.includes(req.body.userId)) {
            sauce.dislikes++;
            sauce.usersDisliked.push(req.body.userId);
            sauce.save();
            res.status(200).json({message: 'Vote pris en compte'});
            return;
        }

        if (req.body.like === 0 && sauce.usersLiked.includes(req.body.userId)) {
            sauce.likes--;
            const index = sauce.usersLiked.findIndex(el => el === req.body.userId);
            sauce.usersLiked.splice(index, 1);
            sauce.save();
            res.status(200).json({message: 'Vote pris en compte'});
            return; 
        }

        if (req.body.like === 0 && sauce.usersDisliked.includes(req.body.userId)) {
            sauce.dislikes--;
            const index = sauce.usersDisliked.findIndex(el => el === req.body.userId);
            sauce.usersDisliked.splice(index, 1);
            sauce.save();
            res.status(200).json({message: 'Vote pris en compte'}); 
            return;
        }

        if (req.body.like !== 0 && (sauce.usersLiked.includes(req.body.userId) || sauce.usersDisliked.includes(req.body.userId))) {
            res.status(401).json({message: 'Vous avez déjà voté'});
            return;
        }
    } catch (error) {
        res.status(500).json({error});
    }
}