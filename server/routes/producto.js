const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

//Obtener todos los productos
app.get('/productos', (req, res) => {
    //trae todos los productos
    //populate: usuario categoria
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .sort('categoria')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            });
        });
});

//Obtener un producto por ID
app.get('/productos/:id', (req, res) => {
    //trae trae un solo producto
    //populate: usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe ningun producto con ese ID'
                    }
                });
            }

            res.json({
                ok: true,
                productoDB
            });
        });
});

//buscar productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });

});

//Crear un producto
app.post('/productos', verificaToken, (req, res) => {
    //Grabar el usuario
    //Grabar una categoria del listado
    let body = req.body;
    let usuario = req.usuario._id;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // if (!productoDB) {
        //     return res.status(400).json({
        //         ok: false,
        //         err
        //     });
        // }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });

});

//Actualizar un producto
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let actualizar = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        categoria: body.categoria,
        disponible: body.disponible
    };
    //Grabar el usuario
    //Grabar una categoria del listado

    Producto.findByIdAndUpdate(id, actualizar, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No hay ningun producto con ese ID'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});


//Borrar un producto
app.delete('/productos/:id', verificaToken, (req, res) => {
    //Grabar el usuario
    //Grabar una categoria del listado
    let id = req.params.id;

    let disponibilidad = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, disponibilidad, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB.nombre,
            disponible: productoDB.disponible,
            resultado: `Producto ${productoDB.nombre} actualizado a NO disponible`
        });

    });

});









module.exports = app;