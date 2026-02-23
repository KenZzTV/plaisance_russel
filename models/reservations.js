/**
 * @file reservations.js
 * @description Modèle Mongoose définissant la structure d'une réservation pour un catway.
 */

const mongoose = require('mongoose');
const schema = mongoose.Schema;

/**
 * Schéma Mongoose pour la Réservation.
 * @typedef {Object} Reservations
 * @property {number} catwayNumber - Numéro du catway associé à la réservation.
 * @property {string} clientName - Nom du client.
 * @property {string} boatName - Nom du navire.
 * @property {Date} startDate - Date de début de la réservation.
 * @property {Date} endDate - Date de fin de la réservation.
 */
const Reservations = new schema({
    catwayNumber: {
        type: Number,
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    boatName: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

/**
 * Export du modèle Reservations.
 */
module.exports = mongoose.model('Reservations', Reservations);