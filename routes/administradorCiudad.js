const express = require('express');
const router = express.Router();
const admin = require('../services/administradorCiudad');

const checkPermission = async function (req, res, next) {
    console.log("Revisando Permisos")
    const data = req.body.data;
    try {
        const permission = await admin.checkPermission(data.username, data.pass);
        console.log(permission);
        if (permission) {
            console.log("Acceso aceptado")
            next()}
        else res.json({ error: "Falta de permisos para realizar operación" });
    } catch (err) {
        console.log("Un error ha ocurrido mientras verificaba permisos");
        res.json({ error: err.message });
    }
};

//router.use(imageUpload.any());
//router.use(express.static('public'))

router.get('/usuario', async (req, res)=>{
    console.log(req.query);
    try {
        const userData =await admin.obtenerDatosUsuario(req.query.id);
        res.status(200).json(userData[0]);
    } catch (error) {
        res.status(400).send({error: error.message})
    }
});
router.put('/usuario', checkPermission, async (req, res)=>{
    console.log(req.body);
    const data = req.body.data;
    try{
        const row= await admin.actualizarDatosUsuario(data.id,data.newUsername, data.nombre, data.correo, data.cargo, data.foto)
        if(row.affectedRows)res.status(200).send({
            status: "OK",
            affectedRows: row.affectedRows
        })
        else res.status(200).send({
            status: "BAD",
            affectedRows: 0
        })
    }catch(err){
        console.log("Ha ocurrido un error mientras se actualizaba usuario.",err.message)
        res.status(400).send({error: err.message})
    }
})

router.post('/sesion',checkPermission, async (req,res)=> {
    console.log(req.body);
    const data = req.body.data;
    try {
        const userData = await admin.iniciarSesion(data.username, data.pass);
        res.status(200).json(userData)
    } catch (err) {
        res.status(400).send({error:err.message})
    }
});

router.post('/ciudad',checkPermission, async (req, res) => {
    console.log(req.body.data)
    try {
        const existencia = await admin.revisarExistenciaAdministracion(req.body.data.username);
        if (existencia.length) res.json([{existencia:existencia}]);
        else {
            console.log("No hay existencias")
            const result =await admin.generarCiudad(
                req.body.data.username,
                req.body.data.ciudad,
                req.body.data.region,
                req.body.data.municipio,
                req.body.data.correo,
                req.body.data.telefono,
                req.body.data.magico,
                req.body.data.tipos,
                req.body.data.emergencias,
                req.body.data.descripcion)
            res.status(201).json(result);
        }

    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.put('/ciudad',checkPermission,async (req, res, next) => {
    const data = req.body.data;
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


router.post('/subirRepresentativa',checkPermission,async (req, res) =>{
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

router.post('/subirFotos',checkPermission, async (req, res)=> {
    const data = req.body.data;
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

router.post('/addPlatillo',checkPermission , async (req,res) => {
    const data = req.body.data;
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

router.post('/addZonaTuristica',checkPermission, async (req,res) => {
    const data = req.body.data;
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

router.post('/addFestividad',checkPermission, async (req,res) => {
    const data = req.body.data;
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

router.post('/addPersonaje',checkPermission, async (req,res) => {
    const data = req.body.data;
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

router.post('/addNota',checkPermission, async (req,res) => {
    const data = req.body.data;
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

router.post('/addEstablecimiento',checkPermission, async (req, res) => {
    const data = req.body.data;
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