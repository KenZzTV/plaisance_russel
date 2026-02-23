/**
 * @file users.js
 * @description Routes Express pour la gestion des utilisateurs (CRUD et authentification).
 */

const express = require('express');
const router = express.Router();
const service = require('../services/user');
const private = require('../middlewares/private');
const User = require('../models/user');

/**
 * Récupère et affiche la liste de tous les utilisateurs.
 * @name GET /users
 * @function
 * @param {Object} req - Objet de requête Express.
 * @param {Object} res - Objet de réponse Express.
 * @access Privé
 */
router.get('/', private.checkJWT, async (req, res) => {
    try {
        const users = await User.find();
        res.render('user_manager', { users });
    } catch (error) {
        res.status(500).send("Erreur de récupération");
    }
});

/**
 * Crée un nouvel utilisateur.
 * @name POST /users
 * @function
 * @see module:services/user.add
 */
router.post('/', service.add);

/**
 * Authentifie un utilisateur.
 * @name POST /users/login
 * @function
 * @see module:services/user.authenticate
 */
router.post('/login', service.authenticate);

/**
 * Récupère et affiche les détails d'un utilisateur par son email.
 * @name GET /users/:email
 * @function
 * @param {Object} req - Objet de requête Express contenant l'email en paramètre.
 * @param {Object} res - Objet de réponse Express.
 * @access Privé
 */
router.get('/:email', private.checkJWT, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) return res.status(404).send("Utilisateur non trouvé");
        res.render('user_detail', { user });
    } catch (error) {
        res.status(500).send("Erreur serveur");
    }
});

/**
 * Modifie les informations d'un utilisateur.
 * @name POST /users/:email/update
 * @function
 * @access Privé
 * @see module:services/user.update
 */
router.post('/:email/update', private.checkJWT, service.update); 

/**
 * Supprime un utilisateur de la base de données.
 * @name POST /users/:email/delete
 * @function
 * @access Privé
 * @see module:services/user.delete
 */
router.post('/:email/delete', private.checkJWT, service.delete);

module.exports = router;