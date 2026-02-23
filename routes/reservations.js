/**
 * @file reservations.js
 * @description Routes Express pour la gestion des réservations liées à un catway spécifique.
 */

const express = require('express');
const router = express.Router({ mergeParams: true });
const Reservation = require('../models/reservations');
const private = require('../middlewares/private');

/**
 * Récupère et affiche la liste des réservations pour un catway donné.
 * @name GET /catways/:id/reservations
 * @function
 * @param {Object} req - Objet de requête Express contenant l'ID du catway dans params.
 * @param {Object} res - Objet de réponse Express pour le rendu de la vue.
 * @access Privé
 */
router.get('/', private.checkJWT, async (req, res) => {
    try {
        const reservations = await Reservation.find({ catwayNumber: req.params.id });
        res.render('reservations_list', { 
            reservations, 
            catwayId: req.params.id,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Affiche les détails d'une réservation spécifique.
 * @name GET /catways/:id/reservations/:idReservation
 * @function
 * @param {Object} req - Objet de requête Express contenant l'ID de la réservation.
 * @param {Object} res - Objet de réponse Express pour le rendu de la vue.
 * @access Privé
 */
router.get('/:idReservation', private.checkJWT, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.idReservation);
        res.render('reservation_detail', { 
            reservation,
            user: req.user
        });
    } catch (error) {
        res.status(404).json({ message: "Réservation introuvable" });
    }
});

/**
 * Crée une nouvelle réservation associée à un catway spécifique.
 * @name POST /catways/:id/reservations
 * @function
 * @param {Object} req - Objet de requête Express contenant les données de la réservation.
 * @param {Object} res - Objet de réponse Express pour la redirection.
 * @access Privé
 */
router.post('/', private.checkJWT, async (req, res) => {
    try {
        const newRes = new Reservation({
            catwayNumber: req.params.id,
            ...req.body 
        });
        await newRes.save();
        res.redirect(`/catways/${req.params.id}/reservations`);
    } catch (error) {
        res.status(400).send("Erreur création");
    }
});

module.exports = router;