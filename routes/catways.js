/**
 * @file catways.js
 * @description Routes Express pour la gestion des catways (CRUD).
 */

const express = require('express');
const router = express.Router();
const Catway = require('../models/catways');
const private = require('../middlewares/private');

/**
 * Récupère et affiche les détails d'un catway spécifique.
 * @name GET /catways/:id
 * @function
 * @param {Object} req - Objet de requête Express contenant l'ID du catway.
 * @param {Object} res - Objet de réponse Express pour le rendu de la vue.
 */
router.get('/:id', async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);
        res.render('catway_detail', { catway });
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération du catway');
    }
});

/**
 * Crée un nouveau catway dans la base de données.
 * @name POST /catways/create
 * @function
 * @param {Object} req - Objet de requête Express contenant les données du nouveau catway.
 * @param {Object} res - Objet de réponse Express pour la redirection.
 * @access Privé - Nécessite un jeton JWT valide.
 */
router.post('/create', private.checkJWT, async (req, res) => {
    try {
        const { catwayNumber, type, catwayState } = req.body;
        const newCatway = new Catway({ catwayNumber, catwayType: type, catwayState });
        await newCatway.save();
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la création.");
    }
});

/**
 * Met à jour l'état d'un catway existant.
 * @name POST /catways/:id
 * @function
 * @param {Object} req - Objet de requête Express contenant l'ID et le nouvel état.
 * @param {Object} res - Objet de réponse Express pour la redirection.
 * @access Privé - Nécessite un jeton JWT valide.
 */
router.post('/:id', private.checkJWT, async (req, res) => {
    try {
        const { catwayState } = req.body;
        await Catway.findByIdAndUpdate(req.params.id, { catwayState: catwayState });
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send('Erreur lors de la mise à jour du catway');
    }
});

/**
 * Supprime un catway de la base de données.
 * @name POST /catways/:id/delete
 * @function
 * @param {Object} req - Objet de requête Express contenant l'ID du catway à supprimer.
 * @param {Object} res - Objet de réponse Express pour la redirection.
 * @access Privé - Nécessite un jeton JWT valide.
 */
router.post('/:id/delete', private.checkJWT, async (req, res) => {
    try {
        await Catway.findByIdAndDelete(req.params.id);
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).send('Erreur lors de la suppression du catway');
    }
});

module.exports = router;