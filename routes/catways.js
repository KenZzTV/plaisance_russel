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
/**
 * Met à jour l'état d'un catway (Uniquement l'état est modifiable).
 * @route POST /catways/:id
 * @access Privé
 */
router.post('/:id', private.checkJWT, async (req, res) => {
    try {
        const { catwayState } = req.body;
        
        // On cherche par le numéro de catway (catwayNumber) et on met à jour l'état
        const updated = await Catway.findOneAndUpdate(
            { catwayNumber: req.params.id }, 
            { catwayState: catwayState },
            { new: true }
        );

        if (!updated) return res.status(404).send('Catway non trouvé');
        
        res.redirect('/dashboard'); // Redirection vers le tableau de bord après modif
    } catch (error) {
        res.status(500).send('Erreur lors de la mise à jour');
    }
});

/**
 * Supprime un catway.
 * @route POST /catways/:id/delete
 */
router.post('/:id/delete', private.checkJWT, async (req, res) => {
    try {
        await Catway.findOneAndDelete({ catwayNumber: req.params.id });
        res.redirect('/catways');
    } catch (error) {
        res.status(500).send('Erreur lors de la suppression');
    }
});

module.exports = router;