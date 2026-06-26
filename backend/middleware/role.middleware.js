/**
 * Middleware RBAC — vérifie que le rôle de l'utilisateur est autorisé.
 * Usage : authorize('admin', 'chef')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Accès refusé — rôle '${req.user.role}' non autorisé pour cette action`,
    });
  }
  next();
};

module.exports = { authorize };
