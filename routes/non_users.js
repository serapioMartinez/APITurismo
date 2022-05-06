const express = require('express');
const router = express.Router();
const non_users = require('../services/non_users');

router.get('/', async function(req,res, next){
    try{
         res.json(await non_users.getHomeData());
    }catch(err){
        console.log("Error mientras se obtenian los datos de Home", err.message);
        res.json({error: err.message});
    }
});
router.get('/busqueda/lugares', async function(req,res, next){
    try{
        const expresion = req.query.expresion || "a";
        const page= req.query.page;
        res.json(await non_users.buscarCiudades(expresion, page));
   }catch(err){
       console.log("Error mientras se obtenian los datos de Home", err.message);
       res.json({error: err.message});
   }
});
router.get('/busqueda/establecimientos/:idCiudad', async function(req,res, next){
    try {
        const ciudad = req.params.idCiudad;
        const tipo = req.query.tipo;
        const page = req.query.page;
        res.json(await non_users.consultarEstablecimientos(ciudad, tipo, page));
    } catch (err) {
        console.log("Error mientras se obtenian los datos de Home", err.message);
       res.json({error: err.message});
    }
});
router.get("/lugares/:idCiudad", async (req,res) => {
    try{
        const result= await non_users.obtenerDatosCiudad(req.params.idCiudad)
        res.json(result[0]);
   }catch(err){
       console.log("Error mientras se obtenian los datos de Home", err.message);
       res.json({error: err.message});
   }
});
router.get("/establecimientos/:idEstablecimiento/:idCiudad", async (req,res) => {
    try {
        const idEstablecimiento = req.params.idEstablecimiento;
        const idCiudad = req.params.idCiudad;
        res.json(await non_users.obtenerDatosEstablecimiento(idEstablecimiento,idCiudad));
    } catch (err) {
        console.log("Error mientras se obtenian los datos de Home", err.message);
       res.json({error: err.message});
    }
});
router.get("/establecimientosPro/:idEstablecimiento", async (req,res) => {
    try {
        const id=req.params.idEstablecimiento;
        res.json(await non_users.obtenerDatosProEstablecimiento(id));
    } catch (err) {
        console.log("Error mientras se obtenian los datos de Home", err.message);
       res.json({error: err.message});
    }
});
router.get("/salidasTransportes/:idEstablecimiento", async (req,res) => {
    try {
        const id=req.params.idEstablecimiento;
        res.json(await non_users.obtenerSalidasTransportes(id));
    } catch (err) {
        console.log("Error mientras se obtenian los datos de Home", err.message);
       res.json({error: err.message});
    }
});
router.get("/items/:idCiudad/:tipoItem", async (req,res) => {
    try {
        const idCiudad = req.params.idCiudad || 0;
        const tipoItem = req.params.tipoItem.toUpperCase() || "NOTAS";
        const page = req.query.page||0;
        let result;
        switch(tipoItem){
            case "PLATILLOS":
                result = await non_users.consultarPlatillos(idCiudad, page);
                break;
            case "ZONAS":
                result = await non_users.consultarZonasTuristicas(idCiudad, page);
                break;
            case "FESTIVIDADES":
                result = await non_users.consultarFestividades(idCiudad, page);
                break;
            case "PERSONAJES":
                result = await non_users.consultarPersonajes(idCiudad, page);
                break;
            case "NOTAS":
                result = await non_users.consultarNotas(idCiudad, page);
                break;
            default: 
                result = await non_users.consultarNotas(idCiudad, page);
                break;
        }
        res.json(result);
    } catch (err) {
        console.log("Error mientras se obtenian los datos de Home", err.message);
       res.json({error: err.message});
    }
});
router.get("/item/:tipoItem/:idItem", async (req,res) => {
    try {
        const idItem = req.params.idItem || 0;
        const tipoItem = req.params.tipoItem.toUpperCase() || "NOTAS";
        let result;
        switch(tipoItem){
            case "PLATILLO":
                result = await non_users.obtenerPlatillo(idItem);
                break;
            case "ZONA":
                result = await non_users.obtenerZonaTuristica(idItem);
                break;
            case "FESTIVIDAD":
                result = await non_users.obtenerFestividad(idItem);
                break;
            case "PERSONAJE":
                result = await non_users.obtenerPersonaje(idItem);
                break;
            case "NOTAS":
                result = await non_users.obtenerNota(idItem);
                break;
            default: 
                result = await non_users.consultarNotas.obtenerNota(idItem);
                break;
        }
        res.json(result);
    } catch (err) {
        console.log("Error mientras se obtenian los datos de Home", err.message);
       res.json({error: err.message});
    }
});
module.exports = router;