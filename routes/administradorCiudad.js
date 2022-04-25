const express = require('express');
const router = express.Router();
const admin = require('../services/administradorCiudad');

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

//router.use(imageUpload.any());
//router.use(express.static('public'))

router.use(checkPermission);
router.post('/ciudad', async (req, res) => {
    console.log(req.body)
    try {
        const existencia = await admin.revisarExistenciaAdministracion(req.body.username);
        if (existencia.length) res.json([{existencia:existencia}]);
        else res.json(await admin.generarCiudad(
            req.body.username,
            req.body.ciudad,
            req.body.region,
            req.body.municipio,
            req.body.correo,
            req.body.telefono,
            req.body.magico,
            req.body.tipos,
            req.body.emergencias,
            req.body.descripcion));

    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.put('/ciudad',async (req, res, next) => {
    const data = req.body;
    try {
        console.log(req.body);
        res.json(await admin.modificarCiudad(
            data.username, 
            data.correo, 
            data.telefono, 
            data.magico,
            data.tipos, 
            data.emergencias,
            data.descripcion));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});


router.post('/subirRepresentativa',async (req, res) =>{
    const data = req.body;
    console.log(data)
    try{
        console.log(`Tratando se subir imagen representativa por ${data.username}`)
        res.status(201).send(await admin.subirRepresentativa(
            data.username,
            data.imagen))
    }catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.status(401).json({ 'error': error.message });
    }
});

router.post('/subirFotos', async (req, res)=> {
    const data = req.body;
   try {
       console.log("Subiendo fotos de la ciudad");
       city_data = await admin.revisarExistenciaAdministracion(
           data.username);
       if(city_data.length){
           console.log(city_data);
           console.log(city_data[0].ID)
           res.status(201).send(await admin.subirFotosCiudad(
               data.username, 
               data.images_data,
               city_data[0].ID));
       }
   } catch (error) {
       console.log(error)
       res.status(401).send({"error":error.message})
   }
})

router.post('/addPlatillo', async (req,res) => {
    const data = req.body;
    try{
        console.log("Agregando platillo...");
        city_data = await(admin.revisarExistenciaAdministracion(
            data.username));
        if(city_data.length){
            console.log(city_data);
            res.status(201).send(await admin.agregarPlatillo(
                data.username, 
                city_data[0].ID, 
                data.nombre, 
                data.descripcion, 
                data.foto));
        }
    }catch (error) {
        console.log(error)
        res.status(401).send({"error":error.message})
    }
});

router.post('/addZonaTuristica', async (req,res) => {
    const data = req.body;
    try{
        console.log("Agregando Zona Turistica...");
        city_data = await(admin.revisarExistenciaAdministracion(
            data.username));
        if(city_data.length){
            console.log(city_data);
            res.status(201).send(await admin.agregarZonaTuristica(
                data.username, 
                city_data[0].ID, 
                data.nombre, 
                data.tipo, 
                data.descripcion, 
                data.foto));
        }
    }catch (error) {
        console.log(error)
        res.status(401).send({"error":error.message})
    }
});

router.post('/addFestividad', async (req,res) => {
    const data = req.body;
    try{
        console.log("Agregando festividad...");
        city_data = await(admin.revisarExistenciaAdministracion(
            data.username));
        if(city_data.length){
            console.log(city_data);
            res.status(201).send(await admin.agregarfestividad(
                data.username, 
                city_data[0].ID, 
                data.dia, 
                data.mes, 
                data.nombre, 
                data.descripcion, 
                data.foto));
        }
    }catch (error) {
        console.log(error)
        res.status(401).send({"error":error.message})
    }
});

router.post('/addPersonaje', async (req,res) => {
    const data = req.body;
    try{
        console.log("Agregando personaje...");
        city_data = await(admin.revisarExistenciaAdministracion(
            data.username));
        if(city_data.length){
            console.log(city_data);
            res.status(201).send(await admin.agregarPersonaje(
                data.username, 
                city_data[0].ID,
                data.nombre, 
                data.nacimiento, 
                data.fallecimiento, 
                data.descripcion, 
                data.foto));
        }
    }catch (error) {
        console.log(error)
        res.status(401).send({"error":error.message})
    }
});

router.post('/addNota', async (req,res) => {
    const data = req.body;
    try{
        console.log("Agregando nota...");
        city_data = await(admin.revisarExistenciaAdministracion(
            data.username));
        if(city_data.length){
            console.log(city_data);
            res.status(201).send(await admin.agregarNota(
                data.username,
                city_data[0].ID, 
                data.titulo, 
                data.descripcion,
                data.foto));
        }
    }catch (error) {
        console.log(error)
        res.status(401).send({"error":error.message})
    }
});

router.post('/addEstablecimiento', async (req, res) => {
    const data = req.body;
    try{
        console.log("Agregando establecimiento");
        city_data = await(admin.revisarExistenciaAdministracion(
            data.username));
        if(city_data.length){
            console.log(city_data);
            row=(await admin.agregarEstablecimiento(
                city_data[0].ID, 
                data.nombre, 
                data.tipo, 
                (data.telefono)?data.telefono:"", 
                (data.correo)?data.correo:"", 
                (data.foto)?data.foto:null));
            
            res.send(row)
        }
    }catch (error) {
        console.log(error)
        res.status(401).send({"error":error.message})
    }
})

module.exports = router;