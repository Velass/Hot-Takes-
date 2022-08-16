const Sauce = require("../models/Sauces")
const fs = require('fs');


// Controllers pour créer des sauces

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => { res.status(201).json({ message: 'sauce enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

//Controllers pour modifier des sauces
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'sauce modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// Controllers pour supprimer des sauces
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'sauce supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};
// Apparition des sauces
exports.oneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.allSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}


// Système de likes et de dislikes
exports.noteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {

            const user_is_liker = sauce.usersLiked.includes(req.body.userId)
            const user_is_disliker = sauce.usersDisliked.includes(req.body.userId)

            // Si l'utilisateur veut liker la sauce
            if (req.body.like === 1 && !user_is_liker) {
                // Incrémente likes, et ajoute userId dans la liste userLiked
                Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { likes: 1 },
                    $push: { usersLiked: req.body.userId, }
                }).then(() => {
                    // Si l'utilisateur a disliké la sauce précédemment
                    if (user_is_disliker) {
                        // Décrémente dislikes, enlève user de la liste userDisliked
                        Sauce.updateOne({ _id: req.params.id }, {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: req.body.userId, }
                        })
                            .then(() => { res.status(200).json({ message: "user remove dislike and like" }) })
                            .catch(error => res.status(401).json({ error }));
                    }
                    res.status(200).json({ message: "user like" })
                }
                )
                    .catch(error => res.status(401).json({ error }));
            }
            // Incrémente dislikes, et ajoute user dans userDisliked
            else if (req.body.like === -1 && !user_is_disliker) {
                Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { dislikes: 1 },
                    $push: { usersDisliked: req.body.userId, }
                }).then(() => {
                    // Si l'utilisateur a précédemment liké la sauce
                    if (user_is_liker) {
                        // Décrémente likes, et enlève user de userLiked
                        Sauce.updateOne({ _id: req.params.id }, {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: req.body.userId, }
                        })
                            .then(() => { res.status(200).json({ message: "user remove like and dislike" }) })
                            .catch(error => res.status(401).json({ error }));
                    }
                    res.status(200).json({ message: "user dislike" })
                }
                )
                    .catch(error => res.status(401).json({ error }));
            }
            // Si l'utilisateur veut enlever son like/dislike 
            else if (req.body.like === 0) {
                // Si l'utilisateur a précédemment liké la sauce
                // Décrémente likes, enlève l'user de la liste userLiked
                if (user_is_liker) {
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { likes: -1 },
                        $pull: { usersLiked: req.body.userId, }
                    }).then(() => { res.status(200).json({ message: "user remove like" }) })
                        .catch(error => res.status(401).json({ error }));
                }
                // Si l'user a précédemment disliké la sauce
                // Décrémente dislikes, enlève user de la liste userDisliked
                else if (user_is_disliker) {
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: req.body.userId, }
                    }).then(() => { res.status(200).json({ message: "user remove dislike" }) })
                        .catch(error => res.status(401).json({ error }));
                }
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}