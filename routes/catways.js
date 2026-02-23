const express = require('express');
const router = express.Router();
const Catway = require('../models/catways');
const private = require('../middlewares/private');

// ROUTE 1 : LA LISTE (URL: /catways)
// Change '/' par '/liste-test' juste pour voir
router.post('/', private.checkJWT, async (req, res) => {
    try {
        const { catwayNumber, catwayType, catwayState } = req.body;
        const newCatway = new Catway({ catwayNumber, catwayType, catwayState });
        await newCatway.save();
        res.redirect('/catways'); // Redirige vers la liste après succès
    } catch (error) {
        res.status(500).send("Erreur lors de la création");
    }
});
// ROUTE 2 : LE DÉTAIL (URL: /catways/:id)
// IMPORTANT : Cette route doit impérativement être APRES la route '/'
router.get('/:id', private.checkJWT, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) return res.status(404).send('Catway non trouvé');
        
        // Affiche le FORMULAIRE DE MODIFICATION
        res.render('catway_detail', { catway: catway, user: req.user });
    } catch (error) {
        res.status(500).send('Erreur détail');
    }
});

// ROUTE 3 : L'ENREGISTREMENT (POST)
router.post('/:id', private.checkJWT, async (req, res) => {
    try {
        await Catway.findOneAndUpdate(
            { catwayNumber: req.params.id }, 
            { catwayState: req.body.catwayState }
        );
        res.redirect('/catways'); 
    } catch (error) {
        res.status(500).send('Erreur update');
    }
});

// routes/catways.js

/**
 * @route POST /catways/:id/delete
 */
router.post('/:id/delete', private.checkJWT, async (req, res) => {
    try {
        // On cherche par le numéro (catwayNumber) qui est passé dans l'URL (:id)
        await Catway.findOneAndDelete({ catwayNumber: req.params.id });
        res.redirect('/catways');
    } catch (error) {
        res.status(500).send('Erreur lors de la suppression');
    }
});

module.exports = router;