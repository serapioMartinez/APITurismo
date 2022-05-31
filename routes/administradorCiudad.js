const express = require('express');
const router = express.Router();
const admin = require('../services/administradorCiudad');

const checkPermission = async function (req, res, next) {
    console.log("Revisando Permisos")
    const data = req.body.data;
    console.log(req.body)
    console.log(data)
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
        const row= await admin.actualizarDatosUsuario(
            data.id,
            data.newUsername, 
            data.nombre, 
            data.correo, 
            data.cargo, 
            data.foto)
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

router.post('/subirFotoPerfil', checkPermission, async (req, res )=> {
    const data = req.body.data;
    console.log(data);
    try {
        console.log("Subiendo foto de perfil de usuario");
        const resul = await admin.subirFotoPerfil(data.username, data.foto);
        if(resul.affectedRows==0)res.send({error: "No se pudo subir la imagen"})
        else res.send({ok: "Proceso exitoso"})
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.status(401).json({ 'error': error.message });
    }
})

router.post('/subirRepresentativa',checkPermission,async (req, res) =>{
    const data = req.body.data;
    console.log(data)
    try{
        console.log(`Tratando se subir imagen representativa por ${data.username}`)
        res.status(201).send(await admin.subirRepresentativa(
            data.username,
            data.foto))
    }catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.status(401).json({ 'error': error.message });
    }
});

router.post('/insertarFotos',checkPermission, async (req, res)=> {
    const data = req.body.data;
   try {
       console.log("Subiendo fotos de la ciudad");
       city_data = await admin.revisarExistenciaAdministracion(
           data.username);
       if(city_data.length){
           console.log(city_data);
           console.log(city_data[0].ID)
           const resul =  await admin.subirFotosCiudad(
               data.images_data,
               city_data[0].ID);
            if(resul.length==0 || resul.affectedRows==0) res.send({error: "No se ha podido realizar el proceso"})
            else res.json({ok: "Proceso exitoso"});
       }
   } catch (error) {
       console.log(error)
       res.status(401).send({"error":error.message})
   }
})
router.delete('/foto', checkPermission, async (req, res) => {
    const data = req.body.data;
    try {
        console.log("Eliminando fotos de establecimiento");
        const resul = await admin.eliminarFoto(data.id)
        if(resul.length==0 || resul.affectedRows==0) res.send({error: "No se ha podido realizar el proceso"})
        else res.json({ok: "Proceso exitoso"});
    } catch (error) {
        console.log(error)
        res.status(401).send({ "error": error.message })
    }
})
router.post('/subirFotoItem', checkPermission, async (req, res)=>{
    const data = req.body.data;
    console.log(data)
    try {
        const resul = await admin.subirFotoItem(data.id, data.foto, data.item);
        if(resul.affectedRows!=0) res.status(201).send({status: 'OK'});
        else res.status(201).send({error: "No se ha podido actualizar imagen en base de datos"});
    } catch (error) {
        console.log(error)
       res.status(401).send({"error":error.message})
    }
})

router.post('/platillos',checkPermission , async (req,res) => {
    const data = req.body.data;
    try{
        console.log("Agregando platillo...");
        city_data = await(admin.revisarExistenciaAdministracion(
            data.username));
        if(city_data.length){
            console.log(city_data);
            const resul = await admin.agregarPlatillo(
                city_data[0].ID, 
                data.nombre, 
                data.descripcion, 
                data.foto);
            if(resul.affectedRows!=0) res.status(201).send({status: 'OK'});
            else res.status(201).send({error: "No se ha podido agregar platillo"});
        }
    }catch (error) {
        console.log(error)
        res.status(401).send({"error":error.message})
    }
});
router.put('/platillos', checkPermission, async (req, res) => {
    const data = req.body.data;
    console.log(data)
    try{
        console.log('Actualizando informacion de platillo');
        city_data = await(admin.revisarExistenciaAdministracion(
            data.username));
        if(city_data.length){
            console.log(city_data);
            const resul = await admin.modificarPlatillo(
                data.id, 
                data.nombre, 
                data.descripcion, 
                data.foto);
            if(resul.affectedRows!=0) res.status(201).send({status: 'OK'});
            else res.status(201).send({error: "No se ha podido actualizar platillo"});
        }
    }catch(error ){
        console.log(error)
        res.status(401).send({"error":error.message})
    }
});

router.post('/zonas',checkPermission, async (req,res) => {
    const data = req.body.data;
    try{
        console.log("Agregando Zona Turistica...");
        city_data = await(admin.revisarExistenciaAdministracion(
            data.username));
        if(city_data.length){
            console.log(city_data);
            const result = await admin.agregarZonaTuristica(
                city_data[0].ID, 
                data.nombre, 
                data.tipo, 
                data.descripcion, 
                data.foto);
                if(resul.affectedRows!=0) res.status(201).send({status: 'OK'});
                else res.status(201).send({error: "No se ha podido agregar zona turistica"});
        }
    }catch (error) {
        console.log(error)
        res.status(401).send({"error":error.message})
    }
});
router.put('/zonas',checkPermission, async (req,res) => {
    const data = req.body.data;
    try{
        console.log("Actualizando Zona Turistica...");
        city_data = await(admin.revisarExistenciaAdministracion(
            data.username));
        if(city_data.length){
            console.log(city_data);
            const result = await admin.modificarZonaTuristica(
                data.id, 
                data.nombre, 
                data.tipo, 
                data.descripcion, 
                data.foto);
            if(resul.affectedRows!=0) res.status(201).send({status: 'OK'});
            else res.status(201).send({error: "No se ha podido agregar zona turistica"});
        }
    }catch (error) {
        console.log(error)
        res.status(401).send({"error":error.message})
    }
});

router.post('/festividades',checkPermission, async (req,res) => {
    const data = req.body.data;
    try{
        console.log("Agregando festividad...");
        city_data = await(admin.revisarExistenciaAdministracion(
            data.username));
        if(city_data.length){
            console.log(city_data);
            const resul =await admin.agregarfestividad(
                city_data[0].ID, 
                data.dia, 
                data.mes, 
                data.nombre, 
                data.descripcion, 
                data.foto);
            if(resul.affectedRows!=0) res.status(201).send({status: 'OK'});
            else res.status(201).send({error: "No se ha podido agregar festividad"});
        }
    }catch (error) {
        console.log(error)
        res.status(401).send({"error":error.message})
    }
});
router.put('/festividades',checkPermission, async (req,res) => {
    const data = req.body.data;
    try{
        console.log("Agregando festividad...");
        city_data = await(admin.revisarExistenciaAdministracion(
            data.username));
        if(city_data.length){
            console.log(city_data);
            const resul =await admin.modificarfestividad(
                data.id, 
                data.dia, 
                data.mes, 
                data.nombre, 
                data.descripcion, 
                data.foto);
            if(resul.affectedRows!=0) res.status(201).send({status: 'OK'});
            else res.status(201).send({error: "No se ha actualizar festividad"});
        }
    }catch (error) {
        console.log(error)
        res.status(401).send({"error":error.message})
    }
});

router.post('/personajes',checkPermission, async (req,res) => {
    const data = req.body.data;
    try{
        console.log("Agregando personaje...");
        city_data = await(admin.revisarExistenciaAdministracion(
            data.username));
        if(city_data.length){
            console.log(city_data);
            const resul =await admin.agregarPersonaje(
                city_data[0].ID,
                data.nombre, 
                data.nacimiento, 
                data.fallecimiento, 
                data.descripcion, 
                data.foto);
            if(resul.affectedRows!=0) res.status(201).send({status: 'OK'});
            else res.status(201).send({error: "No se ha agregar personaje"});
        }
    }catch (error) {
        console.log(error)
        res.status(401).send({"error":error.message})
    }
});
router.put('/personajes',checkPermission, async (req,res) => {
    const data = req.body.data;
    try{
        console.log("Agregando personaje...");
        city_data = await(admin.revisarExistenciaAdministracion(
            data.username));
        if(city_data.length){
            console.log(city_data);
            const resul =await admin.modificarPersonaje(
                data.id, 
                data.nombre, 
                data.nacimiento, 
                data.fallecimiento, 
                data.descripcion, 
                data.foto);
            if(resul.affectedRows!=0) res.status(201).send({status: 'OK'});
            else res.status(201).send({error: "No se ha actualizar personaje"});
        }
    }catch (error) {
        console.log(error)
        res.status(401).send({"error":error.message})
    }
});

router.post('/notas',checkPermission, async (req,res) => {
    const data = req.body.data;
    try{
        console.log("Agregando nota...");
        city_data = await(admin.revisarExistenciaAdministracion(
            data.username));
        if(city_data.length){
            console.log(city_data);
            const resul = await admin.agregarNota(
                city_data[0].ID, 
                data.nombre, 
                data.descripcion,
                data.foto);
            if(resul.affectedRows!=0) res.status(201).send({status: 'OK'});
            else res.status(201).send({error: "No se ha agregar nota"});
        }
    }catch (error) {
        console.log(error)
        res.status(401).send({"error":error.message})
    }
});
router.put('/notas',checkPermission, async (req,res) => {
    const data = req.body.data;
    try{
        console.log("Agregando nota...");
        city_data = await(admin.revisarExistenciaAdministracion(
            data.username));
        if(city_data.length){
            console.log(city_data);
            const resul = await admin.modificarNota(
                data.id, 
                data.nombre, 
                data.descripcion, 
                data.foto);
            if(resul.affectedRows!=0) res.status(201).send({status: 'OK'});
            else res.status(201).send({error: "No se ha actualizar nota"});
        }
    }catch (error) {
        console.log(error)
        res.status(401).send({"error":error.message})
    }
});

router.post('/establecimiento',checkPermission, async (req, res) => {
    const data = req.body.data;
    try{
        console.log("Agregando establecimiento");
        city_data = await(admin.revisarExistenciaAdministracion(
            data.username));
        if(city_data.length){
            console.log(city_data);
            const resul=(await admin.agregarEstablecimiento(
                city_data[0].ID, 
                data.nombre, 
                data.tipo, 
                (data.telefono)?data.telefono:"", 
                (data.correo)?data.correo:"", 
                (data.foto)?data.foto:null));
            
            if(resul.affectedRows!=0) res.status(201).send({status: 'OK'});
            else res.status(201).send({error: "No se ha agregado establecimiento"});
        }
    }catch (error) {
        console.log(error)
        res.status(401).send({"error":error.message})
    }
});
router.put('/establecimiento',checkPermission, async (req, res) => {
    const data = req.body.data;
    try{
        console.log("Agregando establecimiento");
        city_data = await(admin.revisarExistenciaAdministracion(
            data.username));
        if(city_data.length){
            console.log(city_data);
            const resul =(await admin.modificarEstablecimiento(
                data.establecimiento, 
                data.nombre, 
                data.tipo, 
                data.telefono, 
                data.correo, 
                data.foto));
            if(resul.affectedRows!=0) res.status(201).send({status: 'OK'});
            else res.status(201).send({error: "No se ha actualizar establecimiento"});
        }
    }catch (error) {
        console.log(error.message)
        res.status(401).send({"error":error.message})
    }
})
router.delete('/delete/:item/:id',checkPermission,async (req, res) => {
    const data = req.params;
    try {
        console.log("Eliminando elemento de ", data.item.toUpperCase());
        const resul = await admin.removeITEM(data.id, data.item.toUpperCase());
        if(resul.affectedRows!=0) res.send({ID: data.id})
        else res.send({error: "No se ha podido eliminar"});
    } catch (err) {
        console.log(error.message)
        res.status(401).send({"error":error.message})
    }
})

module.exports = router;