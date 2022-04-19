const express = require('express');
const router = express.Router();
const admin = require('../services/administradorEstablecimiento');

const checkPermission = async function (req, res, next) {
    console.log(req.body);
    try {
        const permission = await admin.checkPermission(req.body.username, req.body.pass);
        console.log(permission);
        if (permission) next()
        else res.json({ error: "Falta de permisos para realizar operación" });
    } catch (err) {
        console.log("Un error ha ocurrido mientras verificaba permisos");
        res.json({ error: err.message });
    }
};

router.use(checkPermission);

router.post('/crearEstablecimiento', async (req, res) => {
    const data = req.body;
    try {
        console.log(req.body);
        res.json(await admin.crearEstablecimiento(data.username, data.nombre, data.correo, data.telefono, data.tipo, data.ciudad, data.colonia, data.numero, data.cp, data.calle, data.pagina, data.maps));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.post('/reclamarEstablecimiento', async (req, res) => {
    const data = req.body;
    try {
        console.log(req.body);
        res.json(await admin.reclamarEstablecimiento(data.username, data.establecimiento));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.post('/modificarEstablecimiento', async (req, res) => {
    const data = req.body;
    try {
        console.log(req.body);
        res.json(await admin.modificarEstablecimiento(data.establecimiento, data.nombre, data.tipo, data.correo, data.telefono, data.pagina, data.maps));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.post('/crearHorarioAtencion', async (req, res) => {
    const data = req.body;
    try {
        console.log(req.body);
        res.json(await admin.crearHorarioAtencion(data.establecimiento, data.lunes, data.martes, data.miercoles, data.jueves, data.viernes, data.sabado, data.domingo));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.post('/modificarHorarioAtencion', async (req, res) => {
    const data = req.body;
    try {
        console.log(req.body);
        res.json(await admin.modificarHorarioAtencion(data.establecimiento, data.lunes, data.martes, data.miercoles, data.jueves, data.viernes, data.sabado, data.domingo));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.post('/crearDireccion', async (req, res) => {
    const data = req.body;
    try {
        console.log(req.body);
        res.json(await admin.crearDireccion(data.establecimiento, data.ciudad, data.colonia, data.numero, data.cp, data.calle));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.post('/modificarDireccion', async (req, res) => {
    const data = req.body;
    try {
        console.log(req.body);
        res.json(await admin.modificarDireccion(data.establecimiento, data.ciudad, data.colonia, data.numero, data.cp, data.calle));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.post('/insertarFotos', async (req, res) => {
    const data = req.body;
    try {
        console.log("Subiendo fotos de la ciudad");
        res.status(201).send(await admin.insertarFotos(data.images_data, data.establecimiento)); 
    } catch (error) {
        console.log(error)
        res.status(401).send({ "error": error.message })
    }
})

module.exports = router;