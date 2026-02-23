/**
 * @file private.js
 * @description Middleware de sécurité pour la vérification et le renouvellement du jeton JWT.
 */

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * Vérifie la présence et la validité du token JWT.
 * Si le token est valide, il est renouvelé pour 24h et les informations utilisateur sont injectées dans la requête.
 * En cas d'absence de token, l'utilisateur est redirigé vers la page d'accueil.
 * * @function checkJWT
 * @param {Object} req - Objet de requête Express.
 * @param {Object} res - Objet de réponse Express.
 * @param {Function} next - Fonction pour passer au middleware suivant.
 * @returns {void}
 */
exports.checkJWT = async (req, res, next) => {

    let token = req.cookies.token || req.headers['x-access-token'] || req.headers['authorization'];

    // Extraction du token si présent dans le header Authorization (Bearer Scheme)
    if (token && typeof token === 'string' && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Token is not valid' });
            } else {
                req.user = decoded;

                const expiresIn = 24 * 60 * 60; // 24h
                const newToken = jwt.sign({
                    user : decoded.user
                },
                SECRET_KEY,
                {
                    expiresIn: expiresIn
                });

                // Mise à jour du header et du cookie avec le nouveau token
                res.setHeader('Authorization', 'Bearer ' + newToken);
                res.cookie('token', newToken, { httpOnly: true });
                
                // Injection des données utilisateur décodées dans l'objet req
                req.user = decoded.user;

                next();
            }
        });
    } else {
        // Redirection vers l'accueil si aucun jeton n'est trouvé
        return res.redirect('/'); 
    }
}