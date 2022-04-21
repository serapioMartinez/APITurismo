const express = require('express');
const router = express.Router();
const user = require('../services/user_app');

const checkPermission = async function (req, res, next) {
    console.log(req.body);
    try {
        const permission = await user.checkPermission(req.body.username, req.body.pass);
        console.log(permission);
        if (permission) next()
        else res.json({ error: "Falta de permisos para realizar operación" });
    } catch (err) {
        console.log("Un error ha ocurrido mientras verificaba permisos");
        res.json({ error: err.message });
    }
};

router.post('/calificarCiudad', async (req, res) => {
    const data = req.body;
    try {
        console.log(req.body);
        res.json(await user.calificarCiudad(data.idUsuario, data.idCiudad, data.calificacion));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.post('/calificarEstablecimiento', async (req, res) => {
    const data = req.body;
    try {
        console.log(req.body);
        res.json(await user.calificarEstablecimiento(data.idUsuario, data.idEstablecimiento, data.calificacion));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.post('/publicarResenhaCiudad', async (req, res) => {
    const data = req.body;
    try {
        console.log(req.body);
        res.json(await user.publicarResenhaCiudad(data.idUsuario, data.idCiudad, data.contenido));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.post('/publicarResenhaEstablecimiento', async (req, res) => {
    const data = req.body;
    try {
        console.log(req.body);
        res.json(await user.publicarResenhaEstablecimiento(data.idUsuario, data.idEstablecimiento, data.contenido));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.post("/entrada_agenda",async (req, res) => {
    const data = req.body;
    try {
        console.log(req.body);
        res.json(await user.agregarEntradaAgenda(
            data.idUsuario,
            data.idCiudad, 
            data.idEstablecimiento, 
            data.fecha,
            data.hora));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.delete("/entrada_agenda",async (req, res) => {
    const data = req.body;
    try {
        console.log(req.body);
        res.json(await user.eliminarEntradaAgenda(data.idEntrada));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.get('/reseñasCiudad',async (req, res) => {
    const data = req.body;
    try {
        console.log(req.body);
        res.json(await user.obtenerResenhasCiudad(data.idCiudad, data.page));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.post('/reseñasCiudad',async (req, res) => {
    const data = req.body;
    try {
        console.log(req.body);
        res.json(await user.publicarResenhaCiudad(data.idUsuario, data.idCiudad, data.contenido));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.get('/reseñasEstablecimiento',async (req, res) => {
    const data = req.body;
    try {
        console.log(req.body);
        res.json(await user.obtenerResenhasEstablecimientos(data.idEstablecimiento, data.page));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.post('/reseñasEstablecimiento',async (req, res) => {
    const data = req.body;
    try {
        console.log(req.body);
        res.json(await user.publicarResenhaEstablecimiento(data.idUsuario, data.idEstablecimiento, data.contenido));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

module.exports=router;