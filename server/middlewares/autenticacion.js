const jwt = require('jsonwebtoken');


// ==============
//Verificar token
//==============
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token invalido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};


// ==============
//Verificar token para Imagen
//==============
let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token invalido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });


}


// ==============
//Verifica Admin Rol
//==============
let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === "ADMIN_ROLE") {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'Necesitas permisos de administrador'
            }
        });
    }



}



module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}