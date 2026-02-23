/**
 * @file users.js
 * @description Modèle Mongoose définissant la structure d'un utilisateur.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma Mongoose pour l'Utilisateur.
 * @typedef {Object} User
 * @property {string} name - Nom complet de l'utilisateur.
 * @property {string} email - Adresse de messagerie unique (sert d'identifiant).
 * @property {string} password - Mot de passe hashé de l'utilisateur.
 */
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);