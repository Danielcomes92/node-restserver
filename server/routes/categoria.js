const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


//mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            })

        });

});

//mostrar una categoria por ID
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No existe ninguna categoria con ese ID'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        });

    });

});

//crear nueva categoria
app.post('/categoria', verificaToken, function(req, res) {
    //regresa la nueva categoria
    //req.user._id
    let body = req.body;

    let usuario = req.usuario._id;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//editar el nombre de una categoria
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//borrar una categoria por id
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    //solo un admin puede borrar categorias
    //Categoria.findByIdAndRemove 
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada)
            return res.json({
                ok: true,
                err: {
                    message: 'No existe ninguna categoria con ese ID'
                }
            });

        res.json({
            ok: true,
            message: 'Categoria borrada correctamente'
        });

    });

});

module.exports = app;