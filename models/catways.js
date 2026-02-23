/**
 * @file catways.js
 * @description Modèle Mongoose définissant la structure d'un catway.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma Mongoose pour le Catway.
 * @typedef {Object} Catway
 * @property {number} catwayNumber - Identifiant numérique unique du catway.
 * @property {string} catwayType - Type de catway (valeurs autorisées : 'long', 'short').
 * @property {string} catwayState - Description de l'état actuel du catway.
 */
const CatwaySchema = new Schema({
    catwayNumber: {
        type: Number,
        required: true,
        unique: true
    },
    catwayType: {
        type: String,
        enum: ['long', 'short'],
        required: true
    },
    catwayState: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

/**
 * Export du modèle Catway.
 */
module.exports = mongoose.model('Catway', CatwaySchema);