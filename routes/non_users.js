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
    console.log("Obteniendo datos de establecimiento")
    try {
        const idEstablecimiento = req.params.idEstablecimiento;
        const idCiudad = req.params.idCiudad;
        const resul = await non_users.obtenerDatosEstablecimiento(idEstablecimiento,idCiudad)
        console.log(resul)
        res.send(resul[0]);
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
router.get("/horario_atencion/:idEstablecimiento", async (req, res) => {
    try {
        console.log("Obteniendo datos de horario")
        const id=req.params.idEstablecimiento;
        res.json(await non_users.obtenerHorariosAtencion(id));
    } catch (err) {
        console.log("Error mientras se obtenian los datos de Home", err.message);
       res.json({error: err.message});
    }
})
router.get("/direcciones/:idEstablecimiento", async (req, res) => {
    try {
        const id=req.params.idEstablecimiento;
        res.json(await non_users.obtenerDirecciones(id));
    } catch (err) {
        console.log("Error mientras se obtenian los datos de Home", err.message);
       res.json({error: err.message});
    }
})
router.get("/direccion/:id", async (req, res) => {
    try {
        const id=req.params.id;
        res.json(await non_users.obtenerDireccion(id));
    } catch (err) {
        console.log("Error mientras se obtenian los datos de Home", err.message);
       res.json({error: err.message});
    }
})
router.get("/salida/:idSalida", async (req,res) => {
    try {
        const id=req.params.idSalida;
        res.json(await non_users.obtenerSalidaTransporte(id));
    } catch (err) {
        console.log("Error mientras se obtenian los datos de Home", err.message);
       res.json({error: err.message});
    }
});
router.get("/salidas/:idEstablecimiento", async (req,res) => {
    try {
        const id=req.params.idEstablecimiento;
        res.json(await non_users.obtenerSalidas(id));
    } catch (err) {
        console.log("Error mientras se obtenian los datos de Home", err.message);
       res.json({error: err.message});
    }
});

router.get("/horaSalida/:idSalida", async (req,res) => {
    try {
        const id=req.params.idSalida;
        res.json(await non_users.obtenerHorasSalidas(id));
    } catch (err) {
        console.log("Error mientras se obtenian los datos de Home", err.message);
       res.json({error: err.message});
    }
});
router.get("/salidasId/:idEstablecimiento/:idCiudad", async (req,res) => {
    try {
        const idEst=req.params.idEstablecimiento;
        const idCd = req.params.idCiudad;
        res.json(await non_users.obtenerIdSalidas(idEst,idCd));
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
            case "PLATILLOS":
                result = await non_users.obtenerPlatillo(idItem);
                break;
            case "ZONAS":
                result = await non_users.obtenerZonaTuristica(idItem);
                break;
            case "FESTIVIDADES":
                result = await non_users.obtenerFestividad(idItem);
                break;
            case "PERSONAJES":
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
router.get('/listarCiudades', async (req, res) => {
    try {
        res.status(201).send(await non_users.listarCiudades());
    } catch (error) {
        console.log(error)
        res.status(401).send({ "error": error.message })
    }
});
router.get('/galeria', async (req, res) => {
    const query = req.query;
try {
    res.json(await non_users.obtenerGaleria(query.id, query.tipo));
} catch (err) {
    console.log(error)
        res.status(401).send({ "error": error.message })
}
})
module.exports = router;