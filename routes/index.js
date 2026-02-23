/**
 * @file index.js
 * @description Routes principales de l'application : authentification, dashboard et accès aux ressources.
 */

var express = require('express');
var router = express.Router();

const userRoute = require('../routes/users');
const private = require('../middlewares/private');
const Catway = require('../models/catways');
const Reservation = require('../models/reservations');
const userService = require('../services/user'); 

/**
 * Affiche la page d'accueil (formulaire de connexion).
 * @name GET /
 * @function
 */
router.get('/', async (req, res) => {
    res.render('index', { title: 'Accueil' });
});

/**
 * Gère la tentative de connexion de l'utilisateur.
 * @name POST /login
 * @function
 * @see module:services/user.authenticate
 */
router.post('/login', userService.authenticate);

/**
 * Déconnecte l'utilisateur en supprimant le cookie JWT.
 * @name GET /logout
 * @function
 */
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

/**
 * Affiche le tableau de bord avec la liste des catways et réservations.
 * @name GET /dashboard
 * @function
 * @param {Object} req - Requête Express avec req.user (via JWT).
 * @access Privé
 */
router.get('/dashboard', private.checkJWT, async (req, res) => {
    try {
        const [catways, reservations] = await Promise.all([
            Catway.find(),
            Reservation.find()
        ]);
        res.render('dashboard', {
            title: 'Dashboard',
            user: req.user,
            catways: catways,
            reservations: reservations
        });
    } catch (error) {
        res.status(500).send("Erreur de chargement du dashboard");
    }
});

/**
 * Affiche la documentation de l'API.
 * @name GET /infos
 * @function
 */
router.get('/infos', (req, res) => {
    res.render('infos', { 
        title: 'Documentation API',
        user: req.user || null 
    });
});

/**
 * Affiche l'interface de gestion des catways.
 * @name GET /catways
 * @function
 * @access Privé
 */
router.get('/catways', private.checkJWT, async (req, res) => {
    try {
        const catwaysList = await Catway.find();
        res.render('catway', { 
            title: 'Gestion des Catways',
            user: req.user,
            catways: catwaysList,
            catway: catwaysList[0] || {}
        });
    } catch (error) {
        res.status(500).send("Erreur de récupération");
    }
});

/**
 * Affiche l'interface de gestion des réservations.
 * @name GET /reservations
 * @function
 * @access Privé
 */
router.get('/reservations', private.checkJWT, async (req, res) => {
    try {
        const allReservations = await Reservation.find();
        res.render('reservations_list', { 
            title: 'Gestion des Réservations',
            user: req.user,
            reservations: allReservations 
        });
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération des réservations");
    }
});

/**
 * Crée une nouvelle réservation.
 * @name POST /reservations
 * @function
 * @access Privé
 */
router.post('/reservations', private.checkJWT, async (req, res) => {
    try {
        await Reservation.create(req.body);
        res.redirect('/reservations');
    } catch (error) {
        res.status(500).send("Erreur lors de la création");
    }
});

/**
 * Supprime une réservation par son identifiant.
 * @name POST /reservations/:id/delete
 * @function
 * @param {string} id - Identifiant de la réservation.
 * @access Privé
 */
router.post('/reservations/:id/delete', private.checkJWT, async (req, res) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id);
        res.redirect('/reservations');
    } catch (error) {
        res.status(500).send("Erreur lors de la suppression");
    }
});

module.exports = router;