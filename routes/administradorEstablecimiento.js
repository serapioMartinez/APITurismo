const express = require('express');
const router = express.Router();
const admin = require('../services/administradorEstablecimiento');

const checkPermission = async function (req, res, next) {
    console.log(req.body);
    const data = req.body.data;
    try {
        const permission = await admin.checkPermission(data.username, data.pass);
        console.log(permission);
        if (permission) next()
        else res.json({ error: "Falta de permisos para realizar operación" });
    } catch (err) {
        console.log("Un error ha ocurrido mientras verificaba permisos");
        res.json({ error: err.message });
    }
};

//router.use(checkPermission);
router.post('/sesion',checkPermission, async (req,res)=> {
    console.log(req.body);
    const data = req.body.data;
    try {
        const userData = await admin.iniciarSesion(data.username, data.pass);
        
        res.status(200).json(userData)
    } catch (err) {
        res.status(400).send({error:err.message})
    }
})
router.get('/usuario', async (req, res) => {
    console.log(req.query);
    try {
        const userData =await admin.obtenerDatosUsuario(req.query.id);
        console.log(userData)
        res.status(200).json(userData[0]);
    } catch (error) {
        res.status(400).send({error: error.message})
    }
});
router.put('/usuario', async (req, res )=>{
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
router.post('/establecimiento',checkPermission, async (req, res) => {
    const data = req.body.data;
    try {
        console.log(req.body);
        const result = await admin.crearEstablecimiento(
            data.username, 
            data.nombre, 
            data.correo, 
            data.telefono, 
            data.tipo, 
            data.ciudad, 
            data.colonia, 
            data.numero, 
            data.cp, 
            data.calle, 
            data.pagina, 
            data.maps,
            data.descripcion);
        console.log(result);
        res.json(result[0]);
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.put('/establecimiento', checkPermission ,async (req, res) => {
    const data = req.body.data;
    try {
        console.log(req.body);
        const result = await admin.modificarEstablecimiento(
            data.establecimiento, 
            data.nombre, 
            data.tipo, 
            data.correo, 
            data.telefono, 
            data.pagina, 
            data.maps,
            data.descripcion);
        res.json(result[0]);
    } catch (error) {
        console.log("Error al realizar la operacion ", error.message);
        res.json({ 'error': error.message });
    }
});


router.post('/reclamarEstablecimiento', checkPermission, async (req, res) => {
    const data = req.body.data;
    try {
        console.log(req.body);
        res.json(await admin.reclamarEstablecimiento(
            data.username, 
            data.establecimiento));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});


router.post('/horarioAtencion', checkPermission, async (req, res) => {
    const data = req.body.data;
    try {
        console.log(data);
        res.json(await admin.crearHorarioAtencion(
            data.establecimiento, 
            data.lunes, 
            data.martes, 
            data.miercoles, 
            data.jueves, 
            data.viernes, 
            data.sabado, 
            data.domingo));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.put('/horarioAtencion', checkPermission, async (req, res) => {
    const data = req.body.data;
    try {
        console.log("Actualizando horario...")
        console.log(data);
        res.json(await admin.modificarHorarioAtencion(
            data.establecimiento, 
            data.lunes, 
            data.martes, 
            data.miercoles, 
            data.jueves, 
            data.viernes, 
            data.sabado, 
            data.domingo));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.post('/direccion', checkPermission, async (req, res) => {
    const data = req.body.data;
    try {
        console.log(data);
        res.json(await admin.crearDireccion(
            data.establecimiento, 
            data.ciudad, 
            data.colonia, 
            data.numero, 
            data.cp, 
            data.calle));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});

router.put('/direccion', checkPermission, async (req, res) => {
    const data = req.body.data;
    try {
        console.log(data);
        res.json(await admin.modificarDireccion(
            data.direccion, 
            data.ciudad, 
            data.colonia, 
            data.numero, 
            data.cp, 
            data.calle));
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});
router.post('/salidas/:idEstablecimiento', checkPermission, async (req, res) => {
    const data = req.body.data;
    const id = req.params.idEstablecimiento;
    try {
        console.log(data);
        const resul = await admin.insertarSalidaTransporte(
            id, 
            data.ciudad, 
            data.dia, 
            data.duracion, 
            data.horas
            )
            if(resul.length==0 || resul.affectedRows==0) res.send({error: "No se ha podido realizar el proceso"})
            else res.json({ok: "Proceso exitoso"});
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});
router.put('/salidas/:idEstablecimiento', checkPermission, async (req, res) => {
    const data = req.body.data;
    const id = req.params.idEstablecimiento;
    try {
        console.log(data);
        const resul = await admin.modificarSalidaTransporte(
            data.id,
            data.duracion, 
            data.horas
            )
            
        if(resul.length==0 || resul.affectedRows==0) res.send({error: "No se ha podido realizar el proceso"})
        else res.json({ok: "Proceso exitoso"});
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});
router.delete('/salidas/:idEstablecimiento', checkPermission, async (req, res) => {
    const data = req.body.data;
    const id = req.params.idEstablecimiento;
    try {
        console.log(data);
        const resul = await admin.eliminarSalidaTransporte(
            data.id
            )
            
        if(resul.length==0 || resul.affectedRows==0) res.send({error: "No se ha podido realizar el proceso"})
        else res.json({ok: "Proceso exitoso"});
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
});
router.delete('/horaSalida', checkPermission, async (req, res) => {
    const data = req.body.data;
    try {
        console.log(data);
        const resul = await admin.eliminarHoraSalida(
            data.id
        );
        if(resul.length==0 || resul.affectedRows==0) res.send({error: "No se ha podido realizar el proceso"})
        else res.json({ok: "Proceso exitoso"});
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });
    }
})
router.post('/subirFotoPerfil', checkPermission, async (req, res )=> {
    const data = req.body.data;
    console.log(data);
    try {
        console.log("Subiendo foto de perfil de usuario");
        res.status(201).send(await admin.subirFotoPerfil(
            data.username, 
            data.foto))
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.status(401).json({ 'error': error.message });
    }
})
router.post('/subirRepresentativa', checkPermission, async (req, res )=>{
    const data = req.body.data;
    try {
        console.log("Subiendo foto representativa de establecimiento!");
        const resul = await admin.subirRepresentativa(data.foto, data.establecimiento);
        if (resul.affectedRows==0) res.status(401).send({error: "No se ha podido actualizar "});
        else res.status(200).send(resul);
    } catch (error) {
        console.log("Error al realizar la operacion " + Date.now());
        res.json({ 'error': error.message });        
    }
})
router.post('/insertarFotos', checkPermission, async (req, res) => {
    const data = req.body.data;
    try {
        console.log("Subiendo fotos de establecimiento");
        const resul = await admin.insertarFotos(
            data.images_data, 
            data.establecimiento)
        if(resul.length==0 || resul.affectedRows==0) res.send({error: "No se ha podido realizar el proceso"})
        else res.json({ok: "Proceso exitoso"});
    } catch (error) {
        console.log(error)
        res.status(401).send({ "error": error.message })
    }
});
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

module.exports = router;